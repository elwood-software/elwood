import { ReactNode } from "react";

import { cva, type VariantProps } from "class-variance-authority";
import { Loader2, Check } from "lucide-react";
import { cn } from "#/lib/utils";

const noticeVariants = cva("px-3 py-2 rounded text-sm", {
  variants: {
    variant: {
      default: "",
      destructive: "bg-destructive text-white",
      success: "bg-green-800 [&>p]:text-green-100",
      info: "bg-blue-800 [&>p]:text-blue-100",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

export type NoticeProps = VariantProps<typeof noticeVariants> & {
  inProgress?: boolean;
  title: ReactNode;
  description?: ReactNode;
  className?: string;
};

export function Notice(props: NoticeProps) {
  const { variant, className } = props;
  const className_ = cn(noticeVariants({ variant, className }));

  return (
    <section className={className_}>
      <header className="flex items-center space-x-2">
        {props.inProgress && <Loader2 className="animate-spin size-[1rem]" />}
        {props.variant === "success" && <Check className="size-[1rem]" />}
        <h3>{props.title}</h3>
      </header>
      {props.description && (
        <p className="text-blue-200">{props.description}</p>
      )}
    </section>
  );
}
