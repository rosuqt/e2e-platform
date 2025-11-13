import { NextResponse } from "next/server";
import supabase from "@/lib/supabase";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const companyName = searchParams.get("name");

    if (!companyName) {
      return NextResponse.json(
        { message: 'The "name" query parameter is required.' },
        { status: 400 }
      );
    }

    const { data: registeredCompany, error: registeredError } = await supabase
      .from("registered_companies")
      .select("id")
      .eq("company_name", companyName)
      .single();

    if (registeredError && registeredError.code !== "PGRST116") {
      console.error("Error checking registered companies:", registeredError);
      return NextResponse.json(
        { message: "Failed to validate company name", error: registeredError },
        { status: 500 }
      );
    }

    if (registeredCompany) {
      return NextResponse.json({ exists: true });
    }

    const { data: pendingCompany, error: pendingError } = await supabase
      .from("pending_companies")
      .select("id")
      .eq("company_name", companyName)
      .single();

    if (pendingError && pendingError.code !== "PGRST116") {
      console.error("Error checking pending companies:", pendingError);
      return NextResponse.json(
        { message: "Failed to validate company name", error: pendingError },
        { status: 500 }
      );
    }

    if (pendingCompany) {
      return NextResponse.json({ exists: true });
    }

    return NextResponse.json({ exists: false });
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json(
      { message: "Internal server error", error },
      { status: 500 }
    );
  }
}
