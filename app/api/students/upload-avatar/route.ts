import { NextRequest, NextResponse } from "next/server";
import { getAdminSupabase } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const bucket = formData.get("bucket") as string;
    const student_id = formData.get("student_id") as string;
    if (!file || !bucket || !student_id) {
      return NextResponse.json({ error: "Missing file, bucket, or student_id" }, { status: 400 });
    }
    const ext = file.name.split(".").pop();
    if (!ext) {
      return NextResponse.json({ error: "File extension missing" }, { status: 400 });
    }
    const fileName = `${student_id}_${Date.now()}.${ext}`;
    const storagePath = `${student_id}/${fileName}`;

    const adminSupabase = getAdminSupabase();

    const { error: uploadError } = await adminSupabase.storage
      .from(bucket)
      .upload(storagePath, file, { upsert: true });

    if (uploadError) {
      console.error("Supabase upload error:", uploadError);
      return NextResponse.json({
        error: uploadError.message,
        details: uploadError,
        hint: "Check your Supabase Storage bucket RLS policy. Service role key bypasses RLS. If this fails, check bucket existence and permissions."
      }, { status: 500 });
    }

    const { data, error: signedUrlError } = await adminSupabase.storage
      .from(bucket)
      .createSignedUrl(storagePath, 60 * 60);

    if (signedUrlError || !data?.signedUrl) {
      return NextResponse.json({ error: "Failed to get signed URL" }, { status: 500 });
    }
    return NextResponse.json({ publicUrl: data.signedUrl });
  } catch (err) {
    console.error("Unexpected error in upload-avatar:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
