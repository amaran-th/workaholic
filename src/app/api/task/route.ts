import { prisma } from "@/lib/prisma";
import { formatDateString } from "@/lib/utils/formatDate";
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
        dueDate,
        memberId,
        categoryId,
        parentTaskId,
        sprintId,
        taskPositions: {
          create: {
            positionX,
            positionY,
            date: formatDateString(new Date()),
          },
        },
      },
    });

    return NextResponse.json(newTask);
  } catch (error) {
    console.error(error);
    return new NextResponse("Failed to create task", { status: 500 });
  }
}
