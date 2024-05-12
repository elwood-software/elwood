import type {
  INodeRendererProps,
  ITreeViewProps,
  INode,
} from 'react-accessible-treeview';
import {default as TreeView} from 'react-accessible-treeview';
import {type NodeType, type NodeTree} from '@elwood/common';
import {Icons, Spinner} from '@elwood/ui';
import {toArray} from '@elwood/common';
import {Link, createNodeLink} from '@/components/link';
import {FileIcon} from './icon';
import {Fragment, MouseEvent, MouseEventHandler} from 'react';

export interface FilesTreeProps {
  tree: NodeTree[];
  rootNodeId: string | null;
  expandedIds: string[];
  loadingIds: string[];
  onToggleExpandClick: (node: NodeTree['node']) => void;
}

export function FilesTree(props: FilesTreeProps): JSX.Element {
  const {tree, rootNodeId} = props;

  if (!rootNodeId) {
    return <></>;
  }

  return (
    <TreeNode
      expandedIds={props.expandedIds}
      loadingIds={props.loadingIds}
      parent={rootNodeId}
      tree={tree}
      level={0}
      onToggleExpandClick={props.onToggleExpandClick}
    />
  );
}

type TreeNodeProps = Pick<
  FilesTreeProps,
  'onToggleExpandClick' | 'expandedIds' | 'loadingIds'
> & {
  parent: string;
  tree: NodeTree[];
  level: number;
};

function TreeNode(props: TreeNodeProps) {
  const {expandedIds = [], loadingIds = []} = props;
  const nodes = props.tree.filter(node => node.parent === props.parent);

  if (nodes.length === 0) {
    return <></>;
  }

  return (
    <div>
      {nodes.map(node => {
        return (
          <Fragment key={`TreeNodes-${node.id}`}>
            {node.parent !== 'root' && (
              <TreeNodeItem
                name={node.node.name ?? ''}
                nodeType={node.node.type}
                href={createNodeLink(node.node)}
                level={props.level + 1}
                open={expandedIds.includes(node.node.id)}
                loading={loadingIds.includes(node.node.id)}
                onToggleExpandClick={e => {
                  e.preventDefault();
                  props.onToggleExpandClick(node.node);
                }}
              />
            )}
            {node.node.type !== 'BLOB' && expandedIds.includes(node.node.id) ? (
              <div>
                <TreeNode
                  {...props}
                  parent={node.node.id}
                  tree={props.tree}
                  level={props.level + 1}
                />
              </div>
            ) : null}
          </Fragment>
        );
      })}
    </div>
  );
}

type TreeNodeItemProps = {
  open: boolean;
  loading: boolean;
  onToggleExpandClick: MouseEventHandler;
  href: string;
  nodeType: NodeType;
  name: string;
  level: number;
};

function TreeNodeItem(props: TreeNodeItemProps): JSX.Element {
  const {
    onToggleExpandClick,
    level,
    href,
    nodeType,
    name,
    open = false,
    loading = false,
  } = props;
  const DirIcon = open ? Icons.ChevronDown : Icons.ChevronRight;
  const isBranch = nodeType !== 'BLOB';

  return (
    <div className="flex items-center py-1">
      <div
        className="size-[12px] flex items-center justify-center mr-1.5"
        style={{marginLeft: 10 * (level - 1)}}>
        {loading && (
          <Spinner className="mr-1 size-[10px] stroke-muted-foreground" />
        )}
        {!loading && (
          <button onClick={onToggleExpandClick} type="button">
            <div className="size-[12px] flex items-center justify-center ">
              {isBranch ? (
                <DirIcon className="text-muted-foreground" size={12} />
              ) : null}
            </div>
          </button>
        )}
      </div>
      <Link className="flex items-center" href={href}>
        <FileIcon
          className="mr-2 text-muted-foreground"
          nodeType={nodeType}
          size={14}
        />
        <span className="text-sm truncate max-w-[150px]">{name}</span>
      </Link>
    </div>
  );
}
