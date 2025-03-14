import { PropsWithChildren } from "react";

import { CircleAlert } from "lucide-react";

import { cn } from "#/lib/utils";

export type ErrorNoticeProps = {
  title?: string;
  className?: string;
};

export function ErrorNotice(props: PropsWithChildren<ErrorNoticeProps>) {
  return (
    <div
      className={cn(
        "bg-red-800/25 border-red-900/25 border p-3 rounded flex gap-3",
        props.className,
      )}
    >
      <CircleAlert className="mt-1" />
      <div className="flex flex-col text-sm">
        <strong className="">Error</strong>
        {props.children}
      </div>
    </div>
  );
}
