import {Logo, Button} from '@elwood/ui';

export default function Page() {
  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center">
      <h1 className="size-1/4">
        <Logo className="size-full fill-current" />
        <span className="sr-only">Elwood</span>
      </h1>

      <h2 className="mt-12 font-bold text-2xl">
        Open source Dropbox alternative
      </h2>

      <div className="flex items-center space-x-3 mt-6">
        <Button variant="outline" href="/docs">
          Docs
        </Button>
        <Button variant="outline" href="https://github.elwood.software">
          Github
        </Button>
        <Button variant="outline" href="https://discord.elwood.software">
          Discord
        </Button>
      </div>
    </div>
  );
}
