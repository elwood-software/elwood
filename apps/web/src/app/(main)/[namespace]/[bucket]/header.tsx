import { Fragment } from "react";
import Link from "next/link";
import { ChevronsUpDown } from "lucide-react";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@elwood/react";

import { useTree } from "#/hooks/use-tree";
import { BlobNode } from "@elwood/api";

export type NamespaceHeaderProps = {
  namespace: string;
  bucket: string | undefined;
  path: string[] | undefined;
};

export function NamespaceHeader(props: NamespaceHeaderProps) {
  const { namespace, bucket, path } = props;
  const { data } = useTree({
    namespace: namespace,
  });

  const thisBucket = data?.nodes.find((item) => item.id === bucket);

  return (
    <header className="flex item-center px-8 pt-8">
      {/* <SidebarTrigger className="mr-4" /> */}
      <Breadcrumb className="flex items-center">
        <BreadcrumbList className="gap-1 sm:gap-1">
          <BreadcrumbItem className="hidden md:block">
            <DropdownMenu>
              <span className="flex items-center gap-1 cursor-pointer">
                <Link
                  href={`/${props.namespace}`}
                  className="hover:text-foreground"
                >
                  {thisBucket?.name ?? "..."}
                </Link>
                <DropdownMenuTrigger className="cursor-pointer hover:bg-secondary rounded px-0.5 relative -mr-0.5">
                  <ChevronsUpDown className="w-[.75rem]" />
                </DropdownMenuTrigger>
              </span>
              <DropdownMenuContent align="center">
                {data?.nodes.map((item) => {
                  return (
                    <DropdownMenuItem
                      key={`breadcrumbs-${props.namespace}-${item.id}`}
                      asChild
                    >
                      <Link
                        href={`/${props.namespace}/${(item as BlobNode).path}/tree`}
                      >
                        {item.name}
                      </Link>
                    </DropdownMenuItem>
                  );
                })}
              </DropdownMenuContent>
            </DropdownMenu>
          </BreadcrumbItem>

          {path?.map((part, idx) => {
            const fullPath = path.slice(0, idx + 1).join("/");

            return (
              <Fragment key={`breadcrumb-${part}`}>
                <BreadcrumbSeparator className="hidden md:block text-muted-foreground/50">
                  /
                </BreadcrumbSeparator>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink asChild className="text-sm">
                    <Link href={`/${namespace}/${bucket}/tree/${fullPath}`}>
                      {part}
                    </Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
              </Fragment>
            );
          })}
        </BreadcrumbList>
      </Breadcrumb>
    </header>
  );
}
