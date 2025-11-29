import { getServerSession } from "next-auth/next"
import { authOptions } from "../../../../../lib/authOptions"
import { getAdminSupabase } from "@/lib/supabase"

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session) return new Response("Unauthorized", { status: 401 })
  const body = await req.json()
  const { jobId, date, description, hours, imageProof, absent, reason } = body

  if (!jobId || !date) {
    return new Response(JSON.stringify({ error: "Missing required fields" }), { status: 400 })
  }

  const supabase = getAdminSupabase()

  if (absent) {
    const { data: jobData, error: jobError } = await supabase
      .from("dtr_jobs")
      .select("absents")
      .eq("id", jobId)
      .single()
    if (jobError) {
      console.error("DTR AddLog jobError:", jobError)
      return new Response(JSON.stringify({ error: jobError.message }), { status: 500 })
    }
    const currentAbsents = jobData?.absents ?? 0
    const { error: updateError } = await supabase
      .from("dtr_jobs")
      .update({ absents: currentAbsents + 1 })
      .eq("id", jobId)
    if (updateError) {
      console.error("DTR AddLog updateError:", updateError)
      return new Response(JSON.stringify({ error: updateError.message }), { status: 500 })
    }
    const { error } = await supabase
      .from("dtr_logs")
      .insert([{
        job_id: jobId,
        date,
        description: reason,
        hours: 0,
        image_proof: null,
      }])
    if (error) {
      console.error("DTR AddLog absent insert error:", error)
      return new Response(JSON.stringify({ error: error.message }), { status: 500 })
    }
    return new Response(JSON.stringify({ success: true }), { status: 200 })
  }

  let imagePath = null
  if (imageProof) {
    const base64Data = imageProof.replace(/^data:image\/\w+;base64,/, "")
    const buffer = Buffer.from(base64Data, "base64")
    const fileName = `${Date.now()}.jpg`
    const filePath = `dtr/${jobId}/${fileName}`
    const { error: uploadError } = await supabase.storage
      .from("application.records")
      .upload(filePath, buffer, {
        cacheControl: "3600",
        upsert: true,
        contentType: "image/jpeg",
      })
    if (!uploadError) {
      imagePath = filePath
    }
  }

  const { error } = await supabase
    .from("dtr_logs")
    .insert([{
      job_id: jobId,
      date,
      description,
      hours,
      image_proof: imagePath,
    }])

  if (error) {
    console.error("DTR AddLog log insert error:", error)
    return new Response(JSON.stringify({ error: error.message }), { status: 500 })
  }
  return new Response(JSON.stringify({ success: true }), { status: 200 })
}
