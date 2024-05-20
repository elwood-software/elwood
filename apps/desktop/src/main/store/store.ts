import type { ipcMain } from 'electron'
import { join } from 'node:path'
import { z } from 'zod'

import { JSONFilePreset } from 'lowdb/node'
import type { Low } from 'lowdb'

import { getElwoodHomeDir } from '../util'
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

  settings: Partial<SettingsSchema> = {}
  workspaces: Partial<WorkspacesSchema> = {}

  constructor() {}

  async setup() {
    let dir = getElwoodHomeDir()

    for (const store in Stores) {
      const defaults = Stores[store].safeParse({}).data

      this.dbs[store] = await JSONFilePreset<z.infer<(typeof Stores)[StoreName]>>(
        join(dir, `${store}.json`),
        defaults
      )

      this.dbs[store].write()

      Object.keys(defaults).forEach((key) => {
        Object.defineProperty(this.settings, key, {
          enumerable: true,
          get: () => {
            return this.dbs[store].data[key]
          },
          set(value) {
            this.dbs[store].update(() => {
              return {
                [key]: value
              }
            })
          }
        })
      })
    }

    return this
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
