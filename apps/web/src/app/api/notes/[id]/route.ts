import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@indix/db";
import { auth } from "@indix/auth";
import { headers } from "next/headers";

const updateSchema = z.object({
  title: z.string().optional(),
  content: z.string(),
});

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const noteId = params.id;

  try {
    const note = await prisma.note.findUnique({
      where: {
        id: noteId,
        userId: session.user.id,
      },
    });

    if (!note) {
      return NextResponse.json({ error: "Note not found" }, { status: 404 });
    }

    return NextResponse.json({ note });
  } catch (error) {
    console.error("Error fetching note:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const parsed = updateSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const { title, content } = parsed.data;
  const { id } = await params;

  try {
    const note = await prisma.note.update({
      where: {
        id,
        userId: session.user.id,
      },
      data: {
        title,
        content,
      },
    });

    return NextResponse.json({ note });
  } catch (error) {
    console.error("Error updating note:", error);
    return NextResponse.json({ error: "Note not found" }, { status: 404 });
  }
}
