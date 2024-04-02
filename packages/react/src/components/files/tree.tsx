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

export interface FilesTreeProps
  extends Omit<ITreeViewProps, 'data' | 'nodeRenderer'> {
  tree: NodeTree[];
  rootNodeId: string | null;
}

export function FilesTree(props: FilesTreeProps): JSX.Element {
  const {tree, rootNodeId, ...treeViewProps} = props;
  const treeIds = tree.map(item => item.id);
  const expandedIds = treeViewProps.expandedIds?.filter(item =>
    treeIds.includes(item as string),
  );

  if (!rootNodeId || toArray(tree).length === 0) {
    return <span />;
  }

  const data: INode<{href: string}>[] = [
    {
      name: '',
      id: rootNodeId,
      isBranch: true,
      children: tree
        .filter(item => item.parent === rootNodeId)
        .map(item => item.id),
      parent: null,
      metadata: {
        href: '',
      },
    },
    ...tree.map(item => {
      return {
        name: item.node.name,
        id: item.id,
        isBranch: item.node.type !== 'BLOB',
        parent: item.parent,
        children: tree.filter(i => i.parent === item.id).map(i => i.id),
        metadata: {
          href: createNodeLink(item.node),
          path: [...item.node.prefix, item.node.name],
          nodeType: item.node.type,
        },
      };
    }),
  ];

  return (
    <TreeView
      data={data}
      multiSelect
      nodeRenderer={renderNode}
      propagateSelectUpwards
      {...treeViewProps}
      expandedIds={expandedIds}
    />
  );
}

function renderNode(props: INodeRendererProps): JSX.Element {
  const {getNodeProps, element, isBranch, isExpanded, level, handleExpand} =
    props;
  const DirIcon = isExpanded ? Icons.ChevronDown : Icons.ChevronRight;
  const {metadata = {href: '', nodeType: 'TREE'}} = element as INode<{
    href: string;
    nodeType: NodeType;
  }>;

  return (
    <div className="flex items-center py-1">
      <button
        onClick={getNodeProps({onClick: handleExpand}).onClick}
        style={{paddingLeft: 10 * (level - 1)}}
        type="button">
        <div className="w-[12px] h-[12px] flex items-center justify-center mr-1.5">
          {isBranch ? (
            <DirIcon className="text-muted-foreground" size={12} />
          ) : null}
        </div>
      </button>
      <Link className="flex items-center" href={metadata.href}>
        <FileIcon
          className="mr-2 text-muted-foreground"
          nodeType={metadata.nodeType}
          size={14}
        />
        <span className="text-sm truncate max-w-[150px]">{element.name}</span>
      </Link>
    </div>
  );
}
