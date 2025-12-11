import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { getAdminSupabase } from "@/lib/supabase"

export async function PUT(request: Request) {
  const { email, newPassword } = await request.json()
  if (!email || !newPassword) return NextResponse.json({ error: "Missing email or password" }, { status: 400 })
  const hashedPassword = await bcrypt.hash(newPassword, 10)
  const adminSupabase = getAdminSupabase()
  const { error } = await adminSupabase
    .from("registered_employers")
    .update({ password: hashedPassword })
    .eq("email", email)
  if (error) {
    return NextResponse.json({ error: "Failed to update password" }, { status: 500 })
  }
  return NextResponse.json({ success: true })
}
