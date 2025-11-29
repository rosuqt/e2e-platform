import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { getAdminSupabase } from "@/lib/supabase"
import { sendPasswordResetEmail } from "@/lib/email"

export async function POST(request: Request) {
  const { email } = await request.json()
  if (!email) return NextResponse.json({ error: "Missing email" }, { status: 400 })
  const adminSupabase = getAdminSupabase()
  const { data: employer, error } = await adminSupabase
    .from("registered_employers")
    .select("id")
    .eq("email", email)
    .single()
  if (error || !employer?.id) {
    console.error(error)
    return NextResponse.json({ error: "Email not found" }, { status: 404 })
  }
  const token = Buffer.from(`${employer.id}:${Date.now()}`).toString("base64")
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
  const resetLink = `${baseUrl}/sign-in/password-reset?token=${encodeURIComponent(token)}`
  const sent = await sendPasswordResetEmail(email, resetLink)
  if (!sent) {
    console.error("Failed to send email")
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 })
  }
  return NextResponse.json({ success: true })
}

export async function PUT(request: Request) {
  const { token, newPassword } = await request.json()
  if (!token || !newPassword) return NextResponse.json({ error: "Missing token or password" }, { status: 400 })
  const decoded = Buffer.from(token, "base64").toString("utf-8")
  const [employerId] = decoded.split(":")
  if (!employerId) return NextResponse.json({ error: "Invalid token" }, { status: 400 })
  const hashedPassword = await bcrypt.hash(newPassword, 10)
  const adminSupabase = getAdminSupabase()
  const { error } = await adminSupabase
    .from("registered_employers")
    .update({ password: hashedPassword })
    .eq("id", employerId)
  if (error) {
    console.error(error)
    return NextResponse.json({ error: "Failed to update password" }, { status: 500 })
  }
  return NextResponse.json({ success: true })
}
