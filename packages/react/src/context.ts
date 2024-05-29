import {createContext} from 'react';
import type Uppy from '@uppy/core';
import type {Renderer, JsonObject, MemberRecord} from '@elwood/common';
import {type ElwoodClient} from '@elwood/js';

export interface ProviderContextValue {
  workspaceName: string;
  client: ElwoodClient;
  initialData?: JsonObject;
  uploadManager: Uppy | null;
  member: MemberRecord;
  avatarUrl?: string | null;
  renderers?: Renderer[];
  onLogout(): void;
}

export const ProviderContext = createContext<ProviderContextValue | null>(null);
