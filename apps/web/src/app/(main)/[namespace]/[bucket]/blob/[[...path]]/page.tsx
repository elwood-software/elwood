"use client";

import { use } from "react";

import { NamespaceHeader } from "../../header";
import { useBlob } from "#/hooks/use-blob";
import { Badge } from "#/components/ui/badge";
import { Notice, type NoticeProps } from "#/components/notice";
import { ActionButton } from "#/components/action-button";

export type PageProps = {
  params: Promise<{
    namespace: string;
    bucket: string;
    path: string[];
  }>;
};

export default function Page(props: PageProps) {
  const { namespace, bucket, path } = use(props.params);
  const { data, isLoading } = useBlob({
    namespace,
    bucket,
    path: path.join("/"),
  });

  const { size = 0, contentType = "unknown" } = data?.node.metadata ?? {};
  const actions = data?.actions ?? [];
  const notices = data?.notices ?? [];

  if (isLoading) {
    return (
      <>
        <NamespaceHeader namespace={namespace} bucket={bucket} path={path} />
        <div className="rounded-md border mx-8 mt-4">
          <header className="px-3 py-2 border-b  bg-card rounded-t-md flex items-center space-x-2">
            <Badge variant="secondary" className="text-muted-foreground">
              ..
            </Badge>
          </header>
          <section className="min-h-10"></section>
        </div>
      </>
    );
  }

  return (
    <div className="flex flex-col grow">
      <NamespaceHeader namespace={namespace} bucket={bucket} path={path} />
      <div className="rounded-md border mx-8 mt-4 grow flex flex-col">
        <header className="px-3 py-2 border-b  bg-card rounded-t-md flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="font-mono flex space-x-1 text-foreground/50 text-xs">
              <span>
                {size}
                <span className="text-muted-foreground/50 ml-0.5">KB</span>
              </span>
              <span>&bull;</span>
              <span className="uppercase">{contentType}</span>
            </div>
          </div>
          <div>
            {actions.map((item) => {
              return (
                <ActionButton
                  variant="secondary"
                  size="xs"
                  key={`${path}-${item.type}`}
                  namespace={namespace}
                  bucket={bucket}
                  path={path.join("/")}
                  action={item}
                />
              );
            })}
          </div>
        </header>
        <section className="bg-muted/15 grow rounded-b-md">
          <div className="m-3 space-y-3">
            {notices.map((item) => {
              return (
                <Notice
                  key={`${path}-${item.title}`}
                  {...item}
                  variant={item.variant as NoticeProps["variant"]}
                />
              );
            })}
          </div>
        </section>
      </div>
      <footer className="min-h-8"></footer>
    </div>
  );
}
