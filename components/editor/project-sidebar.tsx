"use client";

import {
  FolderOpen,
  MoreHorizontal,
  Pencil,
  Plus,
  Trash2,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import type { Project } from "@/hooks/use-project-actions";

interface ProjectSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  projects: Project[];
  onCreate: () => void;
  onOpen: (project: Project) => void;
  onRename: (project: Project) => void;
  onDelete: (project: Project) => void;
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

function ProjectList({
  projects,
  ownership,
  onOpen,
  onRename,
  onDelete,
}: {
  projects: Project[];
  ownership: Project["ownership"];
  onOpen: (project: Project) => void;
  onRename: (project: Project) => void;
  onDelete: (project: Project) => void;
}) {
  const filtered = projects.filter(
    (project) => project.ownership === ownership,
  );

  if (filtered.length === 0) return <EmptyProjectsState />;

  return (
    <div className="space-y-1 px-3 py-3">
      {filtered.map((project) => (
        <div
          key={project.id}
          className="group flex items-center gap-1 rounded-xl px-2 py-2 hover:bg-subtle"
        >
          <button className="min-w-0 flex-1 text-left" onClick={() => onOpen(project)} type="button">
            <span className="block truncate text-sm font-medium text-copy-primary">
              {project.name}
            </span>
            <span className="block truncate text-xs text-copy-muted">
              /{project.slug}
            </span>
          </button>
          {ownership === "owned" && (
            <div className="flex shrink-0 opacity-100 transition-opacity sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100">
              <Button
                aria-label={`Rename ${project.name}`}
                onClick={() => onRename(project)}
                size="icon-sm"
                variant="ghost"
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                aria-label={`Delete ${project.name}`}
                onClick={() => onDelete(project)}
                size="icon-sm"
                variant="ghost"
              >
                <Trash2 className="h-4 w-4 text-state-error" />
              </Button>
            </div>
          )}
          {ownership === "shared" && (
            <MoreHorizontal
              aria-hidden="true"
              className="h-4 w-4 text-copy-faint"
            />
          )}
        </div>
      ))}
    </div>
  );
}

export function ProjectSidebar({
  isOpen,
  onClose,
  projects,
  onCreate,
  onOpen,
  onRename,
  onDelete,
}: ProjectSidebarProps) {
  return (
    <>
      {isOpen && (
        <button
          aria-label="Close projects sidebar"
          className="fixed inset-0 z-30 bg-black/60 md:hidden"
          onClick={onClose}
          type="button"
        />
      )}
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
          <TabsContent
            className="min-h-0 flex-1 overflow-y-auto"
            value="my-projects"
          >
            <ProjectList
              projects={projects}
              ownership="owned"
              onOpen={onOpen}
              onRename={onRename}
              onDelete={onDelete}
            />
          </TabsContent>
          <TabsContent
            className="min-h-0 flex-1 overflow-y-auto"
            value="shared"
          >
            <ProjectList
              projects={projects}
              ownership="shared"
              onOpen={onOpen}
              onRename={onRename}
              onDelete={onDelete}
            />
          </TabsContent>
        </Tabs>

        <div className="border-t border-surface-border p-4">
          <Button className="w-full" onClick={onCreate} type="button">
            <Plus className="h-5 w-5" />
            New Project
          </Button>
        </div>
      </aside>
    </>
  );
}
