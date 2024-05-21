import { PropsWithChildren, createContext, useState } from 'react'

const WorkspaceManagerContext = createContext<[][]>([])

export function WorkspaceManagerProvider(props: PropsWithChildren) {
  return (
    <WorkspaceManagerContext.Provider value={[]}>{props.children}</WorkspaceManagerContext.Provider>
  )
}
