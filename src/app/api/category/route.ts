import { prisma } from "@/lib/prisma";
import { authenticate } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

// GET /api/categories?=xxx
export async function GET(req: NextRequest) {
  try {
    const { id: memberId } = await authenticate(req);

    if (!memberId) {
      return NextResponse.json(
        { error: "memberId query parameter is required" },
        { status: 400 }
      );
    }

    // 특정 멤버의 카테고리만
    const categories = await prisma.category.findMany({
      where: { memberId },
      orderBy: { createdAt: "desc" }, // 정렬 옵션 (원하면 제거 가능)
    });

    return NextResponse.json(categories, { status: 200 });
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}

// POST /api/categories
export async function POST(req: NextRequest) {
  try {
    const { id: memberId } = await authenticate(req);
    const body = await req.json();
    const { name, color } = body;

    if (!memberId || !name || !color) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const category = await prisma.category.create({
      data: { memberId, name, color },
    });

    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to create category" },
      { status: 500 }
    );
  }
}
