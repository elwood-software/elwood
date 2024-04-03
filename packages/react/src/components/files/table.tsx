import {toArray} from '@elwood/common';
import type {NodeRecord} from '@elwood/common';
import {Link, NodeLink} from '../link';
import {FileIcon} from './icon';

export interface FilesTableProps {
  nodes: NodeRecord[] | undefined;
  prefix?: string[] | undefined;
}

export function FilesTable(props: FilesTableProps): JSX.Element {
  const {nodes, prefix} = props;
  const parent = _getParentPath(prefix);

  return (
    <table className="w-full bg-sidebar rounded">
      <tbody className="divide-y divide-outline">
        {parent !== undefined ? (
          <tr key="FilesTable-row-up">
            <td className="w-4">
              <div className="py-2 pl-6 text-muted-foreground">
                <FileIcon nodeType="TREE" size={16} />
              </div>
            </td>
            <td>
              <div className="px-3 py-2">
                <Link
                  className="text-muted-foreground"
                  href={`/tree/${parent.bucketId}/${parent.path}`}>
                  ...
                </Link>
              </div>
            </td>
          </tr>
        ) : null}

        {toArray(nodes).map(row => {
          return (
            <tr key={`FilesTable-row-${row.id}`}>
              <td className="w-4">
                <div className="py-2 pl-6 text-muted-foreground">
                  <FileIcon nodeType={row.type ?? 'BLOB'} size={16} />
                </div>
              </td>
              <td>
                <div className="px-3 py-2">
                  <NodeLink node={row}>{row.name}</NodeLink>
                </div>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

function _getParentPath(
  prefix: string[] | undefined,
): {bucketId: string; path: string} | undefined {
  if (!prefix) {
    return undefined;
  }

  const parts = [...prefix];
  parts.pop();

  if (parts.length === 0) {
    return undefined;
  }

  const bucketId = parts.shift() ?? '';
  return {bucketId, path: parts.join('/')};
}
