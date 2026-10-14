import "server-only";

import { clerkClient } from "@clerk/nextjs/server";

import { prisma } from "@/lib/prisma";

export interface CollaboratorProfile {
  email: string;
  name: string | null;
  imageUrl: string | null;
}

export async function listProjectCollaborators(projectId: string): Promise<CollaboratorProfile[]> {
  const collaborators = (await prisma.projectCollaborator.findMany({
    where: { projectId },
    orderBy: { createdAt: "asc" },
    select: { email: true },
  })) as { email: string }[];

  if (!collaborators.length) return [];

  const client = await clerkClient();
  const users = await client.users.getUserList({
    emailAddress: collaborators.map(({ email }) => email),
    limit: 500,
  });
  const byEmail = new Map<string, { name: string | null; imageUrl: string | null }>();

  for (const user of users.data) {
    for (const address of user.emailAddresses) {
      byEmail.set(address.emailAddress.toLowerCase(), {
        name: [user.firstName, user.lastName].filter(Boolean).join(" ") || null,
        imageUrl: user.imageUrl || null,
      });
    }
  }

  return collaborators.map(({ email }) => ({
    email,
    ...(byEmail.get(email.toLowerCase()) ?? { name: null, imageUrl: null }),
  }));
}
