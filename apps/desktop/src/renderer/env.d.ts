import type { ElectronAPI } from '@electron-toolkit/preload'
import type { api } from '../preload'

declare global {
  interface Window {
    electron: ElectronAPI
    elwood: typeof api
  }
}
