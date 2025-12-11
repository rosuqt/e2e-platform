import { togetherTextGeneration } from "@/lib/together"

export async function generateJobDetailsAI(jobTitle: string, workType?: string) {
  // This function expects jobTitle and workType to be passed in correctly from the API handler.
  console.log("AI job details called with jobTitle:", jobTitle, "workType:", workType)
  if (typeof workType === "undefined") {
    console.log("AI job details received workType: undefined");
  } else {
    console.log("AI job details received workType:", workType);
  }
  // Ensure workType is a string for prompt logic
  const normalizedWorkType = typeof workType === "undefined" ? "" : workType;
  let prompt = `
Given the job title "${jobTitle}", generate the following as JSON:
{
  "jobDescription": "...",
  "jobSummary": "...",
  "mustHaveQualifications": ["...", "..."],
  "niceToHaveQualifications": ["...", "..."],
  "responsibilities": ["...", "..."]
}
Only return valid JSON, no commentary.
`
  if (normalizedWorkType && (normalizedWorkType === "OJT/Internship" || normalizedWorkType.toLowerCase().includes("intern"))) {
    prompt = `
Given the job title "${jobTitle}" for an internship or OJT position, generate the following as JSON:
{
  "jobDescription": "...",
  "jobSummary": "...",
  "mustHaveQualifications": ["...", "..."],
  "niceToHaveQualifications": ["...", "..."],
  "responsibilities": ["...", "..."]
}
Do not require mastery-level qualifications or years of experience. Focus on basic skills, willingness to learn, and relevant coursework. Only return valid JSON, no commentary.
`
  }
  const out = await togetherTextGeneration({
    model: 'mistralai/Mistral-7B-Instruct-v0.2',
    prompt,
    max_tokens: 400,
    temperature: 0.5,
  })
  const raw = out.choices?.[0]?.text ?? ""
  // console.log("AI RAW OUTPUT:", raw)
  let jsonStr = ""
  const jsonStart = raw.indexOf("{")
  const jsonEnd = raw.lastIndexOf("}")
  if (jsonStart !== -1 && jsonEnd !== -1) {
    jsonStr = raw.slice(jsonStart, jsonEnd + 1)
  } else {
    jsonStr = raw.trim()
  }
  // Fix missing comma before "responsibilities"
  jsonStr = jsonStr.replace(
    /("niceToHaveQualifications"\s*:\s*\[[^\]]*\])\s*("responsibilities")/m,
    '$1,\n$2'
  )
  // Attempt to fix unterminated string errors by removing trailing incomplete lines
  if (jsonStr) {
    const lastQuote = jsonStr.lastIndexOf('"');
    const lastBrace = jsonStr.lastIndexOf('}');
    if (lastBrace < lastQuote) {
      jsonStr = jsonStr.slice(0, lastBrace + 1);
    }
  }
  // console.log("AI JSON STR:", jsonStr)
  try {
    const parsed = JSON.parse(jsonStr)
    return {
      jobDescription: parsed.jobDescription || "",
      jobSummary: parsed.jobSummary || "",
      mustHaveQualifications: Array.isArray(parsed.mustHaveQualifications) ? parsed.mustHaveQualifications : [],
      niceToHaveQualifications: Array.isArray(parsed.niceToHaveQualifications) ? parsed.niceToHaveQualifications : [],
      responsibilities: Array.isArray(parsed.responsibilities) ? parsed.responsibilities : [],
    }
  } catch (err) {
    console.error("AI JSON PARSE ERROR:", err)
    return {
      jobDescription: "",
      jobSummary: "",
      mustHaveQualifications: [],
      niceToHaveQualifications: [],
      responsibilities: [],
    }
  }
}
