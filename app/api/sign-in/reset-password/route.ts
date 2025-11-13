import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    { error: "This endpoint is deprecated. Use Supabase Auth's built-in password reset." },
    { status: 410 }
  );
}
