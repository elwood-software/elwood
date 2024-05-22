import { useState } from 'react'
import { Sidebar } from '../components/sidebar'

export function useSidebar() {
  const [workspaces] = useState(
    Object.values(window.elwood.store.workspaces.get('workspaces')) ?? []
  )

  return <Sidebar workspaces={workspaces} />
}
