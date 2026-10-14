import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { AccessDenied } from "@/components/editor/access-denied";
import { EditorLayout } from "@/components/editor/editor-layout";
import { getCurrentClerkIdentity, getProjectAccess, getEditorProjects } from "@/lib/project-access";

interface WorkspacePageProps {
  params: Promise<{ roomId: string }>;
}

export default async function WorkspacePage({ params }: WorkspacePageProps) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const [{ roomId }, identity] = await Promise.all([params, getCurrentClerkIdentity()]);
  if (!identity) redirect("/sign-in");

  const [project, projects] = await Promise.all([
    getProjectAccess(roomId, identity.userId, identity.email),
    getEditorProjects(identity.userId, identity.email),
  ]);

  if (!project) return <AccessDenied />;

  return (
    <EditorLayout
      projects={[...projects.owned, ...projects.shared]}
      activeRoomId={project.id}
      projectName={project.name}
    >
      <div className="flex h-full items-center justify-center bg-base px-6 text-center">
        <div className="space-y-2">
          <h1 className="text-xl font-semibold tracking-tight text-copy-primary">Canvas workspace</h1>
          <p className="text-sm text-copy-muted">Your system design canvas will appear here.</p>
        </div>
      </div>
    </EditorLayout>
  );
}
