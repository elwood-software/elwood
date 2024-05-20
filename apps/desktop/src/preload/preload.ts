import { ipcRenderer, IpcRendererEvent } from 'electron'

import type { StoreGetData, StoreSetData, StoreGetResult } from '../main/store/store'

export type Channels = 'app' | 'workspace'

export const api = {
  store: {
    get(data: StoreGetData): StoreGetResult<StoreGetData['store'], StoreGetData['name']> {
      return ipcRenderer.sendSync('electron-store-get', data)
    },
    set(data: StoreSetData): void {
      ipcRenderer.send('electron-store-set', data)
    }
  },
  ipc: {
    send(channel: Channels, ...args: unknown[]): void {
      ipcRenderer.send(channel, ...args)
    },
    on(channel: Channels, func: (...args: unknown[]) => void): () => void {
      const subscription = (_event: IpcRendererEvent, ...args: unknown[]): void => func(...args)
      ipcRenderer.on(channel, subscription)

      return () => {
        ipcRenderer.removeListener(channel, subscription)
      }
    },
    once(channel: Channels, func: (...args: unknown[]) => void): void {
      ipcRenderer.once(channel, (_event, ...args) => func(...args))
    }
  }
}
