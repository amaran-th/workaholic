import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// GET /api/categories?memberId=xxx
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const memberId = searchParams.get("memberId");

    let categories;

    if (memberId) {
      // 특정 멤버의 카테고리만
      categories = await prisma.category.findMany({
        where: { memberId },
        select: {
          id: true,
          name: true,
          color: true,
        },
        orderBy: { name: "asc" }, // 정렬 옵션 (원하면 제거 가능)
      });
    } else {
      // 전체 카테고리
      categories = await prisma.category.findMany({
        select: {
          id: true,
          name: true,
          color: true,
        },
        orderBy: { name: "asc" },
      });
    }

    return NextResponse.json(categories, { status: 200 });
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}
