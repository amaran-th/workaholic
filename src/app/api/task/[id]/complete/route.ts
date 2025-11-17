import dayjs from "@/lib/dayjs";
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

    const result = await prisma.$transaction(async (tx) => {
      const task = await tx.task.findUnique({ where: { id: taskId } });

      if (!task) throw new Error("Task not found");

      let updatedTask;

      if (dayjs(task.endDate).isSame(startUTC, "d")) {
        updatedTask = await tx.task.update({
          where: { id: taskId },
          data: {
            endDate: null,
          },
        });
        return { updatedTask, action: "reverted" };
      } else {
        // 특정 날짜의 doStamp 확인
        const sameDayStamp = await tx.doStamp.findFirst({
          where: {
            taskId,
            createdAt: {
              gte: startUTC,
              lt: endUTC,
            },
          },
        });

        if (!sameDayStamp) {
          await tx.doStamp.create({
            data: { taskId, createdAt: date },
          });
        }

        // endDate 업데이트
        updatedTask = await tx.task.update({
          where: { id: taskId },
          data: {
            endDate: date,
          },
        });

        // 이후 도장 모두 삭제
        await tx.doStamp.deleteMany({
          where: { taskId, createdAt: { gt: endUTC } },
        });

        return { updatedTask, action: "completed" };
      }
    });
    return NextResponse.json(result);
  } catch (error) {
    console.error(error);
    return new NextResponse("Failed to toggle complete", { status: 500 });
  }
}
