import { NextResponse } from "next/server";
import supabase from "@/lib/supabase";

function isUUID(id: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id);
}

export async function POST(request: Request) {
  try {
    const formData = await request.json();

    if (!formData.branchName || !formData.companyName) {
      return NextResponse.json(
        { message: 'The "branchName" and "companyName" fields are required.' },
        { status: 400 }
      );
    }

    const { data: registeredCompany, error: registeredError } = await supabase
      .from("registered_companies")
      .select("id")
      .eq("company_name", formData.companyName)
      .single();

    if (registeredError && registeredError.code !== "PGRST116") {
      console.error("Error fetching registered company data:", registeredError);
      return NextResponse.json(
        { message: "Error fetching registered company data", error: registeredError },
        { status: 500 }
      );
    }

    const { data: pendingCompany, error: pendingError } = await supabase
      .from("pending_companies")
      .select("id")
      .eq("company_name", formData.companyName)
      .single();

    if (pendingError && pendingError.code !== "PGRST116") {
      console.error("Error fetching pending company data:", pendingError);
      return NextResponse.json(
        { message: "Error fetching pending company data", error: pendingError },
        { status: 500 }
      );
    }

    if (!registeredCompany && !pendingCompany) {
      console.warn("Company not found in registered or pending companies:", formData.companyName);
      return NextResponse.json(
        { message: "Company does not exist in registered or pending companies." },
        { status: 400 }
      );
    }

    const companyId = registeredCompany?.id || pendingCompany?.id;

    if (!isUUID(companyId)) {
      return NextResponse.json(
        { message: "Company ID is not a valid UUID." },
        { status: 500 }
      );
    }

    console.log("Inserting branch with data:", {
      branch_name: formData.branchName,
      branch_phone: formData.branchPhone || null,
      email_domain: formData.branchEmailDomain || null,
      country: formData.address.country || null,
      city: formData.address.city || null,
      street: formData.address.street || null,
      province: formData.address.province || null,
      exact_address: formData.address.exactAddress || null,
      company_id: companyId,
    });

    const { data, error } = await supabase
      .from("pending_branches")
      .insert({
        branch_name: formData.branchName,
        branch_phone: formData.branchPhone || null,
        email_domain: formData.branchEmailDomain || null,
        country: formData.address.country || null,
        city: formData.address.city || null,
        street: formData.address.street || null,
        province: formData.address.province || null,
        exact_address: formData.address.exactAddress || null,
        company_id: companyId,
      })
      .select("branch_name")
      .single();

    if (error) {
      if (error.code === "23505") {
        console.error("Branch already exists:", error);
        return NextResponse.json(
          { message: "Branch already exists. Please choose a different name." },
          { status: 400 }
        );
      }
      console.error("Error inserting branch data:", error);
      return NextResponse.json(
        { message: "Failed to create branch", error },
        { status: 500 }
      );
    }

    if (!data || !data.branch_name) {
      console.error("Invalid response: Missing branch_name in inserted data");
      return NextResponse.json(
        { message: "Failed to retrieve branch_name after creation" },
        { status: 500 }
      );
    }

    console.log("Branch created successfully:", data);
    return NextResponse.json({
      message: "Branch created successfully",
      data: { branch_name: data.branch_name },
    });
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json(
      { message: "Internal server error", error },
      { status: 500 }
    );
  }
}
