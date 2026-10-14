import Link from "next/link";
import { LockKeyhole } from "lucide-react";

import { Button } from "@/components/ui/button";

export function AccessDenied() {
  return (
    <main className="flex min-h-dvh items-center justify-center bg-base px-6 text-center">
      <div className="flex max-w-sm flex-col items-center gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-surface-border bg-surface text-copy-muted">
          <LockKeyhole aria-hidden="true" className="h-6 w-6" />
        </div>
        <div className="space-y-2">
          <h1 className="text-lg font-semibold text-copy-primary">Workspace unavailable</h1>
          <p className="text-sm text-copy-muted">
            This project does not exist or you don’t have access to it.
          </p>
        </div>
        <Button asChild variant="outline">
          <Link href="/editor">Back to projects</Link>
        </Button>
      </div>
    </main>
  );
}
