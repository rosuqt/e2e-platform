/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server"

export async function GET() {
  const res = await fetch("https://countriesnow.space/api/v0.1/countries/positions")
  const data = await res.json()
  const countries = Array.isArray(data.data)
    ? data.data.map((c: any) => ({
        code: c.iso2,
        name: c.name
      })).filter((c: { code: any; name: any }) => c.code && c.name)
    : []
  return NextResponse.json({ data: countries })
}
