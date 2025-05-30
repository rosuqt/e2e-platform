import { NextResponse } from "next/server";
import supabase from "@/lib/supabase";
function isUUID(id: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id);
}

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
      if (!isUUID(registeredCompany.id)) {
        return NextResponse.json(
          { message: "Registered company ID is not a valid UUID." },
          { status: 500 }
        );
      }
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
      if (!isUUID(pendingCompany.id)) {
        return NextResponse.json(
          { message: "Pending company ID is not a valid UUID." },
          { status: 500 }
        );
      }
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
        address: formData.address.address,
        suite_unit_floor: formData.address.suiteUnitFloor || null,
        business_park_landmark: formData.address.businessPark || null,
        building_name: formData.address.buildingName || null,
        contact_email: formData.address.contactEmail,
        contact_number: formData.address.contactNumber,
        exact_address: formData.address.exactAddress,
        country_code: formData.address.countryCode,
      })
      .select("id, company_name, company_branch, country_code")
      .single();

    if (companyError) {
      console.error("Error inserting company data:", companyError);
      return NextResponse.json(
        { message: "Failed to create company", error: companyError },
        { status: 500 }
      );
    }

    if (!isUUID(companyData.id)) {
      return NextResponse.json(
        { message: "Created company ID is not a valid UUID." },
        { status: 500 }
      );
    }

    const { error: branchError } = await supabase
      .from("pending_branches")
      .insert({
        branch_name: formData.companyBranch || "Headquarters", 
        company_id: companyData.id,
        main_branch: true,
        country_code: formData.address.countryCode,
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
