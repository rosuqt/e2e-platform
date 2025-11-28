import { NextRequest } from "next/server"
import { createClient } from "@supabase/supabase-js"

export async function POST(req: NextRequest) {
  const { employer_id } = await req.json()
  if (!employer_id) {
    return new Response(JSON.stringify({ error: "Missing employer_id" }), { status: 400 })
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { data, error } = await supabase.storage.from("employer.documents").list(employer_id, { limit: 1 })

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 })
  }

  const exists = Array.isArray(data) && data.length > 0
  return new Response(JSON.stringify({ exists }), { status: 200 })
}
