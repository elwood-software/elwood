import React from 'react'
import { Outlet } from 'react-router-dom'

export function Layout() {
  return (
    <div className="grid grid-cols-[80px_auto] w-full h-full">
      <div className="pt-10 drag">menu</div>
      <div className="bg-background">
        <Outlet />
      </div>
    </div>
  )
}
