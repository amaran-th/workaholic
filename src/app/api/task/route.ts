import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      content,
      memo,
      positionX,
      positionY,
      dueDate,
      memberId,
      categoryId,
      parentTaskId,
      sprintId,
    } = body;

    // member별로 no를 자동 증가
    const maxNo = await prisma.task.aggregate({
      _max: { no: true },
      where: { memberId },
    });

    const nextNo = (maxNo._max.no ?? 0) + 1;

    const newTask = await prisma.task.create({
      data: {
        no: nextNo,
        content,
        memo,
        positionX,
        positionY,
        dueDate,
        memberId,
        categoryId,
        parentTaskId,
        sprintId,
      },
    });

    return NextResponse.json(newTask);
  } catch (error) {
    console.error(error);
    return new NextResponse("Failed to create task", { status: 500 });
  }
}
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const memberId = searchParams.get("memberId");
    const categoryId = searchParams.get("categoryId");
    const sprintId = searchParams.get("sprintId");

    const from = searchParams.get("from"); // 기간 시작 (YYYY-MM-DD)
    const to = searchParams.get("to"); // 기간 끝 (YYYY-MM-DD)
    const createdAfter = searchParams.get("createdAfter"); // 생성일 기준 필터

    const where: any = {};

    if (memberId) where.memberId = memberId;
    if (categoryId) where.categoryId = categoryId;
    if (sprintId) where.sprintId = sprintId;

    // ✅ createdAt 필터: 특정 날짜 이후
    if (createdAfter) {
      where.createdAt = { lte: new Date(createdAfter) };
    }

    // ✅ from~to: 기간 교차 필터링 (겹치는 모든 task 포함)
    if (from && to) {
      const fromDate = new Date(from);
      const toDate = new Date(to);

      // task 기간이 [from, to]와 겹치는 경우
      where.AND = [
        { OR: [{ startDate: { lte: toDate } }, { startDate: null }] },
        { OR: [{ endDate: { gte: fromDate } }, { endDate: null }] },
      ];
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
      },
      orderBy: { createdAt: "asc" },
    });

    return NextResponse.json(tasks);
  } catch (error) {
    console.error("[GET /api/tasks] ❌", error);
    return NextResponse.json(
      { error: "Failed to fetch tasks" },
      { status: 500 }
    );
  }
}
