import { NextRequest, NextResponse } from "next/server"
import supabase from "@/lib/supabase"

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const data = await req.json()

    const updateData: Record<string, string> = {}
    if ("testCaseTitle" in data) updateData.test_case_title = data.testCaseTitle
    if ("description" in data) updateData.description = data.description
    if ("stepsToReproduce" in data) updateData.steps_to_reproduce = data.stepsToReproduce
    if ("expectedResult" in data) updateData.expected_result = data.expectedResult
    if ("actualResult" in data) updateData.actual_result = data.actualResult
    if ("category" in data) updateData.category = data.category
    if ("severity" in data) updateData.severity = data.severity
    if ("commitVer" in data) updateData.commit_ver = data.commitVer
    if ("module" in data) updateData.module = data.module
    if ("feedback" in data) updateData.ally_action = data.feedback

    const { data: updated, error } = await supabase
      .from("test_cases")
      .update(updateData)
      .eq("id", Number(id))
      .select()

    if (error) throw error

    return NextResponse.json(updated?.[0] ?? {}, { status: 200 })
  } catch {
    return NextResponse.json({ error: "Failed to update test case" }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    const { error } = await supabase
      .from("test_cases")
      .delete()
      .eq("id", Number(id))

    if (error) throw error

    return NextResponse.json({ success: true }, { status: 200 })
  } catch {
    return NextResponse.json({ error: "Failed to delete test case" }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const data = await req.json()

    const updateData: Record<string, string> = {}
    if ("ally_action" in data) updateData.ally_action = data.ally_action
    if ("personal_notes" in data) updateData.personal_notes = data.personal_notes

    const { data: updated, error } = await supabase
      .from("test_cases")
      .update(updateData)
      .eq("id", Number(id))
      .select()

    if (error) throw error

    return NextResponse.json(updated?.[0] ?? {}, { status: 200 })
  } catch {
    return NextResponse.json({ error: "Failed to update test case" }, { status: 500 })
  }
}
