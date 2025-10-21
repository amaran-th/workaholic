import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// ✅ 스프린트 목록 조회 (카테고리별)
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const categoryId = searchParams.get("categoryId");
  const memberId = searchParams.get("memberId"); // 선택적으로 멤버 필터도 가능

  try {
    if (!categoryId || !memberId) {
      return new NextResponse("categoryId is required", { status: 400 });
    }

    const sprints = await prisma.sprint.findMany({
      where: {
        categoryId,
        ...(memberId && { memberId }),
      },
      orderBy: { startDate: "desc" },
    });

    return NextResponse.json(sprints);
  } catch (error) {
    console.error(error);
    return new NextResponse("Failed to fetch sprints", { status: 500 });
  }
}

// ✅ 스프린트 생성
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, startDate, endDate, categoryId, memberId } = body;

    if (!name || !startDate || !endDate || !categoryId || !memberId) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    const sprint = await prisma.sprint.create({
      data: {
        name,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        categoryId,
        memberId,
      },
    });

    return NextResponse.json(sprint);
  } catch (error) {
    console.error(error);
    return new NextResponse("Failed to create sprint", { status: 500 });
  }
}
