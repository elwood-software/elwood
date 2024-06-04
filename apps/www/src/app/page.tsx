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

        <div className="hidden md:block border rounded-md mt-10 shadow-splash transition-all scale-[.99] hover:scale-100  relative top-2 hover:top-0 duration-300 group">
          <div className="absolute -top-8 left-0 text-sm flex opacity-40 group-hover:opacity-0 transition-opacity">
            Try it out!{' '}
            <svg
              className="mr-6 h-6 w-12 relative -top-3 -left-4 [transform:rotateY(180deg)rotateX(2deg)]"
              width="45"
              height="25"
              viewBox="0 0 45 25"
              fill="none"
              xmlns="http://www.w3.org/2000/svg">
              <path
                d="M43.2951 3.47877C43.8357 3.59191 44.3656 3.24541 44.4788 2.70484C44.5919 2.16427 44.2454 1.63433 43.7049 1.52119L43.2951 3.47877ZM4.63031 24.4936C4.90293 24.9739 5.51329 25.1423 5.99361 24.8697L13.8208 20.4272C14.3011 20.1546 14.4695 19.5443 14.1969 19.0639C13.9242 18.5836 13.3139 18.4152 12.8336 18.6879L5.87608 22.6367L1.92723 15.6792C1.65462 15.1989 1.04426 15.0305 0.563943 15.3031C0.0836291 15.5757 -0.0847477 16.1861 0.187863 16.6664L4.63031 24.4936ZM43.7049 1.52119C32.7389 -0.77401 23.9595 0.99522 17.3905 5.28788C10.8356 9.57127 6.58742 16.2977 4.53601 23.7341L6.46399 24.2659C8.41258 17.2023 12.4144 10.9287 18.4845 6.96211C24.5405 3.00476 32.7611 1.27399 43.2951 3.47877L43.7049 1.52119Z"
                fill="currentColor"
                className="fill-foreground"></path>
            </svg>
          </div>

          <header className="border-b bg-border/30 rounded-t-md px-3 py-2 flex justify-between">
            <div className="space-x-1.5 flex">
              <div className="size-2.5 bg-foreground/20 rounded-full" />
              <div className="size-2.5 bg-foreground/20 rounded-full" />
              <div className="size-2.5 bg-foreground/20 rounded-full" />
            </div>
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
