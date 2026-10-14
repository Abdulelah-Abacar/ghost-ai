import { auth, currentUser } from "@clerk/nextjs/server";

import { EditorLayout } from "@/components/editor/editor-layout";
import { EditorHome } from "@/components/editor/editor-home";
import { getEditorProjects } from "@/lib/projects";

export default async function EditorPage() {
  const { userId } = await auth.protect();
  const user = await currentUser();
  const projects = await getEditorProjects(userId, user?.primaryEmailAddress?.emailAddress);

  return (
    <EditorLayout projects={[...projects.owned, ...projects.shared]}>
      <EditorHome />
    </EditorLayout>
  );
}
