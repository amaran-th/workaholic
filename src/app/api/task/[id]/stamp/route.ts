// POST /api/tasks/[id]/stamp
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id: taskId } = params;
    const { date } = await req.json(); // date: ISO string
    const targetDate = new Date(date);

    // 해당 날짜에 도장 존재 여부 확인
    const existingStamp = await prisma.doStamp.findFirst({
      where: {
        taskId,
        createdAt: {
          gte: new Date(targetDate.setHours(0, 0, 0, 0)),
          lt: new Date(targetDate.setHours(23, 59, 59, 999)),
        },
      },
    });

    if (!existingStamp) {
      // 도장 생성
      const newStamp = await prisma.doStamp.create({
        data: { taskId, createdAt: new Date(date) },
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
