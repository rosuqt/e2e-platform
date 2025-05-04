import { NextResponse } from "next/server";
import supabase from "../../../lib/supabase";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const company_id = searchParams.get("company_id");

  if (!company_id) {
    return NextResponse.json({ error: "company_id is required" }, { status: 400 });
  }

  try {
    console.log("Received company_id:", company_id);

    const { data: registeredCompany, error: registeredCompanyError } = await supabase
      .from("registered_companies")
      .select("multiple_branch")
      .eq("id", company_id)
      .single();

    if (registeredCompanyError) {
      console.error("Error fetching registered company data:", registeredCompanyError);
    }

   
    let multipleBranch = registeredCompany?.multiple_branch ?? null;
    if (multipleBranch === null) {
      const { data: pendingCompany, error: pendingCompanyError } = await supabase
        .from("pending_companies")
        .select("multiple_branch")
        .eq("id", company_id)
        .single();

      if (pendingCompanyError) {
        console.error("Error fetching pending company data:", pendingCompanyError);
      }

      multipleBranch = pendingCompany?.multiple_branch ?? null;
    }

    if (multipleBranch === null) {
      console.warn(`Company with id ${company_id} not found in registered or pending companies`); 
      return NextResponse.json({ error: "Company not found" }, { status: 404 });
    }

    const { data: registeredBranches, error: registeredBranchesError } = await supabase
      .from("registered_branches")
      .select("branch_name")
      .eq("company_id", company_id);

    if (registeredBranchesError) {
      console.error("Error fetching registered branches:", registeredBranchesError);
    }

    const { data: pendingBranches, error: pendingBranchesError } = await supabase
      .from("pending_branches")
      .select("branch_name")
      .eq("company_id", company_id);

    if (pendingBranchesError) {
      console.error("Error fetching pending branches:", pendingBranchesError);
    }

    const branches = [
      ...(registeredBranches || []).map((branch) => ({ ...branch, status: "registered" })),
      ...(pendingBranches || []).map((branch) => ({ ...branch, status: "pending" })),
    ];

    console.log("Returning branches:", branches);
    return NextResponse.json({ branches, multipleBranch });
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
