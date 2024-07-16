import {createContext} from 'react';
import type Uppy from '@uppy/core';
import type {Renderer, JsonObject, MemberRecord} from '@elwood/common';
import {type ElwoodClient} from '@elwood/js';

import {FeatureFlag, ConfigurationNames} from './constants';

export interface ProviderContextValue {
  isPlatform: boolean;
  workspaceName: string;
  client: ElwoodClient;
  initialData?: JsonObject;
  uploadManager: Uppy<any, any> | null;
  member: MemberRecord;
  avatarUrl?: string | null;
  renderers?: Renderer[];
  onLogout(): void;
  featureFlags: Record<FeatureFlag, boolean>;
  configuration: Record<ConfigurationNames, string>;
}

export const ProviderContext = createContext<ProviderContextValue | null>(null);
