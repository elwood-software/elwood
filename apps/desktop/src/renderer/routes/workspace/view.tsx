import React, { FormEvent, useEffect, useState } from 'react'
import { createHashRouter } from 'react-router-dom'
import { dashboardRoutes, Router, ElwoodProvider, AuthForm } from '@elwood/react'
import { ElwoodClient, User, createClient } from '@elwood/js'
import { Spinner } from '@elwood/ui'
import { useMutation } from '@tanstack/react-query'

export type WorkspaceProps = {
  id: string
}

type Values = {
  email: string
  password: string
}

export default function Workspace(props: WorkspaceProps) {
  const [error, setError] = useState<string | null>(null)
  const [client, setClient] = useState<ElwoodClient | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [values, setValues] = useState<Values>({
    email: '',
    password: ''
  })
  const [isPending, setIsPending] = useState(false)

  useEffect(() => {
    const info = window.elwood.store.workspaces.get('workspaces')[props.id]

    if (!info) {
      setError('Workspace not found')
    }

    const client = createClient(info.url, info.anonKey)

    client.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null)
    })

    client.auth
      .getUser()
      .then((user) => {
        setUser(user.data?.user)
      })
      .catch((err) => {
        setError(err.message)
      })
      .finally(() => {
        setClient(client)
      })
  }, [props.id])

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setIsPending(true)
    try {
      await client?.auth.signInWithPassword(values)
    } catch (_) {
    } finally {
      setIsPending(false)
    }
  }

  if (error) {
    return <div>Error!</div>
  }

  if (client && !user) {
    return (
      <div className="size-full flex items-center justify-center">
        <AuthForm
          loading={isPending}
          onSubmit={onSubmit}
          onChange={(name, value) => setValues({ ...values, [name]: value })}
        />
      </div>
    )
  }

  if (!client || !user) {
    return (
      <div className="size-full flex items-center justify-center">
        <Spinner />
      </div>
    )
  }

  const router = createHashRouter([
    ...dashboardRoutes,
    {
      path: '/'
    }
  ])

  return (
    <div className="flex flex-row w-screen h-screen">
      <ElwoodProvider workspaceName="poop" client={client}>
        <Router router={router} />
      </ElwoodProvider>
    </div>
  )
}
