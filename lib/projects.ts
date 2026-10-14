import "server-only";

import { prisma } from "@/lib/prisma";

export interface EditorProject {
  id: string;
  name: string;
  slug: string;
  ownership: "owned" | "shared";
}

interface ProjectRecord {
  id: string;
  name: string;
}

export async function getEditorProjects(userId: string, email?: string | null) {
  const [owned, shared]: [ProjectRecord[], ProjectRecord[]] = await Promise.all([
    prisma.project.findMany({
      where: { ownerId: userId },
      orderBy: { updatedAt: "desc" },
      select: { id: true, name: true },
    }),
    email
      ? prisma.project.findMany({
          where: {
            ownerId: { not: userId },
            collaborators: { some: { email: { equals: email, mode: "insensitive" } } },
          },
          orderBy: { updatedAt: "desc" },
          select: { id: true, name: true },
        })
      : Promise.resolve([]),
  ]);

  return {
    owned: owned.map((project) => ({ ...project, slug: project.id, ownership: "owned" as const })),
    shared: shared.map((project) => ({ ...project, slug: project.id, ownership: "shared" as const })),
  };
}

export async function getEditorProjectAccess(projectId: string, userId: string, email?: string | null) {
  const project = (await prisma.project.findUnique({
    where: { id: projectId },
    select: {
      id: true,
      name: true,
      ownerId: true,
      collaborators: { select: { email: true } },
    },
  })) as { id: string; name: string; ownerId: string; collaborators: { email: string }[] } | null;

  if (!project) return null;
  const isOwner = project.ownerId === userId;
  const isCollaborator = Boolean(
    email && project.collaborators.some((collaborator) => collaborator.email.toLowerCase() === email.toLowerCase()),
  );

  return isOwner || isCollaborator ? { id: project.id, name: project.name } : null;
}
