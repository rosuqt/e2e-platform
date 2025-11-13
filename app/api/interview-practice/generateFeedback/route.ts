import { NextResponse } from "next/server"
import { getInterviewFeedback } from "@/lib/interview-feedback"

export async function POST(req: Request) {
  const { question, answer } = await req.json()
  if (!question || !answer) {
    return NextResponse.json({ error: "Missing question or answer" }, { status: 400 })
  }
  try {
    const feedback = await getInterviewFeedback(question, answer)
    return NextResponse.json(feedback)
  } catch (err) {
    console.error("AI feedback generation failed", err)
    return NextResponse.json({ error: "AI feedback generation failed", details: String(err) }, { status: 500 })
  }
}
