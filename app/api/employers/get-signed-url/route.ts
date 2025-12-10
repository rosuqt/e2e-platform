import { NextRequest, NextResponse } from "next/server";
import { getAdminSupabase } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  let bucket, path;
  try {
    const body = await req.json();
    bucket = body.bucket;
    path = body.path;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (e) {
    return NextResponse.json({ error: "Invalid or missing JSON body" }, { status: 400 });
  }
  if (!bucket || !path) {
    return NextResponse.json({ error: "Missing bucket or path" }, { status: 400 });
  }
  const supabase = getAdminSupabase();
  const { data, error } = await supabase.storage.from(bucket).createSignedUrl(path, 60 * 10);
  if (error || !data?.signedUrl) {
    return NextResponse.json({ error: "Could not generate signed URL" }, { status: 404 });
  }
  return NextResponse.json({ signedUrl: data.signedUrl });
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const bucket = searchParams.get("bucket");
  const path = searchParams.get("path");
  if (!bucket || !path) {
    return NextResponse.json({ error: "Missing bucket or path" }, { status: 400 });
  }
  const supabase = getAdminSupabase();
  const { data, error } = await supabase.storage.from(bucket).createSignedUrl(path, 60 * 10);
  if (error || !data?.signedUrl) {
    console.error("Employer signed URL error:", error, "for bucket:", bucket, "path:", path);
    return NextResponse.json({ error: "Could not generate signed URL" }, { status: 404 });
  }
  return NextResponse.json({ signedUrl: data.signedUrl });
}
