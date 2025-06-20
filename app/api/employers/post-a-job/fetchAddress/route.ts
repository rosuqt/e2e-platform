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

  const addresses = [{ address: company.address, label: "Main Office" }]

  if (company.multiple_branch) {
    const { data: branches } = await supabase
      .from("registered_branches")
      .select("address, branch_name")
      .eq("company_id", employer.company_id)
    if (branches && Array.isArray(branches)) {
      branches.forEach(branch => {
        if (branch.address) {
          addresses.push({
            address: branch.address,
            label: branch.branch_name || "Branch"
          })
        }
      })
    }
  }

  return NextResponse.json({ addresses })
}
