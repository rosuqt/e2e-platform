import { NextResponse } from "next/server";
import supabase from "@/lib/supabase";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const includePending = url.searchParams.get("includePending") === "true";

    // 1. Fetch Registered Companies: SELECT is_archived (because it exists here)
    const { data: registeredCompanies, error: registeredError } = await supabase
      .from("registered_companies")
      .select("id, company_name, company_branch, company_logo_image_path, company_industry, email_domain, is_archived");

    if (registeredError) {
      console.error("Supabase Error (registered_companies):", registeredError);
      throw registeredError;
    }

    let pendingCompanies: {
      id: string;
      company_name: string;
      company_branch: string;
      company_logo_image_path: string | null;
      company_industry: string;
      email_domain: string | null;
      is_archived?: boolean // Kept optional for type safety
    }[] = [];

    if (includePending) {
      // 2. Fetch Pending Companies: DO NOT SELECT is_archived (because it doesn't exist here)
      const { data, error: pendingError } = await supabase
        .from("pending_companies")
        .select("id, company_name, company_branch, company_logo_image_path, company_industry, email_domain");
        
      if (pendingError) {
        console.error("Supabase Error (pending_companies):", pendingError);
        throw pendingError;
      }
      pendingCompanies = data || [];
    }

    // --- 3. Combine All Companies and Apply Filtering ---
    const allCompanies = [
      ...registeredCompanies.map((company) => ({
        ...company,
        status: "registered",
      })),
      ...pendingCompanies.map((company) => ({
        ...company,
        status: "pending",
        // Crucially, we set is_archived to false/undefined for pending records 
        // since the column doesn't exist, preventing them from being filtered out.
        is_archived: false, 
      })),
    ];
    
    // Filter out only companies/branches where is_archived is explicitly true.
    // This handles both registered (where it might be true/false) and pending (where we set it to false).
    const filteredCompanies = allCompanies.filter(company => company.is_archived !== true);

    // --- 4. Format Image Path and Return Data ---
    const supabaseBaseUrl = "https://dbuyxpovejdakzveiprx.supabase.co/storage/v1/object/public/company.logo/";

    const finalCompanies = filteredCompanies.map(company => ({
        id: company.id,
        company_name: company.company_name,
        company_branch: company.company_branch,
        company_industry: company.company_industry,
        email_domain: company.email_domain,
        is_archived: company.is_archived,
        status: company.status,
        company_logo_image_path: company.company_logo_image_path
          ? `${supabaseBaseUrl}${company.company_logo_image_path}`
          : null,
    }));

    return NextResponse.json(finalCompanies);
  } catch (error) {
    console.error("Error fetching companies:", error);
    return NextResponse.json({ message: "Server error occurred during company fetch." }, { status: 500 });
  }
}