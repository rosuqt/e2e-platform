import type { NextApiRequest, NextApiResponse } from 'next'
import { getInterviewFeedback } from '@/lib/interview-feedback'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end()
  const { question, answer } = req.body
  const feedback = await getInterviewFeedback(question, answer)
  res.status(200).json(feedback)
}
