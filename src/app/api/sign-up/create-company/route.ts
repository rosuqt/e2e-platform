import { NextResponse } from "next/server";
import supabase from "@/app/lib/supabase";

export async function POST(request: Request) {
  try {
    const formData = await request.json();

    if (!formData.companyBranch) {
      return NextResponse.json(
        { message: 'The "companyBranch" field is required.' },
        { status: 400 }
      );
    }

    const { data: registeredCompany, error: registeredError } = await supabase
      .from("registered_companies")
      .select("id")
      .eq("company_name", formData.companyName)
      .single();

    if (registeredError && registeredError.code !== "PGRST116") {
      console.error("Error checking registered companies:", registeredError);
      return NextResponse.json(
        { message: "Failed to validate company name", error: registeredError },
        { status: 500 }
      );
      }

    if (registeredCompany) {
      return NextResponse.json(
        { message: `The company name "${formData.companyName}" already exists in registered companies.` },
        { status: 400 }
      );
    }

    const { data: pendingCompany, error: pendingError } = await supabase
      .from("pending_companies")
      .select("id")
      .eq("company_name", formData.companyName)
      .single();

    if (pendingError && pendingError.code !== "PGRST116") {
      console.error("Error checking pending companies:", pendingError);
      return NextResponse.json(
        { message: "Failed to validate company name", error: pendingError },
        { status: 500 }
      );
    }

    if (pendingCompany) {
      return NextResponse.json(
        { message: `The company name "${formData.companyName}" already exists in pending companies.` },
        { status: 400 }
      );
    }

    const { data: companyData, error: companyError } = await supabase
      .from("pending_companies")
      .insert({
        company_name: formData.companyName,
        company_branch: formData.companyBranch,
        company_industry: formData.companyIndustry,
        company_size: formData.companySize || null,
        email_domain: formData.companyEmailDomain || null,
        company_website: formData.companyWebsite || null,
        multiple_branch: formData.multipleBranch ?? false,
        country: formData.address.country,
        city: formData.address.city,
        street: formData.address.street,
        province: formData.address.province,
        contact_email: formData.address.contactEmail,
        contact_number: formData.address.contactNumber,
        exact_address: formData.address.exactAddress,
      })
      .select("id, company_name, company_branch")
      .single();

    if (companyError) {
      console.error("Error inserting company data:", companyError);
      return NextResponse.json(
        { message: "Failed to create company", error: companyError },
        { status: 500 }
      );
    }

    const { error: branchError } = await supabase
      .from("pending_branches")
      .insert({
        branch_name: formData.companyBranch,
        company_id: companyData.id,
        main_branch: true,
      });

    if (branchError) {
      console.error("Error inserting branch data:", branchError);
      return NextResponse.json(
        { message: "Failed to create branch", error: branchError },
        { status: 500 }
      );
    }

    console.log("Company and branch created successfully:", companyData);
    return NextResponse.json({ message: "Company and branch created successfully", data: companyData });
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json(
      { message: "Internal server error", error },
      { status: 500 }
    );
  }
}
