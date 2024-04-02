import {Database} from './database';

export type NodeType = Database['public']['Enums']['elwood_node_type'];

export type GetNodeResult = {
  id: string;
  node: NodeRecord;
  children: NodeRecord[] | null;
  key_children: NodeRecord[] | null;
};

export type NodeRecord = Database['public']['CompositeTypes']['elwood_node'] & {
  prefix: string[];
};

export type NodeTree =
  Database['public']['CompositeTypes']['elwood_node_tree'] & {
    node: NodeRecord;
  };

export type GetNodeTreeResult =
  Database['public']['CompositeTypes']['elwood_get_node_tree_result'] & {
    tree: NodeTree[];
  };

export type Member = Database['public']['CompositeTypes']['elwood_member'];

export type SearchMembersResult = Member[];
