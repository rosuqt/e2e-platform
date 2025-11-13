import {  NextResponse } from "next/server"
import supabase from "@/lib/supabase"

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("test_cases")
      .select(
        "id, tester_name, test_case_title, description, steps_to_reproduce, expected_result, actual_result, category, severity, commit_ver, date, module, ally_action, personal_notes"
      )
      .order("date", { ascending: false })

    if (error) throw error

    return NextResponse.json(data ?? [], { status: 200 })
  } catch {
    return NextResponse.json({ error: "Failed to fetch test cases" }, { status: 500 })
  }
}
