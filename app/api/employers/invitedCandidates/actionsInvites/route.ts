import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../../../../../lib/authOptions"
import supabase from "@/lib/supabase"

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.employerId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { action, invitationId, data } = await req.json()

  if (!invitationId) {
    return NextResponse.json({ error: "Missing invitationId" }, { status: 400 })
  }

  if (action === "favorite") {
    const { error } = await supabase
      .from("job_invitations")
      .update({ is_favorite: true })
      .eq("id", invitationId)
      .eq("employer_id", session.user.employerId)
    if (error) {
      console.error("Favorite error:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    return NextResponse.json({ success: true })
  }

  if (action === "edit") {
    const upsertData = { ...data, id: invitationId, employer_id: session.user.employerId }
    if (upsertData.student_id === "" || upsertData.student_id === undefined) {
      delete upsertData.student_id
    }
    const { error } = await supabase
      .from("job_invitations")
      .upsert([upsertData])
    if (error) {
      console.error("Edit error:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    return NextResponse.json({ success: true })
  }

  if (action === "remove") {
    const { error } = await supabase
      .from("job_invitations")
      .delete()
      .eq("id", invitationId)
      .eq("employer_id", session.user.employerId)
    if (error) {
      console.error("Remove error:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    return NextResponse.json({ success: true })
  }

  return NextResponse.json({ error: "Invalid action" }, { status: 400 })
}
