import type { ipcRenderer } from 'electron'
import type { z } from 'zod'

import type { StoreName, Stores, Schemas } from './store'
import type { SettingsSchema, WorkspacesSchema } from './schema'

const storeNames: StoreName[] = ['settings', 'workspaces']

export type StoreRendererApi<S> = {
  get<N extends keyof S>(name: N): S[N]
  set<N extends keyof S>(name: N, value: S[N]): void
}

export type StoreIpcRenderers = {
  settings: StoreRendererApi<SettingsSchema>
  workspaces: StoreRendererApi<WorkspacesSchema>
}

export function createStoresIpcRenderer(ipc: typeof ipcRenderer): StoreIpcRenderers {
  return storeNames.reduce((acc, store: StoreName) => {
    return {
      ...acc,
      [store]: {
        get(name: keyof Schemas): Schemas[keyof Schemas] {
          return ipc.sendSync('electron-store-get', {
            store,
            name
          }) as Schemas[keyof Schemas]
        },
        set<N extends keyof z.infer<(typeof Stores)[keyof typeof Stores]>>(
          name: N,
          value: z.infer<(typeof Stores)[keyof typeof Stores]>[N]
        ) {
          ipc.send('electron-store-set', {
            store,
            name,
            value
          })
        }
      }
    }
  }, {}) as StoreIpcRenderers
}
