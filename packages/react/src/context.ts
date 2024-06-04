import {createContext} from 'react';
import type Uppy from '@uppy/core';
import type {Renderer, JsonObject, MemberRecord} from '@elwood/common';
import {type ElwoodClient} from '@elwood/js';

import {FeatureFlag} from './constants';

export interface ProviderContextValue {
  workspaceName: string;
  client: ElwoodClient;
  initialData?: JsonObject;
  uploadManager: Uppy | null;
  member: MemberRecord;
  avatarUrl?: string | null;
  renderers?: Renderer[];
  onLogout(): void;
  featureFlags: Record<FeatureFlag, boolean>;
}

export const ProviderContext = createContext<ProviderContextValue | null>(null);
