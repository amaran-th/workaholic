import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await req.json();

    const allowedFields = [
      "content",
      "memo",
      "comment",
      "positionX",
      "positionY",
      "dueDate",
      "categoryId",
      "parentTaskId",
      "sprintId",
    ];
    const data: Record<string, any> = {};

    for (const field of allowedFields) {
      if (body[field] !== undefined) data[field] = body[field];
    }

    const updated = await prisma.task.update({
      where: { id },
      data,
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error(error);
    return new NextResponse("Failed to update task", { status: 500 });
  }
}
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // 트랜잭션으로 task와 연관된 doStamp를 모두 삭제
    await prisma.$transaction([
      prisma.doStamp.deleteMany({
        where: { taskId: id },
      }),
      prisma.task.delete({
        where: { id },
      }),
    ]);

    return NextResponse.json({ message: "Task 및 관련 DoStamp 삭제 완료" });
  } catch (error) {
    console.error(error);
    return new NextResponse("Failed to delete task", { status: 500 });
  }
}
