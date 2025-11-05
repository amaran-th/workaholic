import { supabaseServer } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const { pathname } = req.nextUrl;
  res.headers.set("x-pathname", pathname);
  const excludePaths = ["/_next", "/favicon.ico"];
  const unAuthedPath = [
    "/api/auth/login",
    "/api/auth/signup",
    "/login",
    "/register",
  ];
  if (excludePaths.some((path) => pathname.startsWith(path))) {
    return res;
  }

  const token = req.cookies.get("sb-access-token")?.value;
  if (unAuthedPath.some((path) => pathname.startsWith(path))) {
    if (token) {
      const {
        data: { user },
      } = await supabaseServer.auth.getUser(token);
      if (user) {
        return NextResponse.redirect(new URL("/", req.url));
      }
    }

    return res;
  }

  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  const {
    data: { user },
    error,
  } = await supabaseServer.auth.getUser(token);

  if (!user || error) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // --- 3️⃣ 정상 접근
  return res;
}

export const config = {
  matcher: [
    "/api/:path*", // 모든 API
    "/((?!_next|favicon.ico).*)", // 모든 페이지 (로그인 제외)
  ],
};
