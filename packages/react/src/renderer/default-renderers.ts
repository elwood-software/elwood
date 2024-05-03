import {lazy} from 'react';
import type {Renderer} from '@elwood/common';

export const defaultRenders: Renderer[] = [
  {
    fill: true,
    contentType: ['application/pdf'],
    iframe: true,
    component: lazy(() => import('../renderer/pdf')),
  },
  {
    contentType: ['text/html', 'text/plain', 'text/markdown'],
    iframe: false,
    component: lazy(() => import('../renderer/html')),
  },
  {
    contentType: [
      'image/gif',
      'image/jpeg',
      'image/png',
      'image/webp',
      'image/jpg',
    ],
    iframe: false,
    component: lazy(() => import('../renderer/image')),
  },
];
