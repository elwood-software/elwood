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

export async function createMainWindow(store: Store): Promise<BrowserWindow> {
  log.info('Creating main window')

  const { last_width, last_height, last_x, last_y } = store.settings
  const optional = {}

  if (last_x || last_y) {
    optional['x'] = last_x
    optional['y'] = last_y
  }

  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: last_width,
    height: last_height,
    show: false,
    vibrancy: 'sidebar',
    autoHideMenuBar: true,
    titleBarStyle: 'hiddenInset',
    backgroundColor: 'rgba(0, 0, 0, 0)',
    transparent: true,
    frame: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    ...optional,
    webPreferences: {
      webviewTag: true,
      preload: getRendererPreloadPath(),
      sandbox: false
    }
  })

  mainWindow.on('moved', () => {
    const [x, y] = mainWindow.getPosition()
    store.settings.last_x = x
    store.settings.last_y = y
  })

  mainWindow.on('resized', () => {
    const { width, height } = mainWindow.getBounds()
    store.settings.last_width = width
    store.settings.last_height = height
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
