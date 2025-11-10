/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server"

export const runtime = "nodejs"

export async function POST(req: Request) {
  try {
    const formData = await req.formData()
    const file = formData.get("file") as File
    if (!file) return NextResponse.json({ error: "No file uploaded" }, { status: 400 })

    const buffer = Buffer.from(await file.arrayBuffer())

    const ocrForm = new FormData()
    ocrForm.append("apikey", process.env.OCR_SPACE_API_KEY || "")
    ocrForm.append("language", "eng")
    ocrForm.append("isOverlayRequired", "false")
    ocrForm.append("file", new Blob([buffer]), file.name)

    const ocrRes = await fetch("https://api.ocr.space/parse/image", {
      method: "POST",
      body: ocrForm
    })

    const data = await ocrRes.json()

    if (!data || !data.ParsedResults || data.ParsedResults.length === 0) {
      return NextResponse.json({ error: "No text detected", details: data }, { status: 422 })
    }

    const text = data.ParsedResults.map((r: any) => r.ParsedText).join("\n")

    return NextResponse.json({ text })
  } catch (err: any) {
    console.error("PDF OCR error:", err)
    return NextResponse.json({ error: "OCR processing failed", details: String(err) }, { status: 500 })
  }
}
