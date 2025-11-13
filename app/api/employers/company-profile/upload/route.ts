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
  const company_id = formData.get("company_id") as string
  const type = formData.get("type") as string | undefined

  if (!file || !company_id) {
    return NextResponse.json({ error: "Missing file or company_id" }, { status: 400 })
  }

  const supabase = getAdminSupabase()
  if (type === "hq_img") {
    const bucket = "company.images"
    const storagePath = `${company_id}/hq_img.${file.name.split(".").pop() || "png"}`

    await new Promise(res => setTimeout(res, 300))
    const arrayBuffer = await file.arrayBuffer()
    try {
      const buffer = typeof Buffer !== "undefined" ? Buffer.from(arrayBuffer) : new Uint8Array(arrayBuffer)
      const uploadResult = await supabase.storage
        .from(bucket)
        .upload(storagePath, buffer, { upsert: true, contentType: file.type })
      if (uploadResult.error) {
        return NextResponse.json({ error: uploadResult.error.message }, { status: 500 })
      }
    } catch {
      return NextResponse.json({ error: "File upload failed" }, { status: 500 })
    }

    try {
      const { error: dbError } = await supabase
        .from("company_profile")
        .update({ hq_img: storagePath })
        .eq("company_id", company_id)
      if (dbError) {
        return NextResponse.json({ error: dbError.message }, { status: 500 })
      }
    } catch {
      return NextResponse.json({ error: "DB update failed" }, { status: 500 })
    }

    return NextResponse.json({ filePath: storagePath })
  }

  if (type === "cover_img") {
    const bucket = "company.images"
    const storagePath = `${company_id}/cover_img.${file.name.split(".").pop() || "png"}`

    await new Promise(res => setTimeout(res, 300))
    const arrayBuffer = await file.arrayBuffer()
    try {
      const buffer = typeof Buffer !== "undefined" ? Buffer.from(arrayBuffer) : new Uint8Array(arrayBuffer)
      const uploadResult = await supabase.storage
        .from(bucket)
        .upload(storagePath, buffer, { upsert: true, contentType: file.type })
      if (uploadResult.error) {
        return NextResponse.json({ error: uploadResult.error.message }, { status: 500 })
      }
    } catch {
      return NextResponse.json({ error: "File upload failed" }, { status: 500 })
    }

    try {
      const { error: dbError } = await supabase
        .from("company_profile")
        .update({ cover_img: storagePath })
        .eq("company_id", company_id)
      if (dbError) {
        return NextResponse.json({ error: dbError.message }, { status: 500 })
      }
    } catch {
      return NextResponse.json({ error: "DB update failed" }, { status: 500 })
    }

    return NextResponse.json({ filePath: storagePath })
  }

  if (type === "founder_img") {
    const founderIdx = formData.get("founder_idx") as string | undefined
    const founderKey = formData.get("founder_key") as string | undefined
    const bucket = "company.images"
    const key = founderKey || (founderIdx === "0" ? "founder" : `founder_${Number(founderIdx) + 1}`)
    const storagePath = `${company_id}/${key}.${file.name.split(".").pop() || "png"}`

    await new Promise(res => setTimeout(res, 300))
    const arrayBuffer = await file.arrayBuffer()
    try {
      const buffer = typeof Buffer !== "undefined" ? Buffer.from(arrayBuffer) : new Uint8Array(arrayBuffer)
      const uploadResult = await supabase.storage
        .from(bucket)
        .upload(storagePath, buffer, { upsert: true, contentType: file.type })
      if (uploadResult.error) {
        return NextResponse.json({ error: uploadResult.error.message }, { status: 500 })
      }
    } catch {
      return NextResponse.json({ error: "File upload failed" }, { status: 500 })
    }

    let founders = []
    try {
      const { data: profile } = await supabase
        .from("company_profile")
        .select("founders")
        .eq("company_id", company_id)
        .single()
      founders = Array.isArray(profile?.founders) ? profile.founders : []
    } catch {}

    const idx = Number(founderIdx)
    while (founders.length <= idx) founders.push({ name: "", title: "", bio: "", img: null })
    founders[idx] = { ...(founders[idx] || {}), img: storagePath }

    try {
      const { error: dbError } = await supabase
        .from("company_profile")
        .update({ founders })
        .eq("company_id", company_id)
      if (dbError) {
        return NextResponse.json({ error: dbError.message }, { status: 500 })
      }
    } catch {
      return NextResponse.json({ error: "DB update failed" }, { status: 500 })
    }

    return NextResponse.json({ filePath: storagePath })
  }

  const bucket = "company.logo"
  const fileLabel = "logo"
  const storagePath = `${company_id}/${fileLabel}.${file.name.split(".").pop() || "png"}`

  const { data: existingFiles } = await supabase.storage
    .from(bucket)
    .list(company_id, { limit: 100 })
  if (existingFiles && existingFiles.length > 0) {
    const toDelete = existingFiles.map(f => `${company_id}/${f.name}`)
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
      return NextResponse.json({ error: uploadResult.error.message }, { status: 500 })
    }
  } catch {
    return NextResponse.json({ error: "File upload failed" }, { status: 500 })
  }

  let publicUrl: string
  const filePath = storagePath
  try {
    const publicUrlResult = supabase.storage.from(bucket).getPublicUrl(storagePath)
    publicUrl = publicUrlResult.data?.publicUrl || storagePath
  } catch {
    publicUrl = storagePath
  }

  try {
    const { error: dbError } = await supabase
      .from("registered_companies")
      .update({ company_logo_image_path: filePath })
      .eq("id", company_id)
    if (dbError) {
      return NextResponse.json({ error: dbError.message }, { status: 500 })
    }
  } catch {
    return NextResponse.json({ error: "DB update failed" }, { status: 500 })
  }

  return NextResponse.json({ publicUrl, filePath })
}
