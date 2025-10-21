// PATCH /api/categories/[id]
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    const { name, color } = body;

    if (!name && !color) {
      return NextResponse.json({ error: "Nothing to update" }, { status: 400 });
    }

    const updatedCategory = await prisma.category.update({
      where: { id: params.id },
      data: { name, color },
    });

    return NextResponse.json(updatedCategory);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to update category" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const categoryId = params.id;

    // 1️⃣ 관련 스프린트 먼저 삭제
    await prisma.sprint.deleteMany({
      where: { categoryId },
    });

    // 2️⃣ 카테고리 삭제
    await prisma.category.delete({
      where: { id: categoryId },
    });

    return NextResponse.json({
      message: "Category and related sprints deleted",
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to delete category" },
      { status: 500 }
    );
  }
}
