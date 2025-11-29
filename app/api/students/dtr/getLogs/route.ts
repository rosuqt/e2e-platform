/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { getServerSession } from "next-auth/next"
import { authOptions } from "../../../../../lib/authOptions"
import { getAdminSupabase } from "@/lib/supabase"

export async function GET(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session) return new Response("Unauthorized", { status: 401 })

  const { searchParams } = new URL(req.url)
  const jobId = searchParams.get("jobId")
  if (!jobId) return new Response(JSON.stringify({ error: "Missing jobId" }), { status: 400 })

  const supabase = getAdminSupabase()
  const { data, error } = await supabase
    .from("dtr_logs")
    .select("*")
    .eq("job_id", jobId)
    .order("date", { ascending: false })

  if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500 })

  const logs = await Promise.all(
    (data ?? []).map(async (log: any) => {
      let imageProofUrl = null
      if (log.image_proof) {
        const { data: signed, error: signedError } = await supabase.storage
          .from("application.records")
          .createSignedUrl(log.image_proof, 60 * 10)
        if (signed && signed.signedUrl) imageProofUrl = signed.signedUrl
      }
      return {
        ...log,
        imageProofUrl,
      }
    })
  )

  return new Response(JSON.stringify({ logs }), { status: 200 })
}
