import type {
  INodeRendererProps,
  ITreeViewProps,
  INode,
} from 'react-accessible-treeview';
import {default as TreeView} from 'react-accessible-treeview';
import {type NodeType, type NodeTree} from '@elwood/common';
import {Icons} from '@elwood/ui';
import {toArray} from '@elwood/common';
import {Link, createNodeLink} from '@/components/link';
import {FileIcon} from './icon';
import {Fragment, MouseEvent, MouseEventHandler} from 'react';

export interface FilesTreeProps {
  tree: NodeTree[];
  rootNodeId: string | null;
}

export function FilesTree(props: FilesTreeProps): JSX.Element {
  const {tree, rootNodeId} = props;

  if (!rootNodeId) {
    return <></>;
  }

  return <TreeNode parent={rootNodeId} tree={tree} level={0} />;
}

type TreeNodeProps = {
  parent: string;
  tree: NodeTree[];
  level: number;
};

function TreeNode(props: TreeNodeProps) {
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
                level={props.level}
                open={false}
                onOpenClick={e => {}}
              />
            )}
            {node.node.type !== 'BLOB' ? (
              <div>
                <TreeNode
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
  onOpenClick: MouseEventHandler;
  href: string;
  nodeType: NodeType;
  name: string;
  level: number;
};

function TreeNodeItem(props: TreeNodeItemProps): JSX.Element {
  const {onOpenClick, level, href, nodeType, name, open = false} = props;
  const DirIcon = open ? Icons.ChevronDown : Icons.ChevronRight;
  const isBranch = nodeType !== 'BLOB';

  return (
    <div className="flex items-center py-1">
      <button
        onClick={onOpenClick}
        style={{paddingLeft: 10 * (level - 1)}}
        type="button">
        <div className="w-[12px] h-[12px] flex items-center justify-center mr-1.5">
          {isBranch ? (
            <DirIcon className="text-muted-foreground" size={12} />
          ) : null}
        </div>
      </button>
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
