import { Loader2, type LucideIcon } from "lucide-react";
import { ComponentProps } from "react";

import { cn } from "#/lib/utils.js";

export function Loading(props: ComponentProps<LucideIcon>): JSX.Element {
  return <Loader2 {...props} className={cn(props.className, "animate-spin")} />;
}
