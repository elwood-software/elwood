import { Construction } from "lucide-react";

import { AppLayout } from "#/components/app-layout";

export default function Page() {
  return (
    <AppLayout>
      {" "}
      <div className="w-full h-full flex flex-col items-center justify-center">
        <div className="bg-muted rounded-full p-8 mb-6">
          <Construction className="size-24 text-muted-foreground" />
        </div>

        <h1 className="font-bold text-3xl">Coming Soon</h1>
        <p className="text-sm text-muted-foreground">
          ...maybe. "soon" might be relative
        </p>
      </div>
    </AppLayout>
  );
}
