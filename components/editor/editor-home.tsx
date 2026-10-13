"use client";

import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";

export function EditorHome() {
  return (
    <div className="flex h-full items-center justify-center px-6 text-center">
      <div className="max-w-lg space-y-4">
        <h1 className="text-2xl font-semibold tracking-tight text-copy-primary">
          Create a project or open an existing one
        </h1>
        <p className="text-sm text-copy-muted">
          Start a new architecture workspace, or choose a project from the sidebar.
        </p>
        <Button type="button" onClick={() => window.dispatchEvent(new Event("open-create-project"))}>
          <Plus className="h-5 w-5" />
          New Project
        </Button>
      </div>
    </div>
  );
}
