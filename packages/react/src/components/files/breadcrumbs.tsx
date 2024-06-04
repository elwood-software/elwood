import {type MouseEventHandler} from 'react';
import {clsx} from 'clsx';
import {
  Breadcrumb,
  BreadcrumbSeparator,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
} from '@elwood/ui';
import {Fragment} from 'react/jsx-runtime';
import {Link, createNodeLink} from '../link';
import {FileIcon} from './icon';

export interface FilesBreadcrumbsProps {
  className?: string;
  prefix: string[];
  variant?: 'default' | 'compact';
  onClick?: MouseEventHandler;
}

export function FileBreadcrumbs(props: FilesBreadcrumbsProps): JSX.Element {
  const {variant = 'default'} = props;

  const breadcrumbs = [];
  const prefix: string[] = [];

  for (const part of props.prefix) {
    breadcrumbs.push({
      id: prefix.join('/'),
      name: part,
      href: createNodeLink({
        type: 'TREE',
        prefix,
        name: part,
      }),
    });
    prefix.push(part);
  }

  if (breadcrumbs.length === 0) {
    return <span className={props.className} />;
  }

  return (
    <Breadcrumb
      className={clsx(
        props.className,
        'flex items-center leading-none text-sm',
      )}>
      <BreadcrumbList>
        {breadcrumbs.map((item, idx) => {
          const isLast =
            idx === breadcrumbs.length - 1 && breadcrumbs.length > 1;
          const showSeparator = idx < breadcrumbs.length - 1;
          const cn = clsx(
            !isLast && ['text-muted-foreground'],
            isLast && variant !== 'compact' && ['font-bold text-foreground'],
          );

          return (
            <Fragment key={`Breadcrumbs-${item.id}`}>
              <BreadcrumbItem className="flex items-center">
                <BreadcrumbLink asChild>
                  <Link className={cn} href={item.href} onClick={props.onClick}>
                    {item.name}
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              {showSeparator ? (
                <BreadcrumbSeparator>/</BreadcrumbSeparator>
              ) : null}
            </Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
