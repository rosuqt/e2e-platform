import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function POST(req: NextRequest) {
  const data = await req.json()
  const { title, department, type, description, requirements, responsibilities, salaryRange } = data

  const { error } = await supabase.from("sti_careers").insert([
    {
      position_title: title,
      department,
      campus: "STI College Alabang",
      employment_type: type,
      job_description: description,
      requirements,
      responsibilities,
      salary_range: salaryRange,
    }
  ])

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  return NextResponse.json({ success: true })
}

export async function PUT(req: NextRequest) {
  const data = await req.json()
  const { id, title, department, type, description, requirements, responsibilities, salaryRange } = data

  const { data: rows, error: fetchError } = await supabase
    .from("sti_careers")
    .select("id")
    .order("posted_date", { ascending: false })

  if (fetchError || !rows || !rows[id - 1]) {
    return NextResponse.json({ error: "Career opportunity not found." }, { status: 404 })
  }

  const uuid = rows[id - 1].id

  const { error } = await supabase
    .from("sti_careers")
    .update({
      position_title: title,
      department,
      campus: "STI College Alabang",
      employment_type: type,
      job_description: description,
      requirements,
      responsibilities,
      salary_range: salaryRange,
    })
    .eq("id", uuid)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  return NextResponse.json({ success: true })
}
