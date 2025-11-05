import { supabase } from "@/lib/supabase/client";
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

  if (!data.user.email_confirmed_at) {
    return NextResponse.json(
      { error: "이메일 인증이 필요합니다. 이메일을 확인해주세요." },
      { status: 403 }
    );
  }
  const response = NextResponse.json({ user: data.user });

  await supabase.auth.setSession(data.session);
  // 쿠키에 세션 저장
  response.cookies.set("sb-access-token", data.session.access_token, {
    httpOnly: true,
    path: "/",
    sameSite: "lax",
  });
  response.cookies.set("sb-refresh-token", data.session.refresh_token, {
    httpOnly: true,
    path: "/",
    sameSite: "lax",
  });

  return response;
}
