import {lazy} from 'react';
import type {Renderer} from '@elwood/common';

export const defaultRenders: Renderer[] = [
  {
    contentType: ['application/pdf'],
    iframe: true,
    component: lazy(() => import('../renderer/pdf')),
  },
  {
    contentType: ['text/html'],
    iframe: false,
    component: lazy(() => import('../renderer/pdf')),
  },
];
