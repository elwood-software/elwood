import { ipcMain } from 'electron'
import { join } from 'node:path'
import { z } from 'zod'

import { JSONFilePreset } from 'lowdb/node'
import type { Low } from 'lowdb'
import { JsonObject, invariant } from '@elwood/common'

import { getElwoodHomeDir, log } from '../util'
import { Settings, Workspaces, SettingsSchema, WorkspacesSchema } from './schema'

type Stores = typeof Settings | typeof Workspaces
export type Schemas = SettingsSchema | WorkspacesSchema

export type StoreName = 'settings' | 'workspaces'

export const Stores: Record<StoreName, Stores> = {
  settings: Settings,
  workspaces: Workspaces
}

export type StoreApi = {
  settings: SettingsSchema
  workspaces: WorkspacesSchema
}

export class Store {
  private dbs: Partial<{
    [key in StoreName]: Low<z.infer<(typeof Stores)[key]>>
  }> = {}

  settings: SettingsSchema = Settings.safeParse({}).data!
  workspaces: WorkspacesSchema = Workspaces.safeParse({}).data!

  constructor() {}

  async setup() {
    let dir = getElwoodHomeDir()

    for (const store in Stores) {
      const defaults = Stores[store].safeParse({}).data

      this.dbs[store] = await JSONFilePreset<z.infer<(typeof Stores)[StoreName]>>(
        join(dir, `${store}.json`),
        defaults
      )

      await this.dbs[store].write()

      for (const key in defaults) {
        Object.defineProperty(this[store], key, {
          enumerable: true,
          configurable: true,
          get: () => {
            return this.dbs[store].data[key]
          },
          set: (value) => {
            this.dbs[store]
              .update((current) => {
                current[key] = value
              })
              .then(() => {
                ipcMain.emit('electron-store-update', { store, key, value })
              })
          }
        })
      }
    }

    return this
  }

  async merge(store: StoreName, key: string, value: JsonObject) {
    const db = this.dbs[store]
    invariant(db, `Store ${store} does not exist`)

    await db.update((current) => {
      current[key] = {
        ...current[key],
        ...value
      }
    })
  }
}

let currentStore = new Store()

export async function createStore() {
  return await currentStore.setup()
}

export type StoreGetData = {
  store: keyof Stores
  name: keyof Schemas
}

export type StoreSetData = {
  store: keyof Stores
  name: keyof Schemas
  value: any
}

export function attachStoreToIpc(store: Store, ipc: typeof ipcMain) {
  ipc.on('electron-store-get', async (event, data: StoreGetData) => {
    event.returnValue = store[data.store][data.name]
  })
  ipc.on('electron-store-set', async (_event, data: StoreSetData) => {
    store[data.store][data.name] = data.value
  })
}
