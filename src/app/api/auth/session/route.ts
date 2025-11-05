import { supabaseServer } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const token = req.cookies.get("sb-access-token")?.value;

  if (!token) return NextResponse.json(null);

  const { data, error } = await supabaseServer.auth.getUser(token);

  if (error || !data.user) return NextResponse.json(null);

  return NextResponse.json({
    id: data.user.id,
    email: data.user.email,
    name: data.user.user_metadata?.name || null,
  });
}
