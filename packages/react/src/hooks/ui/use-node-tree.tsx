import type {Reducer} from 'react';
import {createElement, useEffect, useReducer} from 'react';
import type {NodeTree} from '@elwood/common';
import type {ITreeViewOnLoadDataProps} from 'react-accessible-treeview';
import {toArray} from '@elwood/common';
import {FilesTree, type FilesTreeProps} from '@/components/files/tree';
import {getNodeTree} from '@/data/node/use-get-node-tree';
import {getNode} from '@/data/node/use-get-node';
import {useClient} from '../use-client';

interface TreeState {
  rootNodeId: string | null;
  tree: NodeTree[];
  expandedIds: string[];
  loadingIds: string[];
  hasLoadedIds: string[];
}

type TreeAction =
  | {
      type: 'ADD';
      value: NodeTree;
    }
  | {
      type: 'LOADING';
      value: {
        id: string;
        value: boolean;
      };
    }
  | {
      type: 'HAS_LOADED';
      value: string;
    }
  | {type: 'SET_ROOT_NODE_ID'; value: string}
  | {
      type: 'HAS_EXPANDED';
      value: string;
    }
  | {
      type: 'HAS_COLLAPSED';
      value: string;
    }
  | {type: 'ERROR'; value: Error}
  | {type: 'RESET'};

export function useNodeTree(prefix: string[]): JSX.Element {
  const supabase = useClient();
  const [state, dispatch] = useReducer<Reducer<TreeState, TreeAction>>(
    reducer,
    {
      rootNodeId: null,
      tree: [],
      expandedIds: [],
      loadingIds: [],
      hasLoadedIds: [],
    },
  );

  useEffect(() => {
    dispatch({type: 'RESET'});

    getNodeTree(supabase, {path: prefix})
      .then(result => {
        const rootNodeId = result.rootNodeId ?? 'root';

        dispatch({type: 'SET_ROOT_NODE_ID', value: rootNodeId});
        dispatch({type: 'HAS_LOADED', value: rootNodeId});

        toArray(result.tree).forEach(node => {
          dispatch({type: 'ADD', value: node});
        });

        toArray(result.expandedIds).forEach(id => {
          dispatch({type: 'HAS_EXPANDED', value: id});
          dispatch({type: 'HAS_LOADED', value: id});
        });
      })
      .catch(error => {
        dispatch({type: 'ERROR', value: error as Error});
      })
      .finally(() => {
        //noop
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps -- intentionally only run once
  }, [prefix.join('/')]);

  async function onOpenClick(node: NodeTree['node']): Promise<void> {
    if (state.hasLoadedIds.includes(node.id)) {
      if (state.expandedIds.includes(node.id)) {
        dispatch({type: 'HAS_COLLAPSED', value: node.id});
      } else {
        dispatch({type: 'HAS_EXPANDED', value: node.id});
      }
      return;
    }

    const nodeId = node.id;
    const nodePath = [...node.prefix, node.name ?? ''];

    if (!Array.isArray(nodePath)) {
      return;
    }

    if (
      state.hasLoadedIds.includes(nodeId) ||
      state.loadingIds.includes(nodeId)
    ) {
      return;
    }

    dispatch({type: 'LOADING', value: {id: nodeId, value: true}});

    const nextNodes = await getNode(supabase, {
      path: nodePath,
    });

    toArray(nextNodes?.children).forEach(item => {
      dispatch({
        type: 'ADD',
        value: {
          id: item.id,
          parent: nodeId,
          node: item,
        },
      });
    });

    dispatch({type: 'HAS_LOADED', value: nodeId});
    dispatch({type: 'HAS_EXPANDED', value: nodeId});
    dispatch({type: 'LOADING', value: {id: nodeId, value: false}});
  }

  return createElement(FilesTree, {
    rootNodeId: state.rootNodeId,
    tree: state.tree,
    expandedIds: state.expandedIds,
    loadingIds: state.loadingIds,
    onToggleExpandClick: onOpenClick,
  } as FilesTreeProps);
}

function reducer(state: TreeState, action: TreeAction): TreeState {
  switch (action.type) {
    case 'RESET': {
      return {
        rootNodeId: null,
        tree: [],
        expandedIds: [],
        loadingIds: [],
        hasLoadedIds: [],
      };
    }
    case 'HAS_EXPANDED': {
      return {
        ...state,
        expandedIds: [...new Set([...state.expandedIds, action.value])],
      };
    }
    case 'HAS_COLLAPSED': {
      return {
        ...state,
        expandedIds: state.expandedIds.filter(id => id !== action.value),
      };
    }
    case 'HAS_LOADED': {
      return {
        ...state,
        hasLoadedIds: [...new Set([...state.hasLoadedIds, action.value])],
      };
    }

    case 'LOADING': {
      return {
        ...state,
        loadingIds: action.value.value
          ? [...state.loadingIds, action.value.id]
          : state.loadingIds.filter(id => id !== action.value.id),
      };
    }

    case 'ADD': {
      // if it's already in the tree, don't add it
      if (state.tree.some(item => item.id === action.value.id)) {
        return state;
      }

      return {
        ...state,
        tree: [...state.tree, action.value],
      };
    }

    case 'SET_ROOT_NODE_ID': {
      return {
        ...state,
        expandedIds: [...new Set([...state.expandedIds, action.value])],
        rootNodeId: action.value,
      };
    }

    default: {
      return state;
    }
  }
}
