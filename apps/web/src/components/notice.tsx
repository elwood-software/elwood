import { ReactNode } from "react";

import { cva, type VariantProps } from "class-variance-authority";
import { Loader2, Check } from "lucide-react";
import { cn } from "#/lib/utils";

const noticeVariants = cva("px-3 py-2 rounded text-sm flex gap-3", {
  variants: {
    variant: {
      default: "",
      destructive: "bg-destructive text-white",
      success: "bg-green-800 [&_p]:text-green-100",
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
      <div className="mt-1">
        {props.inProgress && <Loader2 className="animate-spin size-[1rem]" />}
        {props.variant === "success" && <Check className="size-[1rem]" />}
      </div>
      <div>
        <header className="flex items-center space-x-2">
          <h3 className="font-medium">{props.title}</h3>
        </header>
        {props.description && <p>{props.description}</p>}
      </div>
    </section>
  );
}
