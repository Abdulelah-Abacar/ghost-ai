"use client";

import { useEffect, useRef } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import type { Project } from "@/components/editor/use-project-dialogs";

interface ProjectDialogsProps {
  dialog: "create" | "rename" | "delete" | null;
  name: string;
  slug: string;
  project: Project | null;
  isLoading: boolean;
  onNameChange: (name: string) => void;
  onClose: () => void;
  onSubmit: () => void;
  onDelete: () => void;
}

export function ProjectDialogs({
  dialog,
  name,
  slug,
  project,
  isLoading,
  onNameChange,
  onClose,
  onSubmit,
  onDelete,
}: ProjectDialogsProps) {
  const renameInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (dialog === "rename") renameInputRef.current?.focus();
  }, [dialog]);

  const isNameDialog = dialog === "create" || dialog === "rename";
  const title = dialog === "create" ? "Create project" : "Rename project";

  return (
    <>
      <Dialog open={isNameDialog} onOpenChange={(open) => !open && onClose()}>
        <DialogContent className="rounded-3xl border border-surface-border bg-elevated text-copy-primary sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-white text-xl">{title}</DialogTitle>
            {dialog === "rename" && project && (
              <DialogDescription className="text-copy-muted">
                Rename “{project.name}”.
              </DialogDescription>
            )}
          </DialogHeader>
          <form
            onSubmit={(event) => {
              event.preventDefault();
              onSubmit();
            }}
            className="space-y-4"
          >
            <div className="space-y-2">
              <label
                className="text-xl mb-2 font-medium text-copy-secondary"
                htmlFor="project-name"
              >
                Project name
              </label>
              <Input
                ref={dialog === "rename" ? renameInputRef : undefined}
                autoFocus={dialog === "create"}
                id="project-name"
                value={name}
                onChange={(event) => onNameChange(event.target.value)}
                placeholder="My system design"
                required
                maxLength={80}
                disabled={isLoading}
              />
            </div>
            {dialog === "create" && (
              <p className="text-sm text-copy-muted">
                Slug preview:{" "}
                <span className="font-mono text-copy-secondary">
                  {slug || "your-project-name"}
                </span>
              </p>
            )}
            <DialogFooter className="border-surface-border bg-surface/50">
              <Button
                type="button"
                variant="ghost"
                onClick={onClose}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={!name.trim() || isLoading}>
                {isLoading
                  ? "Saving…"
                  : dialog === "create"
                    ? "Create project"
                    : "Save changes"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog
        open={dialog === "delete"}
        onOpenChange={(open) => !open && onClose()}
      >
        <DialogContent className="rounded-3xl border border-surface-border bg-elevated text-copy-primary sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-white text-xl">
              Delete project?
            </DialogTitle>
            <DialogDescription className="text-copy-muted">
              This will remove “{project?.name}” from your projects.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="border-surface-border bg-surface/50">
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={onDelete}
              disabled={isLoading}
            >
              {isLoading ? "Deleting…" : "Delete project"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
