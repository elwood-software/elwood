import React, { FormEvent, useEffect, useRef, useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'

import { Card } from '@elwood/ui'
import { AuthForm } from '@elwood/react'
import { createClient, ElwoodClient } from '@elwood/js'

export function AuthWorkspace() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const url = params.get('url')
  const anonKey = params.get('anonKey')
  const [client, setClient] = useState<ElwoodClient | null>(null)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setClient(
      createClient(url!, anonKey!, {
        auth: {
          autoRefreshToken: false,
          detectSessionInUrl: false,
          persistSession: false,
          storageKey: Math.random().toString()
        }
      })
    )
  }, [url, anonKey])

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setLoading(true)

    try {
      const result = await client!.auth.signInWithPassword({
        email,
        password
      })

      const id = window.elwood.ipc.sendSync('workspace', 'add', {
        url,
        anonKey,
        auth_response: result.data
      })

      navigate(`/workspace/${id}`)
    } catch (err) {
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center w-full h-full justify-center bg-background">
      {!anonKey || (!url && <div>You're missing a url or anon key</div>)}

      <AuthForm
        onSubmit={onSubmit}
        loading={loading}
        onChange={(name, value) => {
          if (name === 'email') {
            setEmail(value)
          } else {
            setPassword(value)
          }
        }}
      />
    </div>
  )
}
