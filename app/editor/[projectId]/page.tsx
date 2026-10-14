import { auth, currentUser } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";

import { EditorLayout } from "@/components/editor/editor-layout";
import { getEditorProjectAccess, getEditorProjects } from "@/lib/projects";

interface WorkspacePageProps {
  params: Promise<{ projectId: string }>;
}

export default async function WorkspacePage({ params }: WorkspacePageProps) {
  const { userId } = await auth.protect();
  const [{ projectId }, user] = await Promise.all([params, currentUser()]);
  const email = user?.primaryEmailAddress?.emailAddress;
  const [project, projects] = await Promise.all([
    getEditorProjectAccess(projectId, userId, email),
    getEditorProjects(userId, email),
  ]);

  if (!project) notFound();

  return (
    <EditorLayout projects={[...projects.owned, ...projects.shared]}>
      <div className="flex h-full items-center justify-center px-6 text-center">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight text-copy-primary">{project.name}</h1>
          <p className="font-mono text-sm text-copy-muted">Room /{project.id}</p>
        </div>
      </div>
    </EditorLayout>
  );
}
