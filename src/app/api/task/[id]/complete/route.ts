import { prisma } from "@/lib/prisma";
import { convertKSTDateToUTC } from "@/lib/utils/formatDate";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id: taskId } = await context.params;
    const { date } = await req.json(); // YYYY-MM-DDTHH:mm:ss KST
    if (!date) return new NextResponse("date is required", { status: 400 });

    const { startUTC, endUTC } = convertKSTDateToUTC(date);

    const task = await prisma.task.findUnique({ where: { id: taskId } });
    if (!task) throw new Error("Task not found");
    console.log("test", date, startUTC, endUTC);
    // 특정 날짜의 doStamp 확인
    const sameDayStamp = await prisma.doStamp.findFirst({
      where: {
        taskId,
        createdAt: {
          gte: startUTC,
          lt: endUTC,
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
      where: { taskId, createdAt: { gt: endUTC } },
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
        endDate: task.endDate === null ? date : null,
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
