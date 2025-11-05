import { prisma } from "@/lib/prisma";
import { authenticate } from "@/lib/supabase/server";
import { convertKSTDateToUTC } from "@/lib/utils/formatDate";
import { NextRequest, NextResponse } from "next/server";
export async function GET(req: NextRequest) {
  try {
    const { id: memberId } = await authenticate(req);
    const { searchParams } = new URL(req.url);

    const categoryId = searchParams.get("categoryId");
    const sprintId = searchParams.get("sprintId");

    const from = searchParams.get("from"); // 기간 시작 (YYYY-MM-DD)
    const to = searchParams.get("to"); // 기간 끝 (YYYY-MM-DD)
    const date = searchParams.get("date"); // 특정 날짜 기준 필터 (YYYY-MM-DD)

    const where: any = {};

    if (memberId) where.memberId = memberId;
    if (categoryId) where.categoryId = categoryId;
    if (sprintId) where.sprintId = sprintId;

    if (!date) {
      return new NextResponse("date are required", { status: 400 });
    }

    // ✅ from~to: 기간 교차 필터링 (겹치는 모든 task 포함)
    if (from && to) {
      const { startUTC: fromDate } = convertKSTDateToUTC(from);
      const { endUTC: toDate } = convertKSTDateToUTC(to);

      // task 기간이 [from, to]와 겹치는 경우
      where.AND = [
        ...(where.AND ?? []),
        { OR: [{ startDate: { lte: toDate } }, { startDate: null }] },
        { OR: [{ endDate: { gte: fromDate } }, { endDate: null }] },
      ];
    }

    const { startUTC, endUTC } = convertKSTDateToUTC(date);
    where.AND = [
      ...(where.AND ?? []),
      { createdAt: { lte: endUTC } },
      { OR: [{ endDate: { gte: startUTC } }, { endDate: null }] },
    ];

    let member = null;
    if (memberId) {
      member = await prisma.member.findUnique({
        where: { id: memberId },
        select: {
          centerX: true,
          centerY: true,
          left: true,
          right: true,
          top: true,
          bottom: true,
        },
      });
    }

    const tasks = await prisma.task.findMany({
      where,
      include: {
        category: {
          select: { id: true, name: true, color: true },
        },
        sprint: true,
        parentTask: {
          select: { id: true, content: true },
        },
        doStamps: true,
        taskPositions: {
          where: {
            date: { lte: endUTC },
          },
          orderBy: { date: "desc" },
          take: 1,
        },
      },
      orderBy: { createdAt: "asc" },
    });

    const tasksWithPin = tasks.map((task) => {
      const { taskPositions, ...rest } = task;
      const posX = taskPositions?.[0]?.positionX;
      const posY = taskPositions?.[0]?.positionY;

      const isPinned =
        member &&
        ((posX >= member.left &&
          posX <= member.right &&
          posY >= member.top &&
          posY <= member.bottom) ||
          (posX === undefined && posY === undefined));

      let priority = null;
      if (member && isPinned) {
        if (posX <= member.centerX && posY <= member.centerY) priority = 1;
        else if (posX > member.centerX && posY <= member.centerY) priority = 2;
        else if (posX <= member.centerX && posY > member.centerY) priority = 3;
        else if (posX > member.centerX && posY > member.centerY) priority = 4;
      }

      return { ...rest, pinned: !!isPinned, priority };
    });

    return NextResponse.json(tasksWithPin);
  } catch (error) {
    console.error("[GET /api/tasks/list] ❌", error);
    return NextResponse.json(
      { error: "Failed to fetch tasks" },
      { status: 500 }
    );
  }
}
