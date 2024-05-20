import { app } from 'electron'
import { join } from 'node:path'
import { mkdirSync } from 'node:fs'
import logger from 'electron-log/main'

logger.transports.file.resolvePathFn = () =>
  join(getElwoodHomeDir('logs'), `main-${isDebug() ? 'dev' : 'prod'}.log`)

logger.initialize()

export const log = {
  info: logger.info,
  warn: logger.warn,
  error: logger.error,
  debug: logger.debug,
  logger
}

export function getElwoodHomeDir(...child: string[]): string {
  const dir = join(app.getPath('home'), '.elwood', ...child)
  mkdirSync(dir, { recursive: true })
  return dir
}

export async function installExtensions(): Promise<void> {
  const installer = require('electron-devtools-installer')
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS
  const extensions = ['REACT_DEVELOPER_TOOLS']

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload
    )
    .catch(console.log)
}

export function isDebug(cb?: () => void): boolean {
  if (cb) {
    if (isDebug()) {
      cb()
    }
  }

  return process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true'
}

export function isProduction(cb?: () => void): boolean {
  if (cb) {
    if (isProduction()) {
      cb()
    }
  }

  return process.env.NODE_ENV === 'production'
}
