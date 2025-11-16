import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const body = await req.json();

    if (!id) return new NextResponse("Task id is required", { status: 400 });

    // 업데이트 가능한 필드 목록
    const allowedFields = new Set([
      "content",
      "memo",
      "comment",
      "dueDate",
      "categoryId",
      "sprintId",
      "parentTaskId",
      "createdAt",
    ]);

    const data: Record<string, any> = {};
    for (const [key, value] of Object.entries(body)) {
      if (allowedFields.has(key) && value !== undefined) {
        data[key] = value;
      }
    }

    const result = await prisma.$transaction(async (tx) => {
      const task = await tx.task.findUnique({
        where: { id },
        select: {
          categoryId: true,
        },
      });

      if (!task) throw new Error("Task not found");
      if (
        "categoryId" in data &&
        data.categoryId !== null &&
        data.categoryId !== task.categoryId
      ) {
        data.sprintId = null;
      }
      const updatedTask = await tx.task.update({
        where: { id },
        data,
      });

      return updatedTask;
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error(error);
    const message =
      error instanceof Error ? error.message : "Failed to update task";
    return new NextResponse(message, { status: 500 });
  }
}
export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    // 트랜잭션으로 task와 연관된 doStamp를 모두 삭제
    await prisma.$transaction([
      prisma.doStamp.deleteMany({
        where: { taskId: id },
      }),
      prisma.taskPosition.deleteMany({
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
