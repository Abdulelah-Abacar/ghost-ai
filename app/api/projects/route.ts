import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const { userId } = await auth();

  if (!userId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const projects = await prisma.project.findMany({
    where: { ownerId: userId },
    orderBy: { updatedAt: "desc" },
  });

  return Response.json({ projects });
}

export async function POST(request: Request) {
  const { userId } = await auth();

  if (!userId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (typeof body !== "object" || body === null || Array.isArray(body)) {
    return Response.json({ error: "Request body must be an object" }, { status: 400 });
  }

  const name = "name" in body ? body.name : undefined;
  if (name !== undefined && typeof name !== "string") {
    return Response.json({ error: "Project name must be a string" }, { status: 400 });
  }

  const id = "id" in body ? body.id : undefined;
  if (id !== undefined && (typeof id !== "string" || !/^[a-z0-9-]{1,100}$/.test(id))) {
    return Response.json({ error: "Project ID must be a valid room ID" }, { status: 400 });
  }

  const project = await prisma.project.create({
    data: {
      ...(id ? { id } : {}),
      ownerId: userId,
      name: name ?? "Untitled Project",
    },
  });

  return Response.json({ project }, { status: 201 });
}
