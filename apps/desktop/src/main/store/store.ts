import type { ipcMain } from 'electron'
import { app } from 'electron'
import { join } from 'path'

import { z } from 'zod'
import { JSONFilePreset } from 'lowdb/node'
import type { Low } from 'lowdb'

import { Settings, Workspaces, SettingsSchema, WorkspacesSchema } from './schema'

type Stores = typeof Settings | typeof Workspaces

const Stores: Record<string, Stores> = {
  settings: Settings,
  workspaces: Workspaces
}

type StoreName = keyof typeof Stores

export class Store {
  #hasSetup = false

  #dbs: Record<StoreName, Low<z.infer<(typeof Stores)[StoreName]>>> = {}

  settings: SettingsSchema = {}

  constructor() {}

  async setup() {
    if (this.#hasSetup) {
      return this
    }

    this.#hasSetup = true

    let dir = join(app.getPath('home'), '.elwood')

    for (const store in Stores) {
      this.#dbs[store] = await JSONFilePreset<z.infer<(typeof Stores)[typeof store]>>(
        join(dir, `${store}.json`),
        Stores[store].safeParse({}).data
      )
    }

    Object.entries(Settings.default({})).forEach(([key, value]) => {
      Object.defineProperty(this.settings, key, {
        get: () => {
          return this.#dbs.settings.data[key]
        },
        set(value) {
          this.#dbs.settings.update(() => {
            return {
              [key]: value
            }
          })
        }
      })
    })

    return this
  }

  async get<S extends keyof typeof Stores>(
    store: S,
    name: keyof z.infer<(typeof Stores)[S]>
  ): Promise<z.infer<(typeof Stores)[S]> | undefined> {
    return this.#dbs[store].data[name]
  }

  async set<
    S extends keyof typeof Stores,
    N extends keyof z.infer<(typeof Stores)[S]>,
    V extends z.infer<(typeof Stores)[S]>[N]
  >(store: S, name: N, value: V) {
    const schema = Stores[store]
    const db = this.#dbs[store]

    // make sure the item validates
    const nextValue = schema.parse({
      [name]: value
    })

    await db.update(() => nextValue)
  }
}

let currentStore = new Store()

export async function createStore() {
  return await currentStore.setup()
}

export type StoreGetData = {
  store: Parameters<Store['get']>[0]
  name: Parameters<Store['get']>[1]
}
export type StoreSetData = {
  store: Parameters<Store['set']>[0]
  name: Parameters<Store['set']>[1]
  value: Parameters<Store['set']>[2]
}

export type StoreGetResult<
  S extends keyof typeof Stores,
  N extends keyof z.infer<(typeof Stores)[S][0]>
> = z.infer<(typeof Stores)[S][0]>[N] | undefined

export function attachStoreToIpc(store: Store, ipc: typeof ipcMain) {
  ipc.on('electron-store-get', async (event, data: StoreGetData) => {
    event.returnValue = store[data.store][data.name]
  })
  ipc.on('electron-store-set', async (_event, data: StoreSetData) => {
    store[data.store][data.name] = data.value
  })
}
