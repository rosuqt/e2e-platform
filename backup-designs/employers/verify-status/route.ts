import { NextResponse } from "next/server";
import supabase from '../../../lib/supabase'; 

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const employerId = searchParams.get("employerId");

  if (!employerId) {
    return NextResponse.json({ error: "Employer ID is required" }, { status: 400 });
  }

  try {
    const { data, error } = await supabase
      .from("registered_employers")
      .select("verify_status")
      .eq("id", employerId)
      .single();

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json({ error: "Error fetching employer" }, { status: 500 });
    }

    if (!data) {
      return NextResponse.json({ error: "Employer not found" }, { status: 404 });
    }

    return NextResponse.json({ verify_status: data.verify_status });
  } catch (error) {
    console.error("Unhandled error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
