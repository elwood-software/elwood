/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 */

import { shell, BrowserWindow } from 'electron'

import icon from '../../../resources/icon.png?asset'
import { Store } from '../store/store'
import { log, getRendererHTMLPath, getRendererPreloadPath } from '../util'

let currentMainWindow: BrowserWindow | null = null

export function getCurrentMainWindow(): BrowserWindow | null {
  return currentMainWindow
}

export async function createMainWindow(_store: Store): Promise<BrowserWindow> {
  log.info('Creating main window')

  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1024,
    height: 1024,
    show: false,
    vibrancy: 'sidebar',
    autoHideMenuBar: true,
    titleBarStyle: 'hiddenInset',
    backgroundColor: 'rgba(0, 0, 0, 0)',
    transparent: true,
    frame: false,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      webviewTag: true,
      preload: getRendererPreloadPath(),
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
  const url = getRendererHTMLPath()

  if (url.startsWith('http')) {
    mainWindow.loadURL(url)
  } else {
    mainWindow.loadFile(url)
  }

  log.info('Main window is loading')

  currentMainWindow = mainWindow
  return mainWindow
}
