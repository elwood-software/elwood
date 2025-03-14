"use client";

import { use } from "react";

import { NamespaceHeader } from "../../header";
import { useBlob } from "#/hooks/use-blob";
import { ErrorNotice } from "#/components/error";
import { Notice, type NoticeProps } from "#/components/notice";
import { ActionButton } from "#/components/action-button";
import { Loader2 } from "lucide-react";

export type PageProps = {
  params: Promise<{
    namespace: string;
    bucket: string;
    path: string[];
  }>;
};

export default function Page(props: PageProps) {
  const { namespace, bucket, path } = use(props.params);
  const { data, error, isLoading } = useBlob({
    namespace,
    bucket,
    path: path.join("/"),
  });

  const { size = 0, contentType = "unknown" } = data?.node.metadata ?? {};
  const actions = data?.actions ?? [];
  const notices = data?.notices ?? [];

  if (error) {
    return <ErrorNotice>Unable to load blob.</ErrorNotice>;
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
        <section className="bg-muted/15 grow rounded-b-md flex flex-col">
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

          <div className="grow items-center justify-center flex">
            {isLoading && <Loader2 className="animate-spin text-muted" />}
          </div>
        </section>
      </div>
      <footer className="min-h-8"></footer>
    </div>
  );
}
