import { AppLayout } from "#/components/app-layout";
import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <AppLayout defaultOpen={false}>
      <div className="grow flex items-center justify-center">
        <Loader2 className="animate-spin text-muted" />
      </div>
    </AppLayout>
  );
}
