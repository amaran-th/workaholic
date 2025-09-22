import { supabase } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { error } = await supabase.auth.signOut();
  if (error)
    return NextResponse.json({ error: error.message }, { status: 400 });

  return NextResponse.json({ message: "로그아웃 완료" });
}
