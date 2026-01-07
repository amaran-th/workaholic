import { supabaseServer } from "@/lib/supabase/server";
import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabaseAuth = createClient(supabaseUrl, supabaseAnonKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const setSessionCookies = (
  res: NextResponse,
  session: { access_token: string; refresh_token: string }
) => {
  res.cookies.set("sb-access-token", session.access_token, {
    httpOnly: true,
    path: "/",
    sameSite: "lax",
  });
  res.cookies.set("sb-refresh-token", session.refresh_token, {
    httpOnly: true,
    path: "/",
    sameSite: "lax",
  });
};

const clearAuthCookies = (res: NextResponse) => {
  res.cookies.set("sb-access-token", "", {
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    maxAge: 0,
  });
  res.cookies.set("sb-refresh-token", "", {
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    maxAge: 0,
  });
};

const upsertCookie = (cookieHeader: string, name: string, value: string) => {
  const cookies = new Map<string, string>();
  cookieHeader
    .split(";")
    .map((part) => part.trim())
    .filter(Boolean)
    .forEach((part) => {
      const [key, ...rest] = part.split("=");
      cookies.set(key, rest.join("="));
    });
  cookies.set(name, value);
  return Array.from(cookies.entries())
    .map(([key, val]) => `${key}=${val}`)
    .join("; ");
};

const buildRefreshedResponse = (
  req: NextRequest,
  session: { access_token: string; refresh_token: string }
) => {
  const requestHeaders = new Headers(req.headers);
  const updatedCookie = upsertCookie(
    upsertCookie(
      requestHeaders.get("cookie") ?? "",
      "sb-access-token",
      session.access_token
    ),
    "sb-refresh-token",
    session.refresh_token
  );
  requestHeaders.set("cookie", updatedCookie);
  const nextRes = NextResponse.next({
    request: { headers: requestHeaders },
  });
  setSessionCookies(nextRes, session);
  return nextRes;
};

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const { pathname } = req.nextUrl;
  const excludePaths = ["/_next", "/favicon.ico"];
  const unAuthedPath = [
    "/api/auth/login",
    "/api/auth/signup",
    "/login",
    "/signup",
  ];
  const isApiPath = pathname.startsWith("/api");
  if (excludePaths.some((path) => pathname.startsWith(path))) {
    return res;
  }

  const token = req.cookies.get("sb-access-token")?.value;
  const refreshToken = req.cookies.get("sb-refresh-token")?.value;
  const refreshSession = async (clearOnFail: boolean) => {
    if (!refreshToken) return null;
    const { data, error } = await supabaseAuth.auth.refreshSession({
      refresh_token: refreshToken,
    });
    if (error || !data.session || !data.user) {
      if (clearOnFail) {
        clearAuthCookies(res);
      }
      return null;
    }
    return data.session;
  };

  if (unAuthedPath.some((path) => pathname.startsWith(path))) {
    if (token) {
      const {
        data: { user },
      } = await supabaseServer.auth.getUser(token);
      if (user) {
        return NextResponse.redirect(new URL("/", req.url));
      }
    }
    const refreshed = await refreshSession(true);
    if (refreshed) {
      const redirectRes = NextResponse.redirect(new URL("/", req.url));
      setSessionCookies(redirectRes, refreshed);
      return redirectRes;
    }

    return res;
  }

  if (!token) {
    const refreshed = await refreshSession(!isApiPath);
    if (refreshed) {
      return buildRefreshedResponse(req, refreshed);
    }
    if (isApiPath) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.redirect(new URL("/login", req.url));
  }

  const {
    data: { user },
    error,
  } = await supabaseServer.auth.getUser(token);

  if (!user || error) {
    const refreshed = await refreshSession(!isApiPath);
    if (refreshed) {
      return buildRefreshedResponse(req, refreshed);
    }
    if (isApiPath) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
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
