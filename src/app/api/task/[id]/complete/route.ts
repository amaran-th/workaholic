import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id: taskId } = params;
    const { date } = await req.json();
    const targetDate = new Date(date);

    const task = await prisma.task.findUnique({ where: { id: taskId } });
    if (!task) throw new Error("Task not found");

    // 특정 날짜의 doStamp 확인
    const sameDayStamp = await prisma.doStamp.findFirst({
      where: {
        taskId,
        createdAt: {
          gte: new Date(targetDate.setHours(0, 0, 0, 0)),
          lt: new Date(targetDate.setHours(23, 59, 59, 999)),
        },
      },
    });

    if (!sameDayStamp) {
      return new NextResponse("No stamp exists on the given date", {
        status: 400,
      });
    }

    // 이후 도장 존재 여부 확인
    const afterStamps = await prisma.doStamp.findMany({
      where: { taskId, createdAt: { gt: targetDate } },
    });

    if (afterStamps.length > 0) {
      return new NextResponse("Cannot complete task due to later stamps", {
        status: 400,
      });
    }

    // endDate 토글
    const updatedTask = await prisma.task.update({
      where: { id: taskId },
      data: {
        endDate: task.endDate === null ? targetDate : null,
      },
    });

    return NextResponse.json({
      action: task.endDate === null ? "completed" : "reverted",
      task: updatedTask,
    });
  } catch (error) {
    console.error(error);
    return new NextResponse("Failed to toggle complete", { status: 500 });
  }
}
