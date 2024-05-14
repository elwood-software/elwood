import {Logo} from '@elwood/ui';

export function Home(): JSX.Element {
  return (
    <div className="flex h-screen w-screen items-center justify-center text-black dark:text-white">
      <Logo className="h-24 w-24 fill-current" />
    </div>
  );
}
