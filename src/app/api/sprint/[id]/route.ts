import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// ✅ 단일 스프린트 조회
export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const sprint = await prisma.sprint.findUnique({
      where: { id },
      include: { category: true, tasks: true },
    });

    if (!sprint) return new NextResponse("Sprint not found", { status: 404 });

    return NextResponse.json(sprint);
  } catch (error) {
    console.error(error);
    return new NextResponse("Failed to fetch sprint", { status: 500 });
  }
}

// ✅ 스프린트 수정
export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const body = await req.json();
    const { name, startDate, endDate, categoryId } = body;

    const updated = await prisma.sprint.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(startDate && { startDate: new Date(startDate) }),
        ...(endDate && { endDate: new Date(endDate) }),
        ...(categoryId && { categoryId }),
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error(error);
    return new NextResponse("Failed to update sprint", { status: 500 });
  }
}

// ✅ 스프린트 삭제
export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    await prisma.sprint.delete({ where: { id } });
    return new NextResponse("Sprint deleted", { status: 200 });
  } catch (error) {
    console.error(error);
    return new NextResponse("Failed to delete sprint", { status: 500 });
  }
}
