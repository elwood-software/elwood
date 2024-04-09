import {Card, ShieldXIcon} from '@elwood/ui';
import {Button} from '@/components/button';

export function NoAccess(): JSX.Element {
  function onLogoutClick(): void {
    window.location.href = '/auth/logout';
  }

  return (
    <div className="w-full h-full flex items-center justify-center">
      <Card contentClassName="flex flex-col items-center justify-center">
        <ShieldXIcon className="size-24 mt-6 stroke-red-300" />
        <h1 className="text-3xl font-bold mt-6">No Access</h1>
        <p className="font-medium text-lg">
          Your user account does not have access!
        </p>
        <p className="text-muted-foreground">
          Please contact your administrator for more information.
        </p>
        <Button
          type="button"
          onClick={onLogoutClick}
          variant="secondary"
          className="mt-6">
          Logout
        </Button>
      </Card>
    </div>
  );
}
