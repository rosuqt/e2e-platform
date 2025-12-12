import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "../../../../../lib/authOptions"
import { getAdminSupabase } from "@/lib/supabase"

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  const user = session?.user as { employerId?: string } | undefined
  if (!user?.employerId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const contentType = req.headers.get("content-type") || ""
  if (!contentType.includes("multipart/form-data")) {
    return NextResponse.json({ error: "Invalid content type" }, { status: 400 })
  }

  const formData = await req.formData()
  const file = formData.get("file") as File
  const fileType = formData.get("fileType") as string
  const employer_id = formData.get("employer_id") as string

  if (!file || !fileType || !employer_id) {
    return NextResponse.json({ error: "Missing file, fileType, or employer_id" }, { status: 400 })
  }

  const supabase = getAdminSupabase()
  let bucket = ""
  let dbField = ""
  let fileLabel = ""
 
  if (fileType === "avatar" || fileType === "profile_img") {
    bucket = "user.avatars"
    dbField = "profile_img"
    fileLabel = "avatar"
  } else if (fileType === "cover" || fileType === "cover_image") {
    bucket = "user.covers"
    dbField = "cover_image"
    fileLabel = "cover"
  } else {
    return NextResponse.json({ error: "Invalid fileType" }, { status: 400 })
  }

  const ext = file.name.split(".").pop() || "png"
  const storagePath = `${employer_id}/${fileLabel}.${ext}`

  const { data: existingFiles } = await supabase.storage
    .from(bucket)
    .list(employer_id, { limit: 100 })
  if (existingFiles && existingFiles.length > 0) {
    const toDelete = existingFiles.map(f => `${employer_id}/${f.name}`)
    if (toDelete.length > 0) {
      await supabase.storage.from(bucket).remove(toDelete)
    }
  }

  await new Promise(res => setTimeout(res, 300))
  const arrayBuffer = await file.arrayBuffer()
  try {

    const buffer = typeof Buffer !== "undefined" ? Buffer.from(arrayBuffer) : new Uint8Array(arrayBuffer)
    const uploadResult = await supabase.storage
      .from(bucket)
      .upload(storagePath, buffer, { upsert: true, contentType: file.type })
    if (uploadResult.error) {
      console.error("Supabase upload error:", uploadResult.error)
      return NextResponse.json({ error: uploadResult.error.message }, { status: 500 })
    }
  } catch (err) {
    console.error("File upload failed:", err)
    return NextResponse.json({ error: "File upload failed", details: (err as Error).message || err }, { status: 500 })
  }

  let publicUrl: string
  const filePath = storagePath
  try {
    const publicUrlResult = supabase.storage.from(bucket).getPublicUrl(storagePath)
    publicUrl = publicUrlResult.data?.publicUrl || storagePath
  } catch (err) {
    console.error("Get public URL failed:", err)
    publicUrl = storagePath
  }

  try {
    // Ensure employer_profile row exists before updating
    const { data: profileExists, error: selectError } = await supabase
      .from("employer_profile")
      .select("employer_id")
      .eq("employer_id", employer_id)
      .single();

    if (selectError && selectError.code !== "PGRST116") { // PGRST116: No rows found
      console.error("Supabase DB select error:", selectError);
      return NextResponse.json({ error: selectError.message }, { status: 500 });
    }

    if (!profileExists) {
      // Insert a new row if not exists
      const { error: insertError } = await supabase
        .from("employer_profile")
        .insert([{ employer_id, [dbField]: filePath }]);
      if (insertError) {
        console.error("Supabase DB insert error:", insertError);
        return NextResponse.json({ error: insertError.message }, { status: 500 });
      }
    } else {
      // Update existing row
      const { error: dbError } = await supabase
        .from("employer_profile")
        .update({ [dbField]: filePath })
        .eq("employer_id", employer_id);
      if (dbError) {
        console.error("Supabase DB update error:", dbError);
        return NextResponse.json({ error: dbError.message }, { status: 500 });
      }
    }
  } catch (err) {
    console.error("DB upsert failed:", err)
    return NextResponse.json({ error: "DB upsert failed", details: (err as Error).message || err }, { status: 500 })
  }

  return NextResponse.json({ publicUrl, filePath })
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const employer_id = searchParams.get("employer_id")
  const fileType = searchParams.get("fileType")
  if (!employer_id || !fileType) {
    return NextResponse.json({ error: "Missing employer_id or fileType" }, { status: 400 })
  }

  let bucket = ""
  let fileLabel = ""
  if (fileType === "avatar") {
    bucket = "employer.avatars"
    fileLabel = "avatar"
  } else if (fileType === "cover") {
    bucket = "employer.covers"
    fileLabel = "cover"
  } else {
    return NextResponse.json({ error: "Invalid fileType" }, { status: 400 })
  }

  const supabase = getAdminSupabase()
  const exts = ["png", "jpg", "jpeg", "webp"]
  let signedUrl: string | null = null
  for (const ext of exts) {
    const storagePath = `${employer_id}/${fileLabel}.${ext}`
    const { data } = await supabase.storage
      .from(bucket)
      .createSignedUrl(storagePath, 60 * 10)
    if (data?.signedUrl) {
      signedUrl = data.signedUrl
      break
    }
  }
  if (!signedUrl) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }
  return NextResponse.json({ url: signedUrl })
}
