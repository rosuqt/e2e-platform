import { togetherTextGeneration } from './together'

if (typeof window !== "undefined") {
  throw new Error("getInterviewFeedback must only be called from the server")
}

export async function getInterviewFeedback(question: string, answer: string) {
  const prompt = `
You are a strict, realistic interview coach. Given the following interview question and answer, do the following:
- Give a feedback score from 0-100, where 0 is a completely unhelpful or blank answer, 50 is a weak or incomplete answer, and 100 is an excellent, detailed, and relevant answer. Be honest and critical—do not give high scores for poor or generic answers.
- Write a short, direct feedback tip that clearly tells the candidate what to improve or what is missing. If the answer is blank, generic, or "I don't know", say so and encourage them to try.
- Write a suggested improved answer that is specific, realistic, and directly addresses the question.

Return your response as a JSON object with keys: score, tip, improvement.

Question: ${question}
Answer: ${answer}
`
  const out = await togetherTextGeneration({
    model: 'mistralai/Mixtral-8x7B-Instruct-v0.1',
    prompt,
    max_tokens: 400,
    temperature: 0.6,
  })
  let feedback
  try {
    feedback = JSON.parse(out.choices?.[0]?.text ?? '')
  } catch {
    feedback = { score: null, tip: "", improvement: "" }
  }
  return feedback
}
