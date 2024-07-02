import {LoginForm} from './form';
import {login} from './action';

export default async function Page() {
  return (
    <div className="size-full flex items-center justify-center">
      <LoginForm action={login} />
    </div>
  );
}
