import { NextRequest, NextResponse } from "next/server";
import { getAdminSupabase } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const { bucket, path } = await req.json();
    if (!bucket || !path) {
      return NextResponse.json({ error: "Missing bucket or path" }, { status: 400 });
    }

    let filePath = path;
    if (filePath.startsWith("http")) {
      const match = filePath.match(/\/object\/sign\/([^?]+)/);
      if (match && match[1]) {
        filePath = match[1];
        if (filePath.startsWith(bucket + "/")) {
          filePath = filePath.slice(bucket.length + 1);
        }
      } else {
        return NextResponse.json({ error: "Invalid file path" }, { status: 400 });
      }
    }

    if (filePath === "default.png" || filePath === "/default.png") {
      filePath = "default.png";
    }

 
    const adminSupabase = getAdminSupabase();
    const { data: listData, error: listError } = await adminSupabase
      .storage
      .from(bucket)
      .list("", { limit: 100 });

    if (listData) {
      console.log("Files in bucket root:", listData.map(f => f.name));
    }

    const fileExists = listData?.some(f => f.name === filePath);

    if (listError || !fileExists) {
      console.error("get-signed-url file not found:", filePath, "in bucket:", bucket);
      return NextResponse.json({
        error: `File not found: ${filePath}. Files in bucket root: ${listData?.map(f => f.name).join(", ")}`,
        debug: { filePath, bucket }
      }, { status: 404 });
    }

    const { data, error } = await adminSupabase.storage
      .from(bucket)
      .createSignedUrl(filePath, 60 * 60);

    if (error || !data?.signedUrl) {
      console.error("get-signed-url error:", error, "bucket:", bucket, "filePath:", filePath);
      return NextResponse.json({ error: "Could not generate signed URL" }, { status: 500 });
    }

    return NextResponse.json({ signedUrl: data.signedUrl });
  } catch (err) {
    console.error("get-signed-url unexpected error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
