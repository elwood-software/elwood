import Link from 'next/link';
import {Logo, Button, FileIcon, StarIcon} from '@elwood/ui';
import {type Metadata} from 'next';

import Grid from '@/components/grid';

import Flow from './flow';

export const metadata: Metadata = {
  title: 'Elwood Run',
};

export default async function Page() {
  return (
    <div className="w-full h-full flex flex-col">
      <Grid className="z-0" />
      <div className="container lg:max-w-[40vw] md:max-w-[60vw] size-full relative flex flex-col">
        <header className="w-full flex flex-col items-center pt-12 pb-3 text-center">
          <div className="size-12 mb-6">
            <Link href="https://elwood.software/">
              <Logo className="size-full fill-brand dark:fill-current" />
              <span className="sr-only">Elwood</span>
            </Link>
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold relative z-10 mb-1.5">
            Elwood Run
          </h1>
          <h2 className="text-xl font-thin text-foreground/80">
            <strong>Automate your file management.</strong> With Elwood Run, you
            can automate your file management tasks by responding to files as
            they move through your system.
          </h2>
          <div className="flex flex-col md:flex-row items-start justify-center space-y-3 md:space-y-0 md:space-x-3 mt-12 w-full">
            <div className="flex flex-col items-center">
              <Button
                size="lg"
                variant="default"
                className="w-full md:w-auto"
                href="https://github.com/elwood-software/run"
                icon={<StarIcon className="size-[1em]" />}>
                Follow on Github
              </Button>
              <small className="text-muted-foreground text-small mt-1">
                for development updates
              </small>
            </div>

            <div className="flex flex-col items-center">
              <Button
                size="lg"
                variant="outline"
                className="w-full md:w-auto"
                href="https://discord.elwood.software">
                Join Discord
              </Button>
            </div>
          </div>
        </header>
        <main className="flex flex-row relative z-10 mt-10">
          <div className="border bg-background rounded-md shadow-splash mr-10">
            <header className="border-b bg-border/30 rounded-t-md px-6 py-2 flex justify-between">
              <div className="space-x-1.5 flex">
                <div className="size-2.5 bg-foreground/20 rounded-full" />
                <div className="size-2.5 bg-foreground/20 rounded-full" />
                <div className="size-2.5 bg-foreground/20 rounded-full" />
              </div>
            </header>
            <div className="w-full flex flex-row overflow-hidden relative p-6 text-sm">
              <pre className="mono pr-10">{workflow.trim()}</pre>
            </div>
          </div>
          <Flow />
        </main>
      </div>
      <footer className="text-center text-muted-foreground/50 text-xs pb-2 pt-12">
        &copy; The Elwood Technology Company
      </footer>
    </div>
  );
}

const workflow = `
name: convert-to-mp3
when:
  - event: storage.upsert
    name: *.mp4
    
jobs:
  default:
    steps:

      # Install ffmpeg
      - name: setup
        action: install/ffmpeg

      # Download the file
      - name: download
        action: copy
        input:
          src: \${{ event.storage_src }}
          dest: "source.mp4"

      # Convert the file
      - name convert
        action: "bin://ffmpeg"
        input:
          args:
            - "-i"
            - "source.mp4"
            - "-b:a"
            - "192K"
            - "-vn"
            - "output.mp3"

      # Upload
      - name: upload
        action: copy
        input:
          src: "output.mp3"
          dest: \${{ event.storage_dest }}
`;
