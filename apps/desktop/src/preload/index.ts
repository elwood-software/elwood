import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import { createStoresIpcRenderer } from '../main/store/renderer-api'
import { getRendererHTMLPath, getRendererPreloadPath } from '../main/util'

export type Channels = 'app' | 'workspace' | 'store'

export const api = {
  renderer: {
    html: getRendererHTMLPath(),
    preload: getRendererPreloadPath()
  },

  store: createStoresIpcRenderer(ipcRenderer),
  log(level: 'debug' | 'info' | 'error', message: string, data?: any): void {
    console.log('log', level, message, data)
    ipcRenderer.send('electron-log', { level, message, data })
  },
  ipc: {
    send(channel: Channels, ...args: unknown[]): void {
      ipcRenderer.send(channel, ...args)
    },
    sendSync(channel: Channels, ...args: unknown[]): unknown {
      return ipcRenderer.sendSync(`${channel}-sync`, ...args)
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

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('elwood', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.elwood = api
}
