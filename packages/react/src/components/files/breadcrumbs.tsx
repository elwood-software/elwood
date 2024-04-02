import {clsx} from 'clsx';
import {toArray} from '@elwood/common';
import {
  Breadcrumb,
  BreadcrumbSeparator,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
} from '@elwood/ui';
import {Link, createNodeLink} from '../link';
import {FileIcon} from './icon';

export interface FilesBreadcrumbsProps {
  className?: string;
  prefix: string[];
}

export function FileBreadcrumbs(props: FilesBreadcrumbsProps): JSX.Element {
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
      <div className="flex mr-2 items-center justify-center">
        <FileIcon className="w-4 h-4 text-muted-foreground" nodeType="BUCKET" />
      </div>
      <BreadcrumbList>
        {breadcrumbs.map((item, idx) => {
          const isLast =
            idx === breadcrumbs.length - 1 && breadcrumbs.length > 1;
          const showSeparator = idx < breadcrumbs.length - 1;
          const cn = clsx(
            !isLast && ['text-muted-foreground'],
            isLast && ['font-bold text-foreground'],
          );

          return (
            <>
              <BreadcrumbItem
                className="flex items-center"
                key={`Breadcrumbs-${item.id}`}>
                <BreadcrumbLink asChild>
                  <Link className={cn} href={item.href}>
                    {item.name}
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              {showSeparator ? (
                <BreadcrumbSeparator>/</BreadcrumbSeparator>
              ) : null}
            </>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
