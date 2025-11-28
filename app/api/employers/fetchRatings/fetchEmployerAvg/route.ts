import { NextResponse } from "next/server"
import supabase from "@/lib/supabase"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const employerId = searchParams.get("employerId")
  if (!employerId) {
    return NextResponse.json({ error: "Missing employerId" }, { status: 400 })
  }

  const { data, error } = await supabase
    .from("student_ratings")
    .select("recruiter_rating")
    .eq("employer_id", employerId)

  if (error || !data) {
    return NextResponse.json({ error: "Supabase error" }, { status: 500 })
  }

  const ratings = data
    .map(r => {
      const val = r.recruiter_rating
      if (val === null || val === undefined) return null
      const num = Number(val)
      return isNaN(num) ? null : num
    })
    .filter((v: number | null) => typeof v === "number" && v !== null)

  if (ratings.length === 0) {
    return NextResponse.json({ rating: null, count: data.length })
  }

  const avg = ratings.reduce((sum, v) => sum + v, 0) / ratings.length
  return NextResponse.json({ rating: avg, count: ratings.length })
}
