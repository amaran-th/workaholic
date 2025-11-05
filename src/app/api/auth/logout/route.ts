// app/api/auth/logout/route.ts
import { supabaseServer } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const accessToken = req.cookies.get("sb-access-token")?.value;

  if (accessToken) {
    // 서버 세션 무효화
    await supabaseServer.auth.signOut();
    // 참고: supabaseServer.auth.signOut()은 service key를 쓰는 경우 클라이언트 세션이 없으므로
    // 단순히 토큰 삭제용으로만 생각하면 됩니다
  }

  const response = NextResponse.json({ message: "Logged out" });

  // 클라이언트 쿠키 삭제
  response.cookies.set("sb-access-token", "", {
    httpOnly: true,
    path: "/",
    maxAge: 0,
    sameSite: "lax",
  });
  response.cookies.set("sb-refresh-token", "", {
    httpOnly: true,
    path: "/",
    maxAge: 0,
    sameSite: "lax",
  });

  return response;
}
