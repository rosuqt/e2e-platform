import { togetherTextGeneration } from './together'

export async function generateInterviewQuestions(
  jobTitle: string,
  difficulty: "easy" | "medium" | "hard" = "medium"
) {
  let count = 8
  let difficultyPrompt = ""
  if (difficulty === "easy") {
    count = Math.floor(Math.random() * 5) + 5
    difficultyPrompt = "Make the questions simple, beginner-friendly, and not intimidating. Avoid deep technical or trick questions. Focus on basic concepts and soft skills."
  } else if (difficulty === "medium") {
    count = Math.floor(Math.random() * 5) + 8
    difficultyPrompt = "Questions should be moderately challenging, a mix of practical technical and behavioral questions. Avoid very advanced or niche topics."
  } else if (difficulty === "hard") {
    count = Math.floor(Math.random() * 4) + 12
    difficultyPrompt = "Make the questions hard and technical, requiring deep knowledge and problem-solving."
  }

  if (
    typeof process !== "undefined" &&
    process.env &&
    !process.env.TOGETHER_API_KEY
  ) {
    throw new Error("TOGETHER_API_KEY is not set in environment variables")
  }

  const prompt = `
You are an expert interviewer. Generate ${count} unique, relevant interview questions for the following job title:

Job Title: ${jobTitle}

Rules:
- ${difficultyPrompt}
- Avoid generic questions like "Tell me about yourself".
- Focus on both technical and behavioral aspects.
- Output as a flat numbered list, no explanations.

Questions:
`
  const out = await togetherTextGeneration({
    model: 'mistralai/Mixtral-8x7B-Instruct-v0.1',
    prompt,
    max_tokens: 400,
    temperature: 0.5,
  })
  const text = out.choices?.[0]?.text ?? ''
  return text
}
