import { Link } from 'react-router-dom'

export type SidebarProps = {
  workspaces: Array<{ id: string; name: string }>
}

export function Sidebar(props: SidebarProps) {
  const { workspaces = [] } = props

  return (
    <div>
      <nav className="space-y-3">
        {workspaces.map((workspace) => {
          const nameParts = (workspace.name ?? 'Unknown Workspace')
            .split(' ')
            .map((str) => str.charAt(0))
            .slice(0, 2)

          return (
            <Link
              to={`/workspace/${workspace.id}`}
              key={`SidebarNavWorkspace-${workspace.id}`}
              className="block w-full pb-[50%] rounded-lg relative bg-background/50 no-drag border"
            >
              <div className="opacity-0" aria-hidden>
                {nameParts.join('')}
              </div>
              <div className="absolute top-0 left-0 size-full flex items-center justify-center font-bold">
                {nameParts.join('')}
              </div>
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
