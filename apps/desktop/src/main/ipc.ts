import { ipcMain } from 'electron'
import { log } from './util'

export type LogEventData = {
  level: string
  message: string
  data: any
}

export function attachIpc(ipc: typeof ipcMain): void {
  ipc.on('electron-log', async (_event, data: LogEventData) => {
    log[data.level](`[RENDER] ${data.message}`, data.data)
  })
}
