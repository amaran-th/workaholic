import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await req.json();
    const { positionX, positionY, positionDate } = body;

    if (positionX === undefined || positionY === undefined || !positionDate) {
      return new NextResponse(
        "positionX, positionY, and positionDate are required",
        { status: 400 }
      );
    }

    // taskPosition 목록 조회
    const taskPositions = await prisma.taskPosition.findMany({
      where: { taskId: id },
    });

    // 날짜가 같은 항목 찾기
    const existing = taskPositions.find((tp) => tp.date === positionDate);

    let result;
    if (existing) {
      // 같은 날짜가 있으면 업데이트
      result = await prisma.taskPosition.update({
        where: { id: existing.id },
        data: { positionX, positionY },
      });
    } else {
      // 없으면 새로 생성
      result = await prisma.taskPosition.create({
        data: {
          taskId: id,
          positionX,
          positionY,
          date: positionDate,
        },
      });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error(error);
    return new NextResponse("Failed to update task position", { status: 500 });
  }
}
