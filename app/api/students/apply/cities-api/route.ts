import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const country = searchParams.get("country")
  const prefix = searchParams.get("prefix") || ""
  if (!country) return NextResponse.json({ data: [] })

  const res = await fetch("https://countriesnow.space/api/v0.1/countries/cities", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ country })
  })
  const data = await res.json()
  const cities = Array.isArray(data.data)
    ? data.data
        .filter((name: string) => name.toLowerCase().includes(prefix.toLowerCase()))
        .map((name: string, idx: number) => ({
          id: `${country}-${name}-${idx}`,
          name
        }))
    : []
  return NextResponse.json({ data: cities })
}
