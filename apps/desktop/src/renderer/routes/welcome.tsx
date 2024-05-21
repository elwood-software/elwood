import React, { FormEvent, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import type { JsonObject } from '@elwood/common'

import { Logo, Button, Input } from '@elwood/ui'

export function Welcome() {
  const navigate = useNavigate()
  const [value, setValue] = useState('')
  const [anonKeyValue, setAnonKeyValue] = useState('')
  const [showAnonKey, setShowAnonKey] = useState(false)

  useEffect(() => {
    const lastActiveId = window.elwood.store.workspaces.get('last_active_id')

    if (lastActiveId) {
      navigate(`/workspace/${lastActiveId}`)
    }
  }, [])

  function goToWorkspaceAuth(anonKey: string, workspaceName: string = 'New Workspace') {
    const workspaceId = window.elwood.ipc.sendSync('workspace', 'add', {
      url: value,
      anonKey,
      name: workspaceName
    })

    if (!workspaceId) {
      throw new Error('Failed to add workspace')
    }

    navigate(`/workspace/${workspaceId}`)
  }

  const { isPending, mutate } = useMutation({
    async mutationFn() {
      const url = new URL(value)
      url.pathname = '/functions/v1/elwood/discover'

      try {
        const response = await fetch(url.toString(), {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        })

        const data = (await response.json()) as {
          anon_key: string
          workspace_name: { default: string }
        }

        console.log(data)

        goToWorkspaceAuth(data.anon_key, data.workspace_name.default)
      } catch (err) {
        console.log(err)

        setShowAnonKey(true)
        return
      }
    }
  })

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()

    if (anonKeyValue) {
      goToWorkspaceAuth(anonKeyValue)
      return
    }

    mutate()
  }

  return (
    <div className="bg-background/75 text-foreground">
      <div className="flex flex-col items-center justify-center h-screen p-12">
        <Logo className="fill-foreground size-[10vh] mb-6" />
        <h1 className="text-3xl font-bold">Hello, Welcome to Elwood</h1>

        <div className="w-full shadow-xl mt-12">
          <div className="text-sm mb-3 ml-6 sr-only">
            Enter your Supabase API URL to get started...
          </div>
          <form onSubmit={onSubmit} className="flex space-x-3 items-center">
            <Input
              required={true}
              placeholder="https://fasdakoaedkad.supabase.co"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="placeholder:text-muted-foreground/75"
            />

            {showAnonKey && (
              <Input
                required={true}
                placeholder="eyJhbGciOiJIUzI1Ni"
                value={anonKeyValue}
                onChange={(e) => setAnonKeyValue(e.target.value)}
                className="placeholder:text-muted-foreground/75"
              />
            )}

            <Button type="submit" size="lg" loading={isPending}>
              Continue
            </Button>
          </form>
        </div>
        <div className="fixed bottom-0 left-0 w-full text-center text-xs opacity-20 pb-3">
          &copy; {new Date().getFullYear()} Elwood Technology, LLC
        </div>
      </div>
    </div>
  )
}
