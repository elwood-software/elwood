import { ipcMain } from 'electron'
import { randomUUID } from 'node:crypto'
import { log } from './util'
import type { Store } from './store/store'

export type LogEventData = {
  level: string
  message: string
  data: any
}

export function attachIpc(store: Store, ipc: typeof ipcMain): void {
  ipc.on('electron-log', async (_event, data: LogEventData) => {
    log[data.level](`[RENDER] ${data.message}`, data.data)
  })

  ipc.on('workspace-sync', async (event, type, data) => {
    log.info('Workspace sync', type, data)

    switch (type) {
      case 'add': {
        log.debug('Adding workspace', data.url, data.anonKey, data.name)

        const workspaceId = randomUUID()

        await store.merge('workspaces', 'workspaces', {
          [workspaceId]: {
            id: workspaceId,
            url: data.url,
            anonKey: data.anonKey,
            name: data.name
          }
        })

        log.debug('Workspace added', workspaceId)

        store.workspaces.last_active_id = workspaceId

        event.returnValue = workspaceId

        break
      }

      default:
        event.returnValue = null
    }
  })
}
