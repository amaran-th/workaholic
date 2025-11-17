// POST /api/tasks/[id]/stamp
import { prisma } from "@/lib/prisma";
import { convertKSTDateToUTC } from "@/lib/utils/formatDate";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id: taskId } = await context.params;
    const { date } = await req.json();
    if (!taskId || !date)
      return new NextResponse("task id and date is required", { status: 400 });

    const { startUTC, endUTC } = convertKSTDateToUTC(date);

    const result = await prisma.$transaction(async (tx) => {
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
        const newStamp = await tx.doStamp.create({
          data: { taskId, createdAt: date },
        });

        // 가장 빠른 도장 찾기 → startDate 조정
        const earliestStamp = await tx.doStamp.findFirst({
          where: { taskId },
          orderBy: { createdAt: "asc" },
        });

        await tx.task.update({
          where: { id: taskId },
          data: { startDate: earliestStamp?.createdAt ?? null },
        });

        return {
          action: "created",
          stamp: newStamp,
          startDate: earliestStamp?.createdAt ?? null,
        };
      }
      // 기존 도장 삭제
      await tx.doStamp.delete({ where: { id: existingStamp.id } });

      // 남은 도장 중 가장 빠른 날짜 → startDate 갱신
      const nextEarliest = await tx.doStamp.findFirst({
        where: { taskId },
        orderBy: { createdAt: "asc" },
      });

      await tx.task.update({
        where: { id: taskId },
        data: { startDate: nextEarliest?.createdAt ?? null },
      });
      return {
        action: "deleted",
        startDate: nextEarliest?.createdAt ?? null,
      };
    });
    return NextResponse.json(result);
  } catch (error) {
    console.error(error);
    return new NextResponse("Failed to toggle stamp", { status: 500 });
  }
}
