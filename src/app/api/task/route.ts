import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      memberId,
      content,
      categoryId,
      parentTaskId,
      positionX,
      positionY,
    } = body;

    if (!memberId || !content || !categoryId) {
      return NextResponse.json(
        { error: "memberId, content, categoryId 필요" },
        { status: 400 }
      );
    }

    // Task 번호 자동 생성
    const maxNoTask = await prisma.task.findFirst({
      where: { memberId, categoryId },
      orderBy: { no: "desc" },
    });
    const no = maxNoTask ? maxNoTask.no + 1 : 1;

    const task = await prisma.task.create({
      data: {
        no,
        content,
        memberId,
        categoryId,
        parentTaskId,
        positionX: positionX ?? 0,
        positionY: positionY ?? 0,
      },
    });

    return NextResponse.json(task);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "알 수 없는 에러";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const memberId = req.nextUrl.searchParams.get("memberId");
    if (!memberId) {
      return NextResponse.json({ error: "memberId 필요" }, { status: 400 });
    }

    const tasks = await prisma.task.findMany({
      where: { memberId },
      orderBy: { no: "asc" },
      include: {
        parentTask: {
          select: { id: true, content: true },
        },
        doStamps: true,
      },
    });

    return NextResponse.json(tasks);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}
