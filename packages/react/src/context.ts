import {createContext} from 'react';
import type Uppy from '@uppy/core';
import {type JsonObject} from '@elwood/common';
import {type ElwoodClient} from '@elwood/js';

export interface ProviderContextValue {
  workspaceName: string;
  client: ElwoodClient;
  initialData?: JsonObject;
  uploadManager: Uppy | null;
}

export const ProviderContext = createContext<ProviderContextValue | null>(null);
