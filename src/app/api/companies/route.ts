import { NextResponse } from "next/server";
import supabase from "@/app/lib/supabase";

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("pending_newcompanies")
      .select("id, company_name, company_branch, company_logo, company_industry")
      .order("company_name");

    if (error) {
      throw error;
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching companies:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}