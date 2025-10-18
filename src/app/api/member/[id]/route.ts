import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  const member = await prisma.member.findUnique({
    where: { id },
    select: {
      email: true,
      name: true,
      bio: true,
      avatarUrl: true,
    },
  });

  if (!member)
    return NextResponse.json({ error: "Member not found" }, { status: 404 });

  return NextResponse.json(member);
}
