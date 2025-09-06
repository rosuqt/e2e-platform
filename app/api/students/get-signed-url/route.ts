import { NextRequest, NextResponse } from "next/server";
import supabase from "@/lib/supabase";

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

    console.log("get-signed-url bucket:", bucket, "filePath:", filePath);

    const { data, error } = await supabase.storage
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
