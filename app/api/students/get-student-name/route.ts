import { NextRequest, NextResponse } from "next/server";
import supabase from "@/lib/supabase";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const student_id = searchParams.get("student_id");
  if (!student_id) {
    return NextResponse.json({ error: "Missing student_id" }, { status: 400 });
  }
  const { data, error } = await supabase
    .from("registered_students")
    .select("first_name, last_name, year, course,section,email")
    .eq("id", student_id)
    .single();
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(data || {});
}
