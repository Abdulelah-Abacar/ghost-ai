import { auth } from "@clerk/nextjs/server";

import { prisma } from "@/lib/prisma";

interface RouteContext {
  params: Promise<{ projectId: string; email: string }>;
}

export async function DELETE(_request: Request, { params }: RouteContext) {
  const { userId } = await auth();
  if (!userId) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { projectId, email: encodedEmail } = await params;
  const email = decodeURIComponent(encodedEmail).trim().toLowerCase();
  const project = await prisma.project.findUnique({ where: { id: projectId }, select: { ownerId: true } });
  if (!project) return Response.json({ error: "Project not found" }, { status: 404 });
  if (project.ownerId !== userId) return Response.json({ error: "Forbidden" }, { status: 403 });

  const result = await prisma.projectCollaborator.deleteMany({ where: { projectId, email } });
  if (!result.count) return Response.json({ error: "Collaborator not found" }, { status: 404 });

  return new Response(null, { status: 204 });
}
