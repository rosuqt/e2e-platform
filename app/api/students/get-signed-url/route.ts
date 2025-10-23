import { NextRequest, NextResponse } from "next/server";
import { getAdminSupabase } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const { bucket, path } = await req.json();
    if (!bucket || !path) {
      console.error("Missing bucket or path", { bucket, path });
      console.log("RETURN: 400 Missing bucket or path");
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
        console.error("Invalid file path", { filePath });
        console.log("RETURN: 400 Invalid file path");
        return NextResponse.json({ error: "Invalid file path" }, { status: 400 });
      }
    }

    if (filePath === "default.png" || filePath === "/default.png") {
      filePath = "default.png";
      const adminSupabase = getAdminSupabase();
      const { data, error } = await adminSupabase.storage
        .from(bucket)
        .createSignedUrl(filePath, 60 * 60);
      if (error || !data?.signedUrl) {
        console.error("Could not generate signed URL for default.png", { error });
        console.log("RETURN: 500 Could not generate signed URL for default.png");
        return NextResponse.json({ error: "Could not generate signed URL" }, { status: 500 });
      }
      console.log("RETURN: 200 Signed URL for default.png", data.signedUrl);
      return NextResponse.json({ signedUrl: data.signedUrl });
    }

    const lastSlash = filePath.lastIndexOf("/");
    const directory = lastSlash !== -1 ? filePath.slice(0, lastSlash) : "";

    const adminSupabase = getAdminSupabase();
    const { data: listData, error: listError } = await adminSupabase
      .storage
      .from(bucket)
      .list(directory, { limit: 100 });

    //console.log("Requested filePath:", filePath, "bucket:", bucket, "directory:", directory, "listData:", listData);

    const fileName = lastSlash !== -1 ? filePath.slice(lastSlash + 1) : filePath;
    const fileExists = listData?.some(f => f.name === fileName);

    if (listError || !fileExists) {

      if (fileName.includes('RESUME') || fileName.toLowerCase().includes('resume')) {
        const resumeFilePath = directory ? `${directory}/resume/${fileName}` : `resume/${fileName}`;
        const resumeDirectory = directory ? `${directory}/resume` : 'resume';
        
        const { data: resumeListData, error: resumeListError } = await adminSupabase
          .storage
          .from(bucket)
          .list(resumeDirectory, { limit: 100 });
        
        const resumeFileExists = resumeListData?.some(f => f.name === fileName);
        
        if (!resumeListError && resumeFileExists) {
          filePath = resumeFilePath;
        } else if (!resumeListError && resumeListData?.some(f => f.name === 'resume')) {
          filePath = directory ? `${directory}/resume/resume` : 'resume/resume';
        } else {
          const tempFilePath = directory ? `${directory}/temporary.files/${fileName}` : `temporary.files/${fileName}`;
          const tempDirectory = directory ? `${directory}/temporary.files` : 'temporary.files';
          
          const { data: tempListData, error: tempListError } = await adminSupabase
            .storage
            .from(bucket)
            .list(tempDirectory, { limit: 100 });
          
          const tempFileExists = tempListData?.some(f => f.name === fileName);
          
          if (!tempListError && tempFileExists) {
            filePath = tempFilePath;
          } else {
            console.error("File not found or list error", { filePath, bucket, directory, listError, listData });
            console.log("RETURN: 404 File not found or list error");
            return NextResponse.json({
              error: `File not found: ${filePath}. Files in bucket directory "${directory}": ${listData?.map(f => f.name).join(", ")}`,
              debug: { filePath, bucket, directory }
            }, { status: 404 });
          }
        }
      } else if (fileName.includes('COVER') || fileName.toLowerCase().includes('cover')) {
        const coverFilePath = directory ? `${directory}/coverletter/${fileName}` : `coverletter/${fileName}`;
        const coverDirectory = directory ? `${directory}/coverletter` : 'coverletter';
        
        const { data: coverListData, error: coverListError } = await adminSupabase
          .storage
          .from(bucket)
          .list(coverDirectory, { limit: 100 });
        
        const coverFileExists = coverListData?.some(f => f.name === fileName);
        
        if (!coverListError && coverFileExists) {
          filePath = coverFilePath;
        } else {
          const tempFilePath = directory ? `${directory}/temporary.files/${fileName}` : `temporary.files/${fileName}`;
          const tempDirectory = directory ? `${directory}/temporary.files` : 'temporary.files';
          
          const { data: tempListData, error: tempListError } = await adminSupabase
            .storage
            .from(bucket)
            .list(tempDirectory, { limit: 100 });
          
          const tempFileExists = tempListData?.some(f => f.name === fileName);
          
          if (!tempListError && tempFileExists) {
            filePath = tempFilePath;
          } else {
            console.error("File not found or list error", { filePath, bucket, directory, listError, listData });
            console.log("RETURN: 404 File not found or list error");
            return NextResponse.json({
              error: `File not found: ${filePath}. Files in bucket directory "${directory}": ${listData?.map(f => f.name).join(", ")}`,
              debug: { filePath, bucket, directory }
            }, { status: 404 });
          }
        }
      } else {
        console.error("File not found or list error", { filePath, bucket, directory, listError, listData });
        console.log("RETURN: 404 File not found or list error");
        return NextResponse.json({
          error: `File not found: ${filePath}. Files in bucket directory "${directory}": ${listData?.map(f => f.name).join(", ")}`,
          debug: { filePath, bucket, directory }
        }, { status: 404 });
      }
    }

    const { data, error } = await adminSupabase.storage
      .from(bucket)
      .createSignedUrl(filePath, 60 * 60);

    if (error || !data?.signedUrl) {
      console.error("Could not generate signed URL", { error, filePath, bucket });
      console.log("RETURN: 500 Could not generate signed URL");
      return NextResponse.json({ error: "Could not generate signed URL" }, { status: 500 });
    }

    
    console.log("RETURN: 200 Signed URL", data.signedUrl);
    return NextResponse.json({ signedUrl: data.signedUrl });
  } catch (err) {
    console.error("get-signed-url unexpected error:", err);
    console.log("RETURN: 500 Internal server error");
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
