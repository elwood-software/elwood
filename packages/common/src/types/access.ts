export type AccessFlagType = 'ALL' | 'TREE' | 'BLOB' | 'BUCKET';

export type AccessFlag = {
  id: string;
  types: AccessFlagType[];
};
