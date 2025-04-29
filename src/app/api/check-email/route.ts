import { NextResponse } from "next/server";
import supabase from "@/app/lib/supabase";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get("email");

  if (!email) {
    return NextResponse.json({ exists: false });
  }

  try {
    const { data: registeredEmail } = await supabase
      .from("registered_employers")
      .select("email")
      .eq("email", email)
      .single();

    if (registeredEmail) {
      return NextResponse.json({ exists: true });
    }

    const { data: pendingEmail } = await supabase
      .from("pending_employers")
      .select("email")
      .eq("email", email)
      .single();

    if (pendingEmail) {
      return NextResponse.json({ exists: true });
    }

    return NextResponse.json({ exists: false });
  } catch (error) {
    console.error("Error checking email:", error);
    return NextResponse.json({ exists: false }, { status: 500 });
  }
}
