import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { id, status, reason } = await request.json();

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // 1. Construct payload using ONLY the columns you confirmed exist
    const updatePayload: any = {
      status: status,
    };

    if (status === "rejected") {
      updatePayload.reason = reason || "No reason provided";
    } else if (status === "approved") {
      updatePayload.reason = null; 
    }

    // 2. Execute update
    const { data, error } = await supabase
      .from("employer_verifications")
      .update(updatePayload)
      .eq("id", id)
      .select();

    if (error) {
      console.error("Supabase Error:", error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!data || data.length === 0) {
      return NextResponse.json({ error: "No record found with that ID" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data });

  } catch (err: any) {
    console.error("Server Error:", err.message);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}