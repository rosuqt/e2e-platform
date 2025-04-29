import { NextResponse } from "next/server";
import supabase from "@/app/lib/supabase";

export async function GET() {
  try {
    const { data: registeredCompanies, error: registeredError } = await supabase
      .from("registered_companies")
      .select("id, company_name, company_branch, company_logo_image_path, company_industry, email_domain");

    if (registeredError) {
      throw registeredError;
    }

    const { data: pendingCompanies, error: pendingError } = await supabase
      .from("pending_companies")
      .select("id, company_name, company_branch, company_logo_image_path, company_industry, email_domain");

    if (pendingError) {
      throw pendingError;
    }

    const supabaseBaseUrl = "https://dbuyxpovejdakzveiprx.supabase.co/storage/v1/object/public/company.logo/";

    const companies = [
      ...registeredCompanies.map((company) => ({
        ...company,
        status: "registered",
        company_logo_image_path: company.company_logo_image_path
          ? `${supabaseBaseUrl}${company.company_logo_image_path}`
          : null,
      })),
      ...pendingCompanies.map((company) => ({
        ...company,
        status: "pending",
        company_logo_image_path: company.company_logo_image_path
          ? `${supabaseBaseUrl}${company.company_logo_image_path}`
          : null,
      })),
    ];

    return NextResponse.json(companies);
  } catch (error) {
    console.error("Error fetching companies:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
