import { NextRequest, NextResponse } from "next/server"
import { getAdminSupabase } from "@/lib/supabase"

export async function POST(req: NextRequest) {
  const { action, requestId } = await req.json()
  const supabase = getAdminSupabase()

  if (action === "accept") {
    const { error } = await supabase
      .from("friend_requests")
      .update({ status: "Friends" })
      .eq("id", requestId)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ success: true })
  }

  if (action === "ignore") {
    const { error } = await supabase
      .from("friend_requests")
      .delete()
      .eq("id", requestId)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ success: true })
  }

  if (action === "favorite") {
    const { error } = await supabase
      .from("friend_requests")
      .update({ favorite: true })
      .eq("id", requestId)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ success: true })
  }

  if (action === "unfavorite") {
    const { error } = await supabase
      .from("friend_requests")
      .update({ favorite: false })
      .eq("id", requestId)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ success: true })
  }

  if (action === "unfriend") {
    const { error } = await supabase
      .from("friend_requests")
      .delete()
      .eq("id", requestId)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ success: true })
  }

  return NextResponse.json({ error: "Invalid action" }, { status: 400 })
}
