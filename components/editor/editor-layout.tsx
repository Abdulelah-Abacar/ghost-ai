"use client";

import { useState } from "react";

import { EditorNavbar } from "@/components/editor/editor-navbar";
import { ProjectSidebar } from "@/components/editor/project-sidebar";
import { ProjectDialogs } from "@/components/editor/project-dialogs";
import { ShareDialog } from "@/components/editor/share-dialog";
import { useProjectActions, type Project } from "@/hooks/use-project-actions";

interface EditorLayoutProps {
  children: React.ReactNode;
  projects: Project[];
  activeRoomId?: string;
  projectName?: string;
}

export function EditorLayout({
  children,
  projects,
  activeRoomId,
  projectName,
}: EditorLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isAiSidebarOpen, setIsAiSidebarOpen] = useState(false);
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const projectActions = useProjectActions(projects);

  function toggleSidebar() {
    setIsSidebarOpen((isOpen) => !isOpen);
  }

  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-base">
      <EditorNavbar
        isSidebarOpen={isSidebarOpen}
        onSidebarToggle={toggleSidebar}
        projectName={projectName}
        onShare={() => setIsShareDialogOpen(true)}
        isAiSidebarOpen={isAiSidebarOpen}
        onAiSidebarToggle={() => setIsAiSidebarOpen((open) => !open)}
      />
      <ProjectSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        projects={projectActions.projects}
        activeRoomId={activeRoomId}
        onCreate={projectActions.openCreate}
        onOpen={projectActions.openProject}
        onRename={projectActions.openRename}
        onDelete={projectActions.openDelete}
      />
      <div className="flex min-h-0 flex-1">
        <main className="min-h-0 min-w-0 flex-1">{children}</main>
        {projectName && isAiSidebarOpen && (
          <aside
            aria-label="AI assistant"
            className="fixed inset-y-14 right-0 z-20 flex w-80 flex-col border-l border-surface-border bg-surface md:static md:inset-auto md:z-auto"
          >
            <div className="border-b border-surface-border px-4 py-3">
              <h2 className="text-sm font-semibold text-copy-primary">AI Assistant</h2>
            </div>
            <div className="flex flex-1 items-center justify-center px-6 text-center text-sm text-copy-muted">
              AI chat will be available here.
            </div>
          </aside>
        )}
      </div>
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
      {activeRoomId && projectName && (
        <ShareDialog
          open={isShareDialogOpen}
          onOpenChange={setIsShareDialogOpen}
          projectId={activeRoomId}
          projectName={projectName}
        />
      )}
    </div>
  );
}
