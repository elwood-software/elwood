"use client";

import { useEffect, useState } from "react";
import { CircleCheck, Loader2 } from "lucide-react";
import Link from "next/link";

import { Button, useSupabaseClient } from "@elwood/react";

export default function Page() {
  const client = useSupabaseClient();
  const [done, setDone] = useState(false);

  useEffect(() => {
    client.auth.signOut().finally(() => {
      setDone(true);
    });
  }, [client]);

  return (
    <div className="h-screen flex items-center justify-center flex-col">
      <CircleCheck className="size-24 text-secondary" />
      <h1 className="text-2xl font-extrabold mt-6 mb-3">Logout Complete</h1>
      <p>
        {!done && <Loader2 />}
        {done && (
          <Button asChild variant="secondary">
            <Link href="/auth">Return to Login</Link>
          </Button>
        )}
      </p>
    </div>
  );
}
