import type {PropsWithChildren} from 'react';
import type {LinkProps as ReactRouterDomLinkProps} from 'react-router-dom';
import {Link as ReactRouterDomLink} from 'react-router-dom';
import type {NodeRecord} from '@elwood/common';
import {toArray} from '@elwood/common';

export type LinkProps = Omit<ReactRouterDomLinkProps, 'to'> & {
  href: string;
};

export function Link(props: PropsWithChildren<LinkProps>): JSX.Element {
  const {href, ...aProps} = props;

  return (
    <ReactRouterDomLink {...aProps} to={href}>
      {props.children}
    </ReactRouterDomLink>
  );
}

export type NodeLinkProps = Omit<LinkProps, 'href'> & {
  node: Pick<NodeRecord, 'type' | 'prefix' | 'name'>;
};

export function NodeLink(props: PropsWithChildren<NodeLinkProps>): JSX.Element {
  const {node, ...linksProps} = props;
  const href = createNodeLink(node);

  return <Link {...linksProps} href={href} />;
}

export function createNodeLink(
  node: Pick<NodeRecord, 'type' | 'prefix' | 'name'>,
): string {
  const path = [...toArray(node.prefix), node.name].filter(Boolean);

  if (Array.from(path).length === 0) {
    return `/`;
  }

  const type = node.type === 'BLOB' ? 'blob' : 'tree';

  return `/${type.toLowerCase()}/${path.map(encodeURIComponent).join('/')}`;
}
