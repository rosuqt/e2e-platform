import { NextResponse } from "next/server"
import { generateJobDetailsAI } from "../../(app)/employers/jobs/post-a-job/lib/ai-job-details"

export async function POST(req: Request) {
  const { jobTitle } = await req.json()
  if (!jobTitle) {
    return NextResponse.json({ error: "Missing jobTitle" }, { status: 400 })
  }
  try {
    const details = await generateJobDetailsAI(jobTitle)
    return NextResponse.json(details)
  } catch {
    return NextResponse.json({ error: "AI generation failed" }, { status: 500 })
  }
}
