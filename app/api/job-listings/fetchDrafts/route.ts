import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../../../../lib/authOptions"
import { getAdminSupabase } from "@/lib/supabase"

export async function GET() {
  const session = await getServerSession(authOptions)
  let employerId: string | undefined

  if (session?.user && typeof session.user === "object") {
    if ("employerId" in session.user && typeof (session.user as Record<string, unknown>).employerId === "string") {
      employerId = (session.user as Record<string, unknown>).employerId as string
    } else if ("id" in session.user && typeof (session.user as Record<string, unknown>).id === "string") {
      employerId = (session.user as Record<string, unknown>).id as string
    }
  }

  if (!employerId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const supabase = getAdminSupabase()
    const { data, error } = await supabase
      .from("job_drafts")
      .select("*")
      .eq("employer_id", employerId)
      .order("updated_at", { ascending: false })

    if (error) {
      console.error("Supabase error in fetchDrafts:", error)
      return NextResponse.json({ error: error.message, context: "supabase error", employerId }, { status: 500 })
    }

    if (!Array.isArray(data)) {
      console.error("Data is not an array in fetchDrafts:", data)
      return NextResponse.json({ error: "Data is not an array", data }, { status: 500 })
    }

    return NextResponse.json({ data })
  } catch (err) {
    console.error("Exception in fetchDrafts:", err)
    return NextResponse.json({ error: (err as Error).message || "Unknown error" }, { status: 500 })
  }
}
