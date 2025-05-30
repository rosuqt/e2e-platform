import { NextRequest, NextResponse } from "next/server"
import supabase from "@/lib/supabase"


function sanitizeName(name: string) {
  return name.replace(/[^a-zA-Z0-9]/g, "").toUpperCase()
}

export async function POST(req: NextRequest) {
  const formData = await req.formData()
  const file = formData.get("file") as File
  const type = formData.get("type") as string
  const student_id = formData.get("student_id") as string
  const first_name = formData.get("first_name") as string
  const last_name = formData.get("last_name") as string

  if (!file || !(file instanceof File) || !student_id || !first_name || !last_name) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
  }

  const arrayBuffer = await file.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)
  const ext = file.name.split(".").pop()
  const safeFirst = sanitizeName(first_name)
  const safeLast = sanitizeName(last_name)
  const suffix = type === "resume" ? "RESUME" : "COVER_LETTER"

  // Set subfolder based on type
  const subfolder = type === "resume" ? "resume" : "coverletter"

  // List existing files for this student and type
  const { data: listData, error: listError } = await supabase
    .storage
    .from("student.documents")
    .list(`${student_id}/${subfolder}`, { limit: 1000 })

  // Fix: check error.message for "Resource not found" instead of error.code
  if (listError && !(typeof listError.message === "string" && listError.message.includes("Resource not found"))) {
    return NextResponse.json({ error: listError.message }, { status: 500 })
  }

  // Filter files by type and count (ignore extension)
  const basePattern = new RegExp(`^${safeFirst}${safeLast}_${suffix}(?:_(\\d+))?\\.(pdf|docx?|txt)$`, "i")
  const filesOfType = (listData || []).filter(
    (f: { name: string }) => basePattern.test(f.name)
  )

  // Find next available index (fix: check for _1, _2, etc. across ALL extensions)
  let idx = 1
  const usedIndexes = new Set<number>()
  filesOfType.forEach((f: { name: string }) => {
    // Match any extension, not just current
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
  const filename = idx === 1
    ? `${safeFirst}${safeLast}_${suffix}.${ext?.toUpperCase()}`
    : `${safeFirst}${safeLast}_${suffix}_${idx}.${ext?.toUpperCase()}`

  if (filesOfType.length >= 3) {
    return NextResponse.json({ error: `Maximum of 3 ${suffix.replace("_", " ").toLowerCase()}s allowed.` }, { status: 400 })
  }

  const path = `${student_id}/${subfolder}/${filename}`

  const { error: uploadError } = await supabase.storage
    .from("student.documents")
    .upload(path, buffer, {
      contentType: file.type,
      upsert: false,
    })

  if (uploadError) {
    return NextResponse.json({ error: uploadError.message }, { status: 500 })
  }

  // Do not update uploaded_resume_url/cover_letter_url, just return the path and signed url
  const { data, error: urlError } = await supabase.storage
    .from("student.documents")
    .createSignedUrl(path, 60 * 60)

  if (urlError || !data?.signedUrl) {
    return NextResponse.json({ error: urlError?.message || "Failed to get signed URL" }, { status: 500 })
  }
  return NextResponse.json({ url: data.signedUrl, path })
}
