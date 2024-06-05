import type {PropsWithChildren} from 'react';

import Link from 'next/link';
import {Logo, Button, StarIcon, FileIcon, ExternalLinkIcon} from '@elwood/ui';
import {type Metadata} from 'next';
import {Demo} from './demo';

import Grid from '@/components/grid';

export const metadata: Metadata = {
  title: 'Elwood AI',
};

export default async function Page(props: PropsWithChildren) {
  return (
    <div className="w-full h-full flex flex-col">
      <Grid className="z-0" />
      <div className="container lg:max-w-[40vw] md:max-w-[60vw] size-full relative flex flex-col max-h-[80vh]">
        <header className="w-full flex flex-col items-center pt-12 pb-3 text-center">
          <div className="size-12 mb-6">
            <Link href="/">
              <Logo className="size-full fill-brand dark:fill-current" />
              <span className="sr-only">Elwood</span>
            </Link>
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold relative z-10 mb-1.5">
            Elwood AI
          </h1>
          <h2 className="text-xl font-thin text-foreground/80">
            <strong>Talk to your files.</strong> With Elwood AI, you can go
            beyond simple search & filters. Your custom trained AI assistant can
            help you find, organize, understand, and act on all of your team's
            files.
          </h2>
        </header>
        <main className="flex-grow flex flex-col items-center relative z-10">
          <div className="shadow-splash border rounded-md bg-background mt-6 size-full">
            <Demo />
          </div>
        </main>
      </div>
      <footer className="text-center text-muted-foreground/50 text-xs pb-2 pt-12">
        &copy; The Elwood Technology Company
      </footer>
    </div>
  );
}
