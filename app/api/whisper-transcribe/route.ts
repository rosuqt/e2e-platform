import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: Request) {
  const formData = await req.formData();
  const file = formData.get("file") as File;

  const transcription = await openai.audio.transcriptions.create({
    file,
    model: "whisper-1", 
  });

  return NextResponse.json({ text: transcription.text });
}
