import {type Database} from './database';

export type NodeType = Database['public']['Enums']['elwood_node_type'];

export interface GetNodeResult {
  id: string;
  node: NodeRecord;
  children: NodeRecord[] | null;
  key_children: NodeRecord[] | null;
}

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

export type MemberRecord = Database['public']['Views']['elwood_member']['Row'];

export type SearchMembersResult = MemberRecord[];

export type ActivityType =
  Database['public']['Views']['elwood_activity']['Row']['type'];

export type ActivityRecord =
  Database['public']['Views']['elwood_activity']['Row'];

export type FollowRecord = Database['public']['Views']['elwood_follow']['Row'];

export type FollowType = Required<
  Database['public']['Views']['elwood_follow']['Row']['type']
>;
