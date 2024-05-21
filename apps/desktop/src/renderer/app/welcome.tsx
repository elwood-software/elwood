import React, { FormEvent, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'

import { Logo, Button, Input, Card } from '@elwood/ui'

export function Welcome() {
  const navigate = useNavigate()
  const [value, setValue] = useState('')
  const [anonKeyValue, setAnonKeyValue] = useState('')
  const [showAnonKey, setShowAnonKey] = useState(false)

  function goToWorkspaceAuth() {
    const params = new URLSearchParams({
      url: value,
      anonKey: anonKeyValue
    })

    navigate(`/auth-workspace?${params.toString()}`)
  }

  const { isPending, mutate } = useMutation({
    async mutationFn() {
      const url = new URL(value)
      url.pathname = '/functions/v1/elwood'

      try {
        const response = await fetch(url.toString(), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            action: 'discover'
          })
        })

        const data = await response.json()

        setAnonKeyValue(data.anonKey)
        goToWorkspaceAuth()
      } catch (_) {
        setShowAnonKey(true)
        return
      }
    }
  })

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()

    if (anonKeyValue) {
      goToWorkspaceAuth()
      return
    }

    mutate()
  }

  function addTest() {
    const r = window.elwood.ipc.sendSync('workspace', 'add', {
      poop: 1
    })

    console.log(r)
  }

  return (
    <div className="bg-background/75 text-foreground">
      <div className="flex flex-col items-center justify-center h-screen p-12">
        <Logo className="fill-foreground w-3/4 max-h-[40vh] mb-12" />
        <Card className="w-full shadow-xl">
          <div className="text-sm mb-3">Enter your Supabase API URL to get started...</div>
          <form onSubmit={onSubmit} className="flex space-x-6 items-center">
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
        </Card>
        <div className="text-xs opacity-20 mt-3">
          &copy; {new Date().getFullYear()} Elwood Technology, LLC
        </div>

        <button onClick={addTest}>Add Test</button>
      </div>
    </div>
  )
}
