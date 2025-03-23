import { useLink, type LinkProviderProps } from "#/hooks/use-link";

export type LinkProps = LinkProviderProps;

export function Link(props: LinkProps) {
  const Link = useLink();

  return <Link {...props} />;
}
