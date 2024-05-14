---
title: Getting started
---

Elwood has two integration modes. Pick which one is right for you! {% .lead %}

{% quick-links %}

{% quick-link title="Standalone" icon="installation" href="#standalone" description="Setup Elwood as a standalone Next.js application." /%}

{% quick-link title="Embedded" icon="lightbulb" href="#embedded" description="Integrate Elwood into your existing React application." /%}

{% /quick-links %}

## Standalone

In standalone mode, Elwood runs as standalone Next.js application & Supabase project. This is the easiest way to get started with Elwood.

### Prerequisites

You'll need the following installed on your machine:

- Git
- Supabase CLI
- Node.js (>=v20)
- PNPM
- Deno (optional)

### Clone the repository

```bash
git clone https://github.com/elwood-software/elwood
```

### Install dependencies

```bash
pnpm install
```

npm

### Start Supabase

```bash
supabase start
```

### Start Elwood

```bash
pnpm dev
```

## Embedded

You can integrate Elwood into your existing Next.js application. This is useful if you want to add Elwood to an existing project.

### Install Elwood packages

```bash
pnpm install @elwood/react @elwood/ui @elwood/js
```

### Add Elwood pages

Elwood has a few pages you'll need to get your application up and running.

#### Layout

`app/elwood/(dashboard)/layout.tsx`

```typescript
import {type PropsWithChildren} from 'react';
import AuthPage from '@/app/(unauthenticated)/auth/page';
import {RedirectType, redirect} from 'next/navigation';
import {ElwoodThemeProvider} from '@elwood/ui';

export default async function Layout(
  props: PropsWithChildren,
): Promise<JSX.Element> {
  //
  // !! CHANGE !!
  // add your custom check for a user here
  // Elwood does not provide authentication flow
  // in Embedded mode
  //
  if (!user) {
    redirect('/login', RedirectType.replace);
  }

  return (
    <ElwoodThemeProvider>
      <div className="flex flex-row w-screen h-screen">{props.children}</div>
    </ElwoodThemeProvider>
  );
}

```

#### Dashboard page

`app/elwood/(dashboard)/[[...slug]]/page.tsx`

```typescript
'use client';

import React, {useEffect, useState} from 'react';
import {
  Router,
  createBrowserRouter,
  dashboardRoutes,
  type RouterProps,
} from '@elwood/react';
import {type ElwoodClient, createClient} from '@elwood/js';
import {Spinner} from '@elwood/ui';

export default function Page(): JSX.Element {
  const [client, setClient] = useState<ElwoodClient | null>(null);
  const [router, setRouter] = useState<RouterProps['router'] | null>(null);

  useEffect(() => {
    setClient(createClient());
    setRouter(
      createBrowserRouter(dashboardRoutes, {
        basename: `/`,
      }),
    );
  }, []);

  if (!router || !client) {
    return <Spinner full />;
  }

  return (
    <ElwoodProvider workspaceName="Dunder Mifflin" client={props.client}>
      <Router router={router} />
    </ElwoodProvider>
  );
}
```
