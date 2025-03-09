import { Fragment } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "#/components/ui/breadcrumb";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "#/components/ui/dropdown-menu";
import { SidebarTrigger } from "#/components/ui/sidebar";

import { useTree } from "#/hooks/use-tree";

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
      <SidebarTrigger className="mr-4" />
      <Breadcrumb className="flex items-center">
        <BreadcrumbList>
          <BreadcrumbItem className="hidden md:block">
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-1 cursor-pointer">
                {thisBucket?.name ?? "..."}
                <ChevronDown className="w-[.5rem]" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                {data?.nodes.map((item) => {
                  return (
                    <DropdownMenuItem
                      key={`breadcrumbs-${props.namespace}-${item.id}`}
                      asChild
                    >
                      <Link href={`/${props.namespace}/${item.path}/tree`}>
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
                <BreadcrumbSeparator className="hidden md:block text-muted">
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
