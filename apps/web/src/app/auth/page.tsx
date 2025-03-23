"use client";

import { use, useActionState, useEffect } from "react";
import { redirect } from "next/navigation";
import { FolderOpen } from "lucide-react";

import {
  cn,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Input,
  Label,
} from "@elwood/react";

import { login } from "./actions";

type LoginPageProps = {
  searchParams: Promise<{
    return_uri: string;
  }>;
};

export default function LoginPage(props: LoginPageProps) {
  const { return_uri = "/" } = use(props.searchParams);
  const [state, formAction, isPending] = useActionState(login, {
    success: false,
    return_uri,
  });

  useEffect(() => {
    if (state.redirect_url) {
      redirect(state.redirect_url);
    }
  }, [state.redirect_url]);

  return (
    <div className="w-screen h-screen flex items-center justify-center">
      <div className={cn("flex flex-col gap-6")}>
        <div className="flex items-center justify-center">
          <div className="flex aspect-square p-3 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
            <FolderOpen className="size-12" />
          </div>
        </div>

        <Card className="pb-0">
          <CardHeader>
            <CardTitle className="text-2xl">Login</CardTitle>
            <CardDescription>
              Enter your email below to login to your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form>
              <input type="hidden" name="return_uri" value={state.return_uri} />
              <div className="flex flex-col gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    name="email"
                    placeholder="m@example.com"
                    required
                    defaultValue={state.email}
                  />
                </div>
                <div className="grid gap-2">
                  <div className="flex items-center">
                    <Label htmlFor="password">Password</Label>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    name="password"
                    required
                  />
                </div>
                <Button
                  loading={isPending}
                  formAction={formAction}
                  type="submit"
                  className="w-full"
                >
                  Login
                </Button>
              </div>
            </form>
          </CardContent>
          <CardFooter className="p-0">
            {state.error && (
              <div className="bg-red-900 text-center py-2 text-sm text-red-200 font-medium rounded-b-md w-full">
                {state.error}
              </div>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
