import { prisma } from "@/lib/prisma";
import { supabase } from "@/lib/supabase";
import bcrypt from "bcrypt";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { email, password, name } = await req.json();

  if (!email || !password) {
    return NextResponse.json(
      { error: "Email과 password를 입력해주세요." },
      { status: 400 }
    );
  }

  // Supabase Auth 회원가입
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/callback`,
    },
  });

  if (error)
    return NextResponse.json({ error: error.message }, { status: 400 });

  const userId = data.user?.id;
  if (!userId)
    return NextResponse.json(
      { error: "User ID not returned" },
      { status: 400 }
    );

  // Prisma Member 생성 (서버에서만 bcrypt 사용)
  const hashedPassword = await bcrypt.hash(password, 10);
  const member = await prisma.member.create({
    data: {
      id: userId,
      email,
      password: hashedPassword,
      name,
      centerX: 0,
      centerY: 0,
    },
  });

  return NextResponse.json({ member });
}
