import type {PropsWithChildren} from 'react';

import Link from 'next/link';
import {Logo, Button, StarIcon, FileIcon, ExternalLinkIcon} from '@elwood/ui';

import {NotMobile} from '../not-mobile';
import {Demo} from '../demo';

import Grid from '@/components/grid';
import {getReleases} from './get-releases';

export default async function Layout(props: PropsWithChildren) {
  const release = await getReleases(new URLSearchParams(''));

  return (
    <>
      <header className="w-full relative flex flex-col items-center space-y-8 max-h-[80vh] overflow-hidden">
        <Grid />

        <div className="size-12">
          <Link href="/">
            <Logo className="size-full fill-brand dark:fill-current" />
            <span className="sr-only">Elwood</span>
          </Link>
        </div>

        <h1 className="text-8xl font-extrabold relative z-10">
          Elwood for Mac
        </h1>

        <Button
          id="download-button"
          href={release.url}
          variant="outline"
          className="px-6">
          Download {release.v}
        </Button>

        <div className="container mx-auto">
          <div className="hidden md:block shadow-splash border rounded-md transition-all scale-[.99] hover:scale-100 relative top-2 hover:top-0 duration-300 group bg-background">
            <header className="border-b rounded-t-md px-3 py-3 flex justify-between">
              <div className="space-x-1.5 flex">
                <div className="size-2.5 bg-foreground/20 rounded-full" />
                <div className="size-2.5 bg-foreground/20 rounded-full" />
                <div className="size-2.5 bg-foreground/20 rounded-full" />
              </div>
              <Link
                className="opacity-0 flex items-center group-hover:opacity-100 transition-opacity text-xs"
                href="https://demo.elwood.software">
                Open the full demo{' '}
                <ExternalLinkIcon className="size-[1em] inline ml-1" />
              </Link>
            </header>
            <div className="h-[80vh] w-full flex flex-row overflow-hidden relative">
              <NotMobile>
                <Demo />
              </NotMobile>
            </div>
          </div>
        </div>
        <span className="absolute bottom-0 left-0 w-full h-10 bg-background overflow-hidden z-20 shadow-splash"></span>
      </header>
      {props.children}
      <footer className="text-center text-muted-foreground/50 text-xs pb-2 pt-12">
        &copy; The Elwood Technology Company
      </footer>
    </>
  );
}
