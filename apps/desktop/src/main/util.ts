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
