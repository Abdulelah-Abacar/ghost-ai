"use client";

import { FolderOpen, Plus, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

interface ProjectSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

function EmptyProjectsState() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-3 px-6 text-center">
      <FolderOpen className="h-8 w-8 text-copy-faint" />
      <div className="space-y-1">
        <p className="text-sm font-medium text-copy-secondary">
          No projects yet
        </p>
        <p className="text-sm text-copy-muted">
          Create a project to start designing.
        </p>
      </div>
    </div>
  );
}

export function ProjectSidebar({ isOpen, onClose }: ProjectSidebarProps) {
  return (
    <aside
      aria-hidden={!isOpen}
      inert={!isOpen}
      aria-label="Projects"
      className={cn(
        "fixed top-18 bottom-4 left-4 z-40 flex w-80 flex-col rounded-2xl border border-surface-border bg-surface/95 shadow-2xl backdrop-blur transition-transform duration-200 ease-out",
        isOpen
          ? "translate-x-0"
          : "pointer-events-none -translate-x-[calc(100%+1rem)]",
      )}
    >
      <div className="flex items-center justify-between border-b border-surface-border px-4 py-3">
        <h2 className="text-sm font-semibold text-copy-primary">Projects</h2>
        <Button
          aria-label="Close projects sidebar"
          onClick={onClose}
          size="icon-sm"
          variant="ghost"
        >
          <X className="h-5 w-5" />
        </Button>
      </div>

      <Tabs
        className="min-h-0 flex-1 flex-col gap-0"
        defaultValue="my-projects"
      >
        <TabsList className="h-11 w-full rounded-none border-b border-surface-border bg-transparent p-0">
          <TabsTrigger className="h-full rounded-none" value="my-projects">
            My Projects
          </TabsTrigger>
          <TabsTrigger className="h-full rounded-none" value="shared">
            Shared
          </TabsTrigger>
        </TabsList>
        <TabsContent className="min-h-0" value="my-projects">
          <EmptyProjectsState />
        </TabsContent>
        <TabsContent className="min-h-0" value="shared">
          <EmptyProjectsState />
        </TabsContent>
      </Tabs>

      <div className="border-t border-surface-border p-4">
        <Button className="w-full" type="button">
          <Plus className="h-5 w-5" />
          New Project
        </Button>
      </div>
    </aside>
  );
}
