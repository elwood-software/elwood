import {createContext} from 'react';
import type Uppy from '@uppy/core';
import {type JsonObject, type Member} from '@elwood/common';
import {type ElwoodClient} from '@elwood/js';

export interface ProviderContextValue {
  workspaceName: string;
  client: ElwoodClient;
  initialData?: JsonObject;
  uploadManager: Uppy | null;
  member: Member;
}

export const ProviderContext = createContext<ProviderContextValue | null>(null);
