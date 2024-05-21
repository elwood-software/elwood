import React from 'react'
import { useParams } from 'react-router-dom'

export function WorkspaceFrame() {
  const params = useParams()

  return <div>poop {params.id}</div>
}
