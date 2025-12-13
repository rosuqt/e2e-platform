import { NextResponse } from "next/server";
import supabase from "@/lib/supabase";
export async function POST(req: Request) {
  const body = await req.json();

  const { id, ...fields } = body;

  const { error } = await supabase
    .from("registered_students")
    .update(fields)
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ success: true });
}