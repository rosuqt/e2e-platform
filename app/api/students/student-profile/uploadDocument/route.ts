import { NextRequest, NextResponse } from "next/server"
import supabase, { getAdminSupabase } from "@/lib/supabase"


function sanitizeName(name: string) {
  return name.replace(/[^a-zA-Z0-9]/g, "").toUpperCase()
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get("file") as File
    const type = formData.get("type") as string
    const student_id = formData.get("student_id") as string
    const first_name = formData.get("first_name") as string
    const last_name = formData.get("last_name") as string
    const application_upload = formData.get("application_upload") === "true"

    if (!file || !(file instanceof File) || !student_id || !first_name || !last_name) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    const ext = file.name.split(".").pop()
    const safeFirst = sanitizeName(first_name)
    const safeLast = sanitizeName(last_name)
    const suffix = type === "resume" ? "RESUME" : "COVER_LETTER"
    const subfolder = type === "resume" ? "resume" : "coverletter"

    let bucket = "student.documents"
    let path = ""
    let filename = ""

    if (application_upload) {
      bucket = "student.documents"
      filename = `${safeFirst}${safeLast}_${suffix}.${ext?.toUpperCase()}`
      path = `${student_id}/temporary.files/${filename}`
    } else {
      const { data: listData, error: listError } = await supabase
        .storage
        .from("student.documents")
        .list(`${student_id}/${subfolder}`, { limit: 1000 })

      if (listError && !(typeof listError.message === "string" && listError.message.includes("Resource not found"))) {
        return NextResponse.json({ error: listError.message }, { status: 500 })
      }
      const basePattern = new RegExp(`^${safeFirst}${safeLast}_${suffix}(?:_(\\d+))?\\.(pdf|docx?|txt)$`, "i")
      const filesOfType = (listData || []).filter(
        (f: { name: string }) => basePattern.test(f.name)
      )

      let idx = 1
      const usedIndexes = new Set<number>()
      filesOfType.forEach((f: { name: string }) => {
        const match = f.name.match(new RegExp(`^${safeFirst}${safeLast}_${suffix}(?:_(\\d+))?\\.[^.]+$`, "i"))
        if (match) {
          if (match[1]) {
            usedIndexes.add(Number(match[1]))
          } else {
            usedIndexes.add(1)
          }
        }
      })
      while (usedIndexes.has(idx) && idx <= 100) {
        idx++
      }
      filename = idx === 1
        ? `${safeFirst}${safeLast}_${suffix}.${ext?.toUpperCase()}`
        : `${safeFirst}${safeLast}_${suffix}_${idx}.${ext?.toUpperCase()}`
      if (filesOfType.length >= 3) {
        return NextResponse.json({ error: `Maximum of 3 ${suffix.replace("_", " ").toLowerCase()}s allowed.` }, { status: 400 })
      }
      path = `${student_id}/${subfolder}/${filename}`
    }


    const adminSupabase = getAdminSupabase();
    const uploadOptions = {
      contentType: file.type,
      upsert: application_upload ? true : false, 
    };
    const { error: uploadError } = await adminSupabase.storage
      .from(bucket)
      .upload(path, buffer, uploadOptions)

    if (uploadError) {
      console.error("Supabase upload error:", uploadError)
      return NextResponse.json({ error: uploadError.message }, { status: 500 })
    }

    const { data, error: urlError } = await adminSupabase.storage
      .from(bucket)
      .createSignedUrl(path, 60 * 60)

    if (urlError || !data?.signedUrl) {
      console.error("Supabase signed URL error:", urlError)
      return NextResponse.json({ error: urlError?.message || "Failed to get signed URL" }, { status: 500 })
    }
    return NextResponse.json({ url: data.signedUrl, path })
  } catch (err: unknown) {
    console.error("Unexpected error in uploadDocument route:", err)
    let message = "Internal server error"
    if (
      typeof err === "object" &&
      err !== null &&
      "message" in err &&
      typeof (err as Record<string, unknown>).message === "string"
    ) {
      message = (err as { message: string }).message
    } else if (typeof err === "string") {
      message = err
    }
    return NextResponse.json({ error: "Internal server error", details: message }, { status: 500 })
  }
}
