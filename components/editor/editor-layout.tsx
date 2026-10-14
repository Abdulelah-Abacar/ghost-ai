"use client";

import { useState } from "react";

import { EditorNavbar } from "@/components/editor/editor-navbar";
import { ProjectSidebar } from "@/components/editor/project-sidebar";
import { ProjectDialogs } from "@/components/editor/project-dialogs";
import { useProjectActions, type Project } from "@/hooks/use-project-actions";

interface EditorLayoutProps {
  children: React.ReactNode;
  projects: Project[];
}

export function EditorLayout({ children, projects }: EditorLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const projectActions = useProjectActions(projects);

  function toggleSidebar() {
    setIsSidebarOpen((isOpen) => !isOpen);
  }

  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-base">
      <EditorNavbar
        isSidebarOpen={isSidebarOpen}
        onSidebarToggle={toggleSidebar}
      />
      <ProjectSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        projects={projectActions.projects}
        onCreate={projectActions.openCreate}
        onOpen={projectActions.openProject}
        onRename={projectActions.openRename}
        onDelete={projectActions.openDelete}
      />
      <main className="min-h-0 flex-1">{children}</main>
      <ProjectDialogs
        dialog={projectActions.dialog}
        name={projectActions.name}
        roomId={projectActions.roomId}
        error={projectActions.error}
        project={projectActions.activeProject}
        isLoading={projectActions.isLoading}
        onNameChange={projectActions.setName}
        onClose={projectActions.closeDialog}
        onSubmit={projectActions.submit}
        onDelete={projectActions.confirmDelete}
      />
    </div>
  );
}
