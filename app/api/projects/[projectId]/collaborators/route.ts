import { auth, clerkClient } from "@clerk/nextjs/server";

import { prisma } from "@/lib/prisma";
import { listProjectCollaborators } from "@/lib/project-collaborators";

interface RouteContext {
  params: Promise<{ projectId: string }>;
}

async function getAuthorizedProject(projectId: string, userId: string) {
  const project = (await prisma.project.findUnique({
    where: { id: projectId },
    select: { id: true, ownerId: true, collaborators: { select: { email: true } } },
  })) as { id: string; ownerId: string; collaborators: { email: string }[] } | null;

  if (!project) return { error: Response.json({ error: "Project not found" }, { status: 404 }) };

  if (project.ownerId !== userId) {
    const user = await (await clerkClient()).users.getUser(userId);
    const email = user.primaryEmailAddress?.emailAddress?.toLowerCase();
    const isCollaborator = Boolean(
      email && project.collaborators.some((entry) => entry.email.toLowerCase() === email),
    );
    if (!isCollaborator) return { error: Response.json({ error: "Forbidden" }, { status: 403 }) };
  }

  return { project };
}

export async function GET(_request: Request, { params }: RouteContext) {
  const { userId } = await auth();
  if (!userId) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { projectId } = await params;
  const access = await getAuthorizedProject(projectId, userId);
  if ("error" in access) return access.error;

  const [collaborators, owner] = await Promise.all([
    listProjectCollaborators(projectId),
    (await clerkClient()).users.getUser(access.project.ownerId),
  ]);

  return Response.json({
    collaborators,
    owner: {
      email: owner.primaryEmailAddress?.emailAddress ?? "",
      name: [owner.firstName, owner.lastName].filter(Boolean).join(" ") || null,
      imageUrl: owner.imageUrl || null,
    },
    isOwner: access.project.ownerId === userId,
  });
}

export async function POST(request: Request, { params }: RouteContext) {
  const { userId } = await auth();
  if (!userId) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { projectId } = await params;
  const project = await prisma.project.findUnique({ where: { id: projectId }, select: { ownerId: true } });
  if (!project) return Response.json({ error: "Project not found" }, { status: 404 });
  if (project.ownerId !== userId) return Response.json({ error: "Forbidden" }, { status: 403 });

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }
  if (
    typeof body !== "object" || body === null || Array.isArray(body) ||
    !("email" in body) || typeof body.email !== "string"
  ) {
    return Response.json({ error: "A valid email address is required" }, { status: 400 });
  }

  const email = body.email.trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return Response.json({ error: "Enter a valid email address" }, { status: 400 });
  }

  const owner = await (await clerkClient()).users.getUser(userId);
  if (owner.emailAddresses.some((address) => address.emailAddress.toLowerCase() === email)) {
    return Response.json({ error: "The project owner already has access" }, { status: 400 });
  }

  await prisma.projectCollaborator.upsert({
    where: { projectId_email: { projectId, email } },
    create: { projectId, email },
    update: {},
  });

  return Response.json({ collaborators: await listProjectCollaborators(projectId) }, { status: 201 });
}
