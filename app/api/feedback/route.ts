import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { TestCase } from "../../(testing)/feedback/components/types"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: NextRequest) {
  try {
    const data: TestCase & { ally_action?: string; personal_notes?: string; module?: string } = await req.json()
    const {
      testerName,
      testCaseTitle,
      description,
      stepsToReproduce,
      expectedResult,
      actualResult,
      category,
      severity,
      commitVer,
      date,
      ally_action,
      personal_notes,
      module,
    } = data

    const commitVerValue = typeof commitVer === "string" && commitVer.trim() !== "" ? commitVer : "Not provided"

    console.log("Inserting tester_name:", testerName)

    const { data: result, error } = await supabase
      .from("test_cases")
      .insert([
        {
          tester_name: testerName,
          test_case_title: testCaseTitle,
          description: description,
          steps_to_reproduce: stepsToReproduce,
          expected_result: expectedResult,
          actual_result: actualResult,
          category: category,
          severity: severity,
          commit_ver: commitVerValue,
          date: date,
          ally_action: ally_action ?? "pending",
          personal_notes: personal_notes ?? null,
          module: module ?? null,
        },
      ])
      .select("id")

    if (error) {
      console.error("Supabase insert error:", error)
      throw error
    }

    return NextResponse.json({ id: result[0].id }, { status: 201 })
  } catch (err) {
    console.error("POST /api/feedback error:", err) 
    return NextResponse.json(
      { error: "Failed to save test case", details: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    )
  }
}
