import { ComponentProps } from "react";
import { Link as RouterLink } from "react-router";

export function Link(props: ComponentProps<"a">) {
  const { href, ...linkProps } = props;

  return <RouterLink to={href ?? "#"} {...linkProps} />;
}
