import { PropsWithChildren } from "react";

export function Provider(props: PropsWithChildren): JSX.Element {
  return <>{props.children}</>;
}
