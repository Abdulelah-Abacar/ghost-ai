import { auth, currentUser } from "@clerk/nextjs/server";

import { getProjectAccess } from "@/lib/project-access";
import { getCursorColor, getLiveblocksClient } from "@/lib/liveblocks";

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

  const roomId = "room" in body ? body.room : undefined;
  if (typeof roomId !== "string" || roomId.length === 0) {
    return Response.json({ error: "Room ID is required" }, { status: 400 });
  }

  const user = await currentUser();
  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const project = await getProjectAccess(
    roomId,
    userId,
    user.primaryEmailAddress?.emailAddress ?? null,
  );

  if (!project) {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }

  const liveblocks = getLiveblocksClient();
  await liveblocks.getOrCreateRoom(project.id, { defaultAccesses: [] });

  const cursorColor = getCursorColor(userId);
  const session = liveblocks.prepareSession(userId, {
    userInfo: {
      name: user.fullName ?? user.username ?? user.primaryEmailAddress?.emailAddress ?? "User",
      avatar: user.imageUrl,
      color: cursorColor,
    },
  });

  session.allow(project.id, ["*:write"]);

  const { body: tokenBody, status } = await session.authorize();
  return new Response(tokenBody, { status });
}
