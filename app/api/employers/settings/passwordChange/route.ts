import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../../../../../lib/authOptions"
import { getAdminSupabase } from "@/lib/supabase"
import bcrypt from "bcryptjs"

function validatePassword(password: string) {
  if (password.length < 8) return "Password must be at least 8 characters."
  if (!/[A-Z]/.test(password)) return "Password must contain an uppercase letter."
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) return "Password must contain a special character."
  return ""
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)
  const employerId = session?.user?.employerId
  if (!employerId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { currentPassword, newPassword } = await request.json()
  if (!currentPassword || !newPassword) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 })
  }

  const validationError = validatePassword(newPassword)
  if (validationError) {
    return NextResponse.json({ error: validationError }, { status: 400 })
  }

  const supabase = getAdminSupabase()
  const { data: user, error } = await supabase
    .from("registered_employers")
    .select("password")
    .eq("id", employerId)
    .maybeSingle()

  if (error || !user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 })
  }

  const passwordMatch = bcrypt.compareSync(currentPassword, user.password)
  if (!passwordMatch) {
    return NextResponse.json({ error: "Current password is incorrect" }, { status: 400 })
  }

  const hashedNewPassword = bcrypt.hashSync(newPassword, 10)
  const { error: updateError } = await supabase
    .from("registered_employers")
    .update({ password: hashedNewPassword })
    .eq("id", employerId)

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 400 })
  }

  return NextResponse.json({ success: true })
}
