import { app, BrowserWindow, ipcMain } from 'electron'

import { createMainWindow, getCurrentMainWindow } from './windows/main'
import { createStore, attachStoreToIpc } from './store/store'
import { log } from './util'
import { attachIpc } from './ipc'

log.info('Starting Elwood')

attachIpc(ipcMain)

app.whenReady().then(async () => {
  log.info('App is ready')

  const store = await createStore()
  attachStoreToIpc(store, ipcMain)

  log.info('Store is ready')

  await createMainWindow(store)

  log.info('Main window is ready')

  app.on('activate', function () {
    log.info('App is activated')

    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
      getCurrentMainWindow()
    }
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  log.info('App is closing')

  if (process.platform !== 'darwin') {
    app.quit()
  }
})
