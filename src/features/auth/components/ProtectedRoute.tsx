// app/(protected)/layout.tsx
import { getServerSession } from "@/lib/supabase/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

interface ProtectedServerProps {
  children: ReactNode;
  excludePaths?: string[]; // 인증 체크 제외할 경로
}

export default async function AuthProvider({
  children,
  excludePaths = ["/login", "/register"],
}: ProtectedServerProps) {
  // 요청 경로 가져오기
  const pathname = (await headers()).get("x-invoke-pathname") || "";
  // headers()에는 url 관련 정보가 없으므로, app router 서버 컴포넌트에서는 layout에서 pathname을 props로 넘기는 경우가 있음.

  // 제외 경로면 바로 렌더링
  if (excludePaths.includes(pathname)) {
    return <>{children}</>;
  }

  const session = await getServerSession();

  if (!session) {
    redirect("/login");
  }

  return <>{children}</>;
}
