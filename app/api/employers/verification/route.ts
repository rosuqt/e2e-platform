import { NextRequest } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../../../../lib/authOptions"

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  const employer_id = session?.user?.employerId

  const formData = await req.formData()
  const file = formData.get("file") as File | null
  const bucket = formData.get("bucket") as string
  const path = formData.get("path") as string
  const file_type = formData.get("file_type") as string

  if (!file || !bucket || !path || !employer_id || !file_type) {
    return new Response(JSON.stringify({ error: "Missing required fields" }), { status: 400 })
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const arrayBuffer = await file.arrayBuffer()
  const buffer = new Uint8Array(arrayBuffer)

  const { error: uploadError } = await supabase.storage.from(bucket).upload(path, buffer, {
    upsert: true,
    contentType: file.type || "application/octet-stream"
  })

  if (uploadError) {
    return new Response(JSON.stringify({ error: uploadError.message }), { status: 500 })
  }

  const { data: employer, error: employerError } = await supabase
    .from("registered_employers")
    .select("first_name, last_name, company_id")
    .eq("id", employer_id)
    .single()

  if (employerError || !employer) {
    return new Response(JSON.stringify({ error: "Employer not found" }), { status: 404 })
  }

  const { data: company, error: companyError } = await supabase
    .from("registered_companies")
    .select("company_name")
    .eq("id", employer.company_id)
    .single()

  if (companyError || !company) {
    return new Response(JSON.stringify({ error: "Company not found" }), { status: 404 })
  }

  const { error: insertError, data: insertData } = await supabase
    .from("employer_verifications")
    .insert([{
      employer_id: employer_id,
      file_path: path,
      file_type: file_type,
      first_name: employer.first_name,
      last_name: employer.last_name,
      company_name: company.company_name,
      status: "submitted",
      submitted_at: new Date().toISOString()
    }])
    .select("id, employer_id, file_path, first_name, last_name, company_name, submitted_at, status, file_type")
    .single()

  if (insertError) {
    return new Response(JSON.stringify({ error: insertError.message }), { status: 500 })
  }

  return new Response(JSON.stringify({
    success: true,
    ...insertData
  }), { status: 200 })
}
