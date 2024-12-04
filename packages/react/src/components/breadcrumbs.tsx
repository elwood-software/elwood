import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
} from "@elwood/ui";

import { Link } from "#/components/link.js";

export type BreadcrumbsProps = {
  items: Array<{
    children: React.ReactNode;
    href?: string;
  }>;
};

export function Breadcrumbs(props: BreadcrumbsProps) {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        {props.items.map((item, index) => (
          <>
            <BreadcrumbItem key={index}>
              {item.href ? (
                <BreadcrumbLink asChild>
                  <Link href={item.href}>{item.children}</Link>
                </BreadcrumbLink>
              ) : (
                <span className="text-foreground font-medium">
                  {item.children}
                </span>
              )}
            </BreadcrumbItem>
            {index !== props.items.length - 1 && <BreadcrumbSeparator />}
          </>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
