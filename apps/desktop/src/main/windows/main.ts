/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 */

import { shell, BrowserWindow } from 'electron'
import { join } from 'path'
import { is } from '@electron-toolkit/utils'

import icon from '../../../resources/icon.png?asset'
import { Store } from '../store/store'
import { log, isDebug } from '../util'

let currentMainWindow: BrowserWindow | null = null

export function getCurrentMainWindow(): BrowserWindow | null {
  return currentMainWindow
}

export async function createMainWindow(store: Store): Promise<BrowserWindow> {
  log.info('Creating main window')

  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    vibrancy: 'sidebar',
    autoHideMenuBar: true,
    titleBarStyle: 'hiddenInset',
    backgroundColor: 'rgba(0, 0, 0, 0)',
    transparent: true,
    frame: false,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.mjs'),
      sandbox: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    log.info('Main window is ready to show')
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(
      join(__dirname, isDebug() ? '../../renderer/index.html' : '../renderer/index.html')
    )
  }

  log.info('Main window is loading')

  currentMainWindow = mainWindow
  return mainWindow
}
