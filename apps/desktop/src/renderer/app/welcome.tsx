import React from 'react'
import { Link } from 'react-router-dom'

export function Welcome() {
  console.log(window.elwood.store.settings.get('theme'))

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-4xl font-bold">Welcome to the desktop app</div>

      <Link to="/workspace/1" className="text-blue-500 underline">
        Workspace
      </Link>
    </div>
  )
}
