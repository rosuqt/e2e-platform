import { NextRequest, NextResponse } from "next/server";
import supabase from "@/lib/supabase";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const student_id = searchParams.get("student_id");
  if (!student_id) {
    return NextResponse.json([], { status: 400 });
  }
  const { data, error } = await supabase
    .from("student_profile")
    .select("educations")
    .eq("student_id", student_id)
    .maybeSingle();
  if (error || !data?.educations) {
    return NextResponse.json([], { status: 200 });
  }
  return NextResponse.json(data.educations, { status: 200 });
}
