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

    // Insert company_branch into company_branch table with main_branch boolean
    for (const company of data) {
      if (company.company_branch) {
        const { error: branchError } = await supabase
          .from("company_branch")
          .insert({
            company_id: company.id, // Use the company ID
            branch_name: company.company_branch, // Insert the branch name
            main_branch: true, // Mark this branch as the main branch
          });

        if (branchError) {
          console.error(`Error inserting branch for company ID ${company.id}:`, branchError);
        }
      }
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching companies:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}