import React, { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useMeasure } from 'react-use'
import { Spinner } from '@elwood/ui'

export function WorkspaceFrame() {
  const portal = useRef<HTMLDivElement>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [wrapper, { width, height }] = useMeasure<HTMLDivElement>()
  const [tag, setTag] = useState<Electron.WebviewTag | null>(null)

  const params = useParams()
  const webViewId = `workspace-${params.id}`

  useEffect(() => {
    setIsLoading(true)

    window.elwood.log('debug', 'starting load', { id: webViewId })
    const webview = document.createElement('webview')

    webview.id = webViewId
    webview.src = `${window.elwood.renderer.html}?workspace=${params.id}`
    webview.preload = `file://${window.elwood.renderer.preload}`
    webview.nodeintegration = true
    webview.partition = `persist:${params.id}`

    // @ts-ignore -- Travis: The type says only "transparent" is allowed, but al webpreferences are allowed
    webview.webpreferences = ['sandbox=false'].join(',')

    webview.setAttribute('style', `display:none;`)

    webview.addEventListener('did-start-loading', () => {
      window.elwood.log('debug', 'webview loading', { id: webViewId })
    })
    webview.addEventListener('did-stop-loading', () => {
      window.elwood.log('debug', 'webview stop loading', { id: webViewId })
    })

    webview.addEventListener('did-finish-load', () => {
      setIsLoading(false)
      webview.style.display = 'inline-flex'
      window.elwood.log('debug', 'webview loaded', { id: webViewId })
    })

    webview.addEventListener('did-fail-load', (err) => {
      window.elwood.log('debug', 'webview error', { id: webViewId, err })
    })

    portal.current?.appendChild(webview)

    setTag(webview)

    return function unload() {
      webview.remove()
    }
  }, [params.id])

  useEffect(() => {
    if (tag) {
      tag.style.width = `${width}px`
      tag.style.height = `${height}px`
    }
  }, [width, height])

  return (
    <div className="w-full h-screen" ref={wrapper}>
      {isLoading && (
        <div className="flex items-center justify-center size-full">
          <Spinner />
        </div>
      )}
      <span ref={portal} />
    </div>
  )
}
