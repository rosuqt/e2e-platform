import { NextRequest, NextResponse } from "next/server";
import supabase from "@/lib/supabase";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("file") as File;
  const bucket = formData.get("bucket") as string;
  const student_id = formData.get("student_id") as string;
  if (!file || !bucket || !student_id) {
    return NextResponse.json({ error: "Missing file, bucket, or student_id" }, { status: 400 });
  }
  const ext = file.name.split(".").pop();
  const fileName = `${student_id}_${Date.now()}.${ext}`;
  const storagePath = `${student_id}/${fileName}`;
  const arrayBuffer = await file.arrayBuffer();
  const uint8Array = new Uint8Array(arrayBuffer);

  const { error: uploadError } = await supabase.storage
    .from(bucket)
    .upload(storagePath, uint8Array, { upsert: true });

  if (uploadError) {
    return NextResponse.json({ error: uploadError.message }, { status: 500 });
  }

  return NextResponse.json({ publicUrl: storagePath });
}
