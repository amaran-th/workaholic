import { prisma } from "@/lib/prisma";
import { convertKSTDateToUTC } from "@/lib/utils/formatDate";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id: taskId } = await context.params;
    const { date, selectedDate } = await req.json();
    if (!taskId || !selectedDate)
      return new NextResponse("taskId and selectedDate is required", {
        status: 400,
      });

    if (!date) {
      // 관련된 모든 도장 삭제
      await prisma.doStamp.deleteMany({
        where: { taskId },
      });

      // task 초기화
      await prisma.task.update({
        where: { id: taskId },
        data: {
          startDate: null,
          endDate: null,
          createdAt: selectedDate,
        },
      });

      return NextResponse.json({
        action: "reset",
        message: "Task reset and all stamps deleted.",
      });
    }

    const { startUTC, endUTC } = convertKSTDateToUTC(date);
    // date보다 이전 도장 모두 삭제
    await prisma.doStamp.deleteMany({
      where: {
        taskId,
        createdAt: { lt: date },
      },
    });

    // task.createdAt이 date보다 뒤라면 createdAt을 업데이트
    const task = await prisma.task.findUnique({
      where: { id: taskId },
      select: { createdAt: true },
    });

    await prisma.task.update({
      where: { id: taskId },
      data: {
        startDate: date,
        ...(task && task.createdAt > new Date(date) ? { createdAt: date } : {}),
      },
    });

    // 해당 날짜에 도장 존재 여부 확인
    const existingStamp = await prisma.doStamp.findFirst({
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
      await prisma.doStamp.create({
        data: { taskId, createdAt: date },
      });
    }
    return NextResponse.json({
      action: "created",
      message: "change start date",
    });
  } catch (error) {
    console.error(error);
    return new NextResponse("Failed to toggle stamp", { status: 500 });
  }
}
