import { NextRequest, NextResponse } from "next/server";
import { getAdminSupabase } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  const { bucket, path } = await req.json();
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
