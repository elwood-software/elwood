import {Spinner} from '@elwood/ui';

export default function PageLoading() {
  return (
    <div className="flex items-center justify-center">
      <Spinner className="stroke-text-muted-foreground" />
    </div>
  );
}
