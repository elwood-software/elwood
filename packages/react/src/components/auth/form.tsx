import {Button, Input} from '@elwood/ui';

export interface AuthFormProps {
  loginAction: FormProps['action'];
  loading: boolean;
  errors?: string[];
  hideEmail?: boolean;
  email?: string;
}

export function AuthForm(props: AuthFormProps): JSX.Element {
  const {loginAction, errors, loading} = props;

  return (
    <div className="bg-sidebar p-12 rounded-lg w-full max-w-sm bg-sidebar border">
      <Form action={loginAction} className="space-y-6">
        {props.hideEmail ? (
          <input type="hidden" name="email" value={props.email} />
        ) : (
          <div>
            <label
              className="text-muted-foreground text-xs font-medium"
              htmlFor="email">
              Email Address
            </label>
            <div className="mt-2">
              <Input
                autoComplete="email"
                id="email"
                name="email"
                placeholder="awesome@elwood.studio"
                required
                type="email"
              />
            </div>
          </div>
        )}

        <div>
          <div className="flex items-center justify-between">
            <label
              className="text-muted-foreground text-xs font-medium"
              htmlFor="password">
              Password
            </label>
          </div>
          <div className="mt-2">
            <Input
              autoComplete="current-password"
              id="password"
              name="password"
              placeholder="very_secret"
              required
              type="password"
            />
          </div>
        </div>

        <div>
          <Button className="w-full" loading={loading} type="submit">
            Sign in
          </Button>
        </div>

        {errors && errors.length > 0 ? (
          <div>
            {errors.map(ln => (
              <div key={`error-${ln}`}>{ln}</div>
            ))}
          </div>
        ) : null}
      </Form>
    </div>
  );
}

type FormProps = JSX.IntrinsicElements['form'] & {
  action:
    | string
    | undefined
    | ((data: FormData) => Promise<void>)
    | ((data: FormData) => void);
};

function Form(props: FormProps): JSX.Element {
  return <form {...props} />;
}
