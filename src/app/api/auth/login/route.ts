import { supabase } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error)
    return NextResponse.json({ error: error.message }, { status: 401 });
  if (!data.session || !data.user)
    return NextResponse.json(
      { error: "Session not returned" },
      { status: 401 }
    );

  // 이메일 인증 확인
  if (!data.user.email_confirmed_at) {
    return NextResponse.json(
      { error: "이메일 인증이 필요합니다. 이메일을 확인해주세요." },
      { status: 403 }
    );
  }

  return NextResponse.json({ session: data.session });
}
