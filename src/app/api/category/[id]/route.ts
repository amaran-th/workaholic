// PATCH /api/categories/[id]
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const body = await req.json();
    const { name, color } = body;
    const { id } = await context.params;
    if (!name && !color) {
      return NextResponse.json({ error: "Nothing to update" }, { status: 400 });
    }

    const updatedCategory = await prisma.category.update({
      where: { id },
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
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id: categoryId } = await context.params;

    await prisma.$transaction([
      prisma.sprint.deleteMany({
        where: { categoryId: categoryId },
      }),
      prisma.category.delete({
        where: { id: categoryId },
      }),
    ]);

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
