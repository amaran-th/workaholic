import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const accessToken = url.searchParams.get("access_token");

  if (!accessToken)
    return NextResponse.json({ error: "Invalid link" }, { status: 400 });

  const { data, error } = await supabaseAdmin.auth.getUser(accessToken);
  if (error || !data.user)
    return NextResponse.json(
      { error: error?.message || "Invalid token" },
      { status: 400 }
    );

  // 필요시 Prisma Member 동기화 가능
  // await prisma.member.update({ ... });

  return NextResponse.redirect("/login");
}
