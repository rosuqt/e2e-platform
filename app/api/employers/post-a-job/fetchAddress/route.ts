import { NextRequest, NextResponse } from "next/server"
import supabase from "@/lib/supabase"

export async function POST(req: NextRequest) {
  const { employer_id } = await req.json()
  if (!employer_id) {
    return NextResponse.json({ error: "Missing employer_id" }, { status: 400 })
  }

  const { data: employer, error: employerError } = await supabase
    .from("registered_employers")
    .select("company_id, branch_id")
    .eq("id", employer_id)
    .maybeSingle()
  if (employerError || !employer) {
    return NextResponse.json({ error: "Employer not found" }, { status: 404 })
  }

  const { data: company, error: companyError } = await supabase
    .from("registered_companies")
    .select("address, multiple_branch")
    .eq("id", employer.company_id)
    .maybeSingle()
  if (companyError || !company) {
    return NextResponse.json({ error: "Company not found" }, { status: 404 })
  }

  let address = company.address

  if (company.multiple_branch && employer.branch_id) {
    const { data: branch, error: branchError } = await supabase
      .from("registered_branches")
      .select("address")
      .eq("id", employer.branch_id)
      .maybeSingle()
    if (!branchError && branch && branch.address) {
      address = branch.address
    }
  }

  return NextResponse.json({ address })
}
