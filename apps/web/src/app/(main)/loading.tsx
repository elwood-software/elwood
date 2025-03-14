import { AppLayout } from "#/components/app-layout";
import { Loader2 } from "lucide-react";

export default function Loading() {
  // You can add any UI inside Loading, including a Skeleton.
  return (
    <AppLayout defaultOpen={false}>
      <div className="grow flex items-center justify-center">
        <Loader2 className="animate-spin text-muted" />
      </div>
    </AppLayout>
  );
}
