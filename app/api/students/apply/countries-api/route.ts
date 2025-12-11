/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const res = await fetch("https://restcountries.com/v3.1/all?fields=cca2,name")
    if (!res.ok) {
      const errorText = await res.text()
      console.error("restcountries API request failed:", res.status, errorText)
      return NextResponse.json({ error: "restcountries API request failed", details: errorText, data: [] }, { status: 502 })
    }
    const data = await res.json()
    const countries = Array.isArray(data)
      ? data.map((c: any) => ({
          code: c.cca2,
          name: c.name?.common
        })).filter((c: { code: string; name: string }) => c.code && c.name)
        .sort((a: { name: string }, b: { name: string }) => a.name.localeCompare(b.name))
      : []
    console.log("Countries returned:", countries)
    return NextResponse.json({ data: countries })
  } catch (err) {
    console.error("Error in countries-api route:", err)
    return NextResponse.json({ error: String(err), data: [] }, { status: 500 })
  }
}
