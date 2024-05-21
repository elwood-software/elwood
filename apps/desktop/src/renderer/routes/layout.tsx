import React from 'react'
import { Outlet } from 'react-router-dom'

import { useSidebar } from '../hooks/use-sidebar'

export function Layout() {
  const sidebar = useSidebar()

  return (
    <div className="grid grid-cols-[80px_auto] w-full h-full">
      <div className="pt-10 px-3 drag">{sidebar}</div>
      <div className="bg-background">
        <Outlet />
      </div>
    </div>
  )
}
