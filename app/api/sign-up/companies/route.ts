import { NextResponse } from "next/server";
import supabase from "@/lib/supabase";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const includePending = url.searchParams.get("includePending") === "true";

    const { data: registeredCompanies, error: registeredError } = await supabase
      .from("registered_companies")
      .select("id, company_name, company_branch, company_logo_image_path, company_industry, email_domain");

    if (registeredError) {
      throw registeredError;
    }

    let pendingCompanies: {
      id: string;
      company_name: string;
      company_branch: string;
      company_logo_image_path: string | null;
      company_industry: string;
      email_domain: string | null;
    }[] = [];

    if (includePending) {
      const { data, error: pendingError } = await supabase
        .from("pending_companies")
        .select("id, company_name, company_branch, company_logo_image_path, company_industry, email_domain");

      if (pendingError) {
        throw pendingError;
      }
      pendingCompanies = data || [];
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
