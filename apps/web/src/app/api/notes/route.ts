import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@indix/db";
import { auth } from "@indix/auth";
import { headers } from "next/headers";

const createSchema = z.object({
  title: z.string().optional(),
  content: z.string(),
});

export async function POST(req: NextRequest) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const parsed = createSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const { title, content } = parsed.data;

  const note = await prisma.note.create({
    data: {
      title,
      content,
      userId: session.user.id,
    },
  });

  return NextResponse.json({ id: note.id }, { status: 201 });
}
