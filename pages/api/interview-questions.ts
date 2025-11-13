import type { NextApiRequest, NextApiResponse } from "next"
import { generateInterviewQuestions } from "@/lib/generate-interview-questions"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { jobTitle, count } = req.body
  if (!jobTitle) return res.status(400).json({ error: "Missing jobTitle" })
  try {
    const questions = await generateInterviewQuestions(jobTitle, count || 8)
    res.status(200).json({ questions })
  } catch (error) {
    console.error("Error generating interview questions:", error)
    res.status(500).json({ error: "Failed to generate questions" })
  }
}
