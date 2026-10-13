import { auth } from "@clerk/nextjs/server";

import { EditorLayout } from "@/components/editor/editor-layout";
import { EditorHome } from "@/components/editor/editor-home";

export default async function EditorPage() {
  await auth.protect();

  return (
    <EditorLayout>
      <EditorHome />
    </EditorLayout>
  );
}
