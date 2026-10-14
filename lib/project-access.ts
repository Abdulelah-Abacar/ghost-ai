import "server-only";

import { currentUser } from "@clerk/nextjs/server";

import { getEditorProjects } from "@/lib/projects";
import { prisma } from "@/lib/prisma";

export interface ClerkIdentity {
  userId: string;
  email: string | null;
}

interface ProjectAccessRecord {
  id: string;
  name: string;
  ownerId: string;
  collaborators: { email: string }[];
}

export async function getCurrentClerkIdentity(): Promise<ClerkIdentity | null> {
  const user = await currentUser();
  if (!user) return null;

  return {
    userId: user.id,
    email: user.primaryEmailAddress?.emailAddress ?? null,
  };
}

export async function getProjectAccess(roomId: string, userId: string, email: string | null) {
  const project = (await prisma.project.findUnique({
    where: { id: roomId },
    select: {
      id: true,
      name: true,
      ownerId: true,
      collaborators: { select: { email: true } },
    },
  })) as ProjectAccessRecord | null;

  if (!project) return null;

  const isOwner = project.ownerId === userId;
  const normalizedEmail = email?.toLowerCase();
  const isCollaborator = Boolean(
    normalizedEmail &&
      project.collaborators.some(
        (collaborator) => collaborator.email.toLowerCase() === normalizedEmail,
      ),
  );

  return isOwner || isCollaborator
    ? { id: project.id, name: project.name }
    : null;
}

export { getEditorProjects };
