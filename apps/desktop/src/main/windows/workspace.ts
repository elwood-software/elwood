/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 */

import { BrowserWindow, WebContentsView } from 'electron'
import { join } from 'path'
import { is } from '@electron-toolkit/utils'
import { log, isDebug } from '../util'

const workspaceWindows: Map<string, WebContentsView> = new Map()

export async function createWorkspaceWindow(
  id: string,
  parent: BrowserWindow
): Promise<WebContentsView> {
  log.info('Creating workspace view')

  // Create the browser window.
  const view = new WebContentsView({})

  parent.contentView.addChildView(view)

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    view.webContents.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    view.webContents.loadFile(
      join(__dirname, isDebug() ? '../../renderer/index.html' : '../renderer/index.html'),
      {
        query: {
          workspace: id
        }
      }
    )
  }

  view.setBounds({ x: 0, y: 0, width: 100, height: 100 })
  view.setVisible(true)

  log.info('workspace view is loading')

  workspaceWindows.set(id, view)

  return view
}
