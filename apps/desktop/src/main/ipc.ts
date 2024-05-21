import { ipcMain } from 'electron'
import { log } from './util'

import { getCurrentMainWindow } from './windows/main'
import { createWorkspaceWindow } from './windows/workspace'

export type LogEventData = {
  level: string
  message: string
  data: any
}

export function attachIpc(ipc: typeof ipcMain): void {
  ipc.on('electron-log', async (_event, data: LogEventData) => {
    log[data.level](`[RENDER] ${data.message}`, data.data)
  })

  ipc.on('workspace-sync', async (event, type, data) => {
    log.info('Workspace sync', type, data)

    switch (type) {
      case 'add': {
        const id = '1'

        const win = getCurrentMainWindow()!
        const view = await createWorkspaceWindow(id, win)

        // const { width, height } = win!.getBounds()

        // view.setBackgroundColor('#fff')
        // view.setVisible(true)

        // console.log(win.contentView.children)

        event.returnValue = '1'
        break
      }

      default:
        event.returnValue = null
    }
  })
}
