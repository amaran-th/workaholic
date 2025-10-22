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

// PATCH /api/member/:id
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await req.json();

    // 업데이트 가능한 필드만 필터링
    const { name, bio, avatarUrl } = body;

    if (!id) {
      return NextResponse.json(
        { error: "멤버 ID가 필요합니다." },
        { status: 400 }
      );
    }

    const member = await prisma.member.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(bio && { bio }),
        ...(avatarUrl && { avatarUrl }),
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(member, { status: 200 });
  } catch (error) {
    console.error("Error updating member:", error);
    return NextResponse.json(
      { error: "멤버 정보를 수정하는 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
