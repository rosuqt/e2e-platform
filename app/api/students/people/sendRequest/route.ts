import { NextRequest, NextResponse } from "next/server"
import { getAdminSupabase } from "@/lib/supabase"

export async function POST(req: NextRequest) {
  const { senderId, receiverId } = await req.json()
  if (!senderId || !receiverId) return NextResponse.json({ error: "Missing senderId or receiverId" }, { status: 400 })
  const supabase = getAdminSupabase()
  const { data, error } = await supabase
    .from("friend_requests")
    .insert({ sender_id: senderId, receiver_id: receiverId, status: "Requested" })
    .select()
    .single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true, request: data })
}

export async function DELETE(req: NextRequest) {
  const { senderId, receiverId } = await req.json()
  if (!senderId || !receiverId) return NextResponse.json({ error: "Missing senderId or receiverId" }, { status: 400 })
  const supabase = getAdminSupabase()
  const { error } = await supabase
    .from("friend_requests")
    .delete()
    .eq("sender_id", senderId)
    .eq("receiver_id", receiverId)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
