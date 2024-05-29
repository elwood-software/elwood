import { ElwoodThemeProvider, useTheme } from '@elwood/ui'
import { useEffect, type PropsWithChildren } from 'react'

export function ThemeBridge(props: PropsWithChildren): JSX.Element {
  const { value, change } = useTheme()

  useEffect(() => {
    return window.elwood.ipc.on('app', (event, type) => {
      window.elwood.log('info', 'Theme changed', type)
      console.log(event, type)
    })
  }, [])

  useEffect(() => {
    window.elwood.ipc.send('app', 'theme-change', value)
  }, [change])

  return <ElwoodThemeProvider>{props.children}</ElwoodThemeProvider>
}
3
