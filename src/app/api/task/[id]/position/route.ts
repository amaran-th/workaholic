import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id: taskId } = await context.params;
    const { positionX, positionY, positionDate } = await req.json();

    if (positionX === undefined || positionY === undefined || !positionDate) {
      return new NextResponse(
        "positionX, positionY, and positionDate are required",
        { status: 400 }
      );
    }

    const result = await prisma.taskPosition.upsert({
      where: {
        taskId_date: {
          taskId,
          date: positionDate,
        },
      },
      update: {
        positionX,
        positionY,
      },
      create: {
        taskId,
        date: positionDate,
        positionX,
        positionY,
      },
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error(error);
    return new NextResponse("Failed to update task position", { status: 500 });
  }
}
