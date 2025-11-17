import dayjs from "@/lib/dayjs";
import { prisma } from "@/lib/prisma";
import { convertKSTDateToUTC } from "@/lib/utils/formatDate";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id: taskId } = await context.params;
    const { date } = await req.json();

    if (!taskId)
      return new NextResponse("taskId is required", {
        status: 400,
      });

    if (!date) {
      // task 초기화
      await prisma.task.update({
        where: { id: taskId },
        data: {
          endDate: null,
        },
      });
      return NextResponse.json({
        action: "reset",
        message: "Task end date reseted",
      });
    }

    const { startUTC, endUTC } = convertKSTDateToUTC(date);
    await prisma.$transaction(async (tx) => {
      const task = await tx.task.findUnique({
        where: { id: taskId },
        select: { startDate: true },
      });
      if (!task) throw new Error("Task not found");
      if (task.startDate && dayjs(date).isBefore(dayjs(task.startDate))) {
        throw new Error("end date can't be before start date.");
      }

      // 해당 날짜에 도장 존재 여부 확인
      const existingStamp = await tx.doStamp.findFirst({
        where: {
          taskId,
          createdAt: {
            gte: startUTC,
            lt: endUTC,
          },
        },
      });

      if (!existingStamp) {
        // 도장 생성
        await tx.doStamp.create({
          data: { taskId, createdAt: date },
        });
      }
      // date보다 이후 도장 모두 삭제
      await tx.doStamp.deleteMany({
        where: {
          taskId,
          createdAt: { gt: endUTC },
        },
      });

      await tx.task.update({
        where: { id: taskId },
        data: {
          endDate: date,
          ...(task.startDate === null ? { startDate: date } : {}),
        },
      });
    });

    return NextResponse.json({
      action: "created",
      message: "change end date",
    });
  } catch (error: any) {
    console.error(error);
    return new NextResponse("Failed to Changing End Date", { status: 500 });
  }
}
