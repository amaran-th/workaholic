import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export const supabaseServer = createClient(supabaseUrl, supabaseServiceRoleKey);

export const getSupabaseServerClient = (req: NextRequest) => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

  return createServerClient(supabaseUrl, supabaseKey, {
    cookies: req.cookies, // next/headers에서 가져오는 cookies() 사용
  });
};

export async function getServerUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get("sb-access-token")?.value;

  if (!token) return null;

  // Supabase 서버 클라이언트 생성
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      cookies: {
        getAll: () =>
          [
            { name: "sb-access-token", value: token },
            { name: "sb-refresh-token", value: "" },
          ] as any,
        setAll: () => {},
      },
    }
  );

  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data.user) return null;
  return data.user;
}

export async function authenticate(req: NextRequest) {
  // 쿠키에서 토큰 가져오기
  const token = req.cookies.get("sb-access-token")?.value;
  if (!token) {
    throw new Error("No token");
  }

  const {
    data: { user },
    error,
  } = await supabaseServer.auth.getUser(token);
  if (error || !user) {
    throw new Error("Invalid token");
  }

  return user; // user.id, user.email 등
}
