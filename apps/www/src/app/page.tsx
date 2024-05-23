import Link from 'next/link';

import {Logo, Button, StarIcon, FileIcon, ExternalLinkIcon} from '@elwood/ui';

import {NotMobile} from './not-mobile';
import {Demo} from './demo';

export default function Page() {
  return (
    <div className="m-auto container min-h-screen flex flex-col">
      <main className="flex-grow">
        <header className="flex flex-col items-center justify-center">
          <h1 className="size-24 md:mt-12 mt-24">
            <Link href="/">
              <Logo className="size-full fill-brand dark:fill-current" />
              <span className="sr-only">Elwood</span>
            </Link>
          </h1>
          <h2 className="mt-6 font-medium text-2xl text-center">
            The open source Dropbox alternative
          </h2>
          <h3 className="text-sm text-muted-foreground mt-1 max-w-2xl text-center">
            <strong>Elwood</strong> has lighting fast, resumable uploads.
            Real-time, multi-user collaboration. Powerful role-based sharing. AI
            powered assistant (to the) file manager. And much more to come.
          </h3>
          <div className="flex flex-col md:flex-row items-center justify-center space-y-3 md:space-y-0 md:space-x-3 mt-12 w-full">
            <Button
              variant="default"
              size="lg"
              href="/desktop/download"
              className="w-full md:w-auto hidden md:inline-flex">
              Download for Desktop
            </Button>
            <Button
              variant="outline"
              href="/docs"
              className="w-full md:w-auto"
              icon={<FileIcon className="size-[1em]" />}>
              Docs
            </Button>
            <Button
              variant="outline"
              className="w-full md:w-auto"
              href="https://github.com/elwood-software/elwood"
              icon={<StarIcon className="size-[1em]" />}>
              Github
            </Button>
          </div>
        </header>

        <div className="hidden md:block border rounded-md mt-10 shadow-splash transition-all scale-[.99] hover:scale-100  relative top-2 hover:top-0 duration-300">
          <header className="border-b rounded-t-md px-3 py-3 flex justify-between">
            <div className="space-x-1.5 flex">
              <div className="size-2.5 bg-foreground/20 rounded-full" />
              <div className="size-2.5 bg-foreground/20 rounded-full" />
              <div className="size-2.5 bg-foreground/20 rounded-full" />
            </div>
            <Link
              className="opacity-20 flex items-center hover:opacity-100 transition-opacity text-xs"
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
      </main>
      <footer className="text-center text-muted-foreground/50 text-xs pb-2 pt-12">
        &copy; The Elwood Technology Company
      </footer>
    </div>
  );
}
