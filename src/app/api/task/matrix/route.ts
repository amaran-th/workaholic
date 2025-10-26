import { prisma } from "@/lib/prisma";
import { convertKSTDateToUTC } from "@/lib/utils/formatDate";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const memberId = searchParams.get("memberId");
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

    const { startUTC: targetDate } = convertKSTDateToUTC(date);
    where.AND = [
      ...(where.AND ?? []),
      { createdAt: { lte: targetDate } },
      { OR: [{ endDate: { gte: targetDate } }, { endDate: null }] },
    ];

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
          where: { date: { lte: date } },
          orderBy: { date: "desc" },
          take: 1,
        },
      },
      orderBy: { createdAt: "asc" },
    });

    const processedTasks = tasks.map((task) => {
      const { taskPositions, ...rest } = task;
      return {
        ...rest,
        positionX: taskPositions?.[0]?.positionX,
        positionY: taskPositions?.[0]?.positionY,
      };
    });

    return NextResponse.json(processedTasks);
  } catch (error) {
    console.error("[GET /api/tasks/matrix] ❌", error);
    return NextResponse.json(
      { error: "Failed to fetch tasks" },
      { status: 500 }
    );
  }
}
