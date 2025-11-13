import { NextRequest, NextResponse } from "next/server";
import supabase from "@/lib/supabase";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const path = searchParams.get("path");
  if (!path) return new NextResponse("Missing path", { status: 400 });

  const cleanPath = path.startsWith("/") ? path.slice(1) : path;

  const { data, error } = await supabase.storage
    .from("student.documents")
    .download(cleanPath);

  if (error || !data) return new NextResponse("Not found", { status: 404 });

  const arrayBuffer = await data.arrayBuffer();

  const ext = cleanPath.split('.').pop()?.toLowerCase();
  let resolvedContentType = "application/octet-stream";
  if (ext === "png") resolvedContentType = "image/png";
  else if (ext === "jpg" || ext === "jpeg") resolvedContentType = "image/jpeg";
  else if (ext === "gif") resolvedContentType = "image/gif";
  else if (ext === "webp") resolvedContentType = "image/webp";
  else if (ext === "bmp") resolvedContentType = "image/bmp";

  return new NextResponse(arrayBuffer, {
    status: 200,
    headers: {
      "Content-Type": resolvedContentType,
      "Content-Disposition": "inline"
    }
  });
}
