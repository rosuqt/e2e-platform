export async function togetherTextGeneration({
  model,
  prompt,
  max_tokens = 200,
  temperature = 0.2,
}: {
  model: string;
  prompt: string;
  max_tokens?: number;
  temperature?: number;
}) {
  const apiKey = process.env.TOGETHER_API_KEY
  if (!apiKey) {
    throw new Error("TOGETHER_API_KEY is not set in environment variables")
  }
  const res = await fetch('https://api.together.xyz/v1/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model,
      prompt,
      max_tokens,
      temperature,
    }),
  });
  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Together API error: ${res.statusText} - ${errText}`);
  }
  return res.json();
}
