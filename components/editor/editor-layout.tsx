"use client";

import { useState } from "react";

import { EditorNavbar } from "@/components/editor/editor-navbar";
import { ProjectSidebar } from "@/components/editor/project-sidebar";
import { ProjectDialogs } from "@/components/editor/project-dialogs";
import { useProjectDialogs } from "@/components/editor/use-project-dialogs";

interface EditorLayoutProps {
  children: React.ReactNode;
}

export function EditorLayout({ children }: EditorLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const projectDialogs = useProjectDialogs();

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
        projects={projectDialogs.projects}
        onCreate={projectDialogs.openCreate}
        onRename={projectDialogs.openRename}
        onDelete={projectDialogs.openDelete}
      />
      <main className="min-h-0 flex-1">{children}</main>
      <ProjectDialogs
        dialog={projectDialogs.dialog}
        name={projectDialogs.name}
        slug={projectDialogs.slug}
        project={projectDialogs.activeProject}
        isLoading={projectDialogs.isLoading}
        onNameChange={projectDialogs.setName}
        onClose={projectDialogs.closeDialog}
        onSubmit={projectDialogs.submit}
        onDelete={projectDialogs.confirmDelete}
      />
    </div>
  );
}
