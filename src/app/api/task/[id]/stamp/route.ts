// POST /api/tasks/[id]/stamp
import { prisma } from "@/lib/prisma";
import { convertKSTDateToUTC } from "@/lib/utils/formatDate";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id: taskId } = params;
    const { date } = await req.json(); // YYYY-MM-DDTHH:mm:ss KST
    if (!taskId || !date)
      return new NextResponse("task id and date is required", { status: 400 });

    const { startUTC, UTC, endUTC } = convertKSTDateToUTC(date);

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
      const newStamp = await prisma.doStamp.create({
        data: { taskId, createdAt: UTC },
      });

      // 가장 빠른 도장 찾기 → startDate 조정
      const earliestStamp = await prisma.doStamp.findFirst({
        where: { taskId },
        orderBy: { createdAt: "asc" },
      });

      await prisma.task.update({
        where: { id: taskId },
        data: { startDate: earliestStamp?.createdAt ?? null },
      });

      return NextResponse.json({ action: "created", stamp: newStamp });
    } else {
      // 기존 도장 삭제
      await prisma.doStamp.delete({ where: { id: existingStamp.id } });

      // 남은 도장 중 가장 빠른 날짜 → startDate 갱신
      const nextEarliest = await prisma.doStamp.findFirst({
        where: { taskId },
        orderBy: { createdAt: "asc" },
      });

      await prisma.task.update({
        where: { id: taskId },
        data: { startDate: nextEarliest?.createdAt ?? null },
      });

      return NextResponse.json({ action: "deleted" });
    }
  } catch (error) {
    console.error(error);
    return new NextResponse("Failed to toggle stamp", { status: 500 });
  }
}
