import { NextRequest, NextResponse } from "next/server";
import supabase from "@/lib/supabase";

export async function POST(req: NextRequest) {
  const { email } = await req.json();

  if (!email) {
    return NextResponse.json({ error: "Email is required" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("registered_employers")
    .select("id")
    .eq("email", email.toLowerCase())
    .single();

  if (error && error.code !== "PGRST116") {
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }

  return NextResponse.json({ exists: !!data });
}
