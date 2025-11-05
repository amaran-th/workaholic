import { MemberPosition } from "@/features/member/types/member";
import { prisma } from "@/lib/prisma";
import { authenticate } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { id } = await authenticate(req);

  const member = await prisma.member.findUnique({
    where: { id },
    select: {
      centerX: true,
      centerY: true,
      left: true,
      right: true,
      top: true,
      bottom: true,
    },
  });

  if (!member)
    return NextResponse.json({ error: "Member not found" }, { status: 404 });

  return NextResponse.json(member);
}

export async function PATCH(req: NextRequest) {
  const { id } = await authenticate(req);
  const { centerX, centerY, left, right, top, bottom } =
    (await req.json()) as MemberPosition;

  const updatedMember = await prisma.member.update({
    where: { id },
    data: { centerX, centerY, left, right, top, bottom },
  });

  return NextResponse.json({
    centerX: updatedMember.centerX,
    centerY: updatedMember.centerY,
    left: updatedMember.left,
    right: updatedMember.right,
    top: updatedMember.top,
    bottom: updatedMember.bottom,
  });
}
