import { NextResponse } from "next/server";
import supabase from "@/app/lib/supabase";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  const formData = await request.json();

  try {
    const hashedPassword = await bcrypt.hash(formData.personalDetails.password, 10);

    if (formData.companyAssociation.companyId) {
      const { data: registeredCompany, error: registeredCompanyError } = await supabase
        .from("registered_companies")
        .select("*")
        .eq("id", formData.companyAssociation.companyId)
        .single();

      if (registeredCompanyError && registeredCompanyError.code !== "PGRST116") {
        console.error("Error checking registered company:", registeredCompanyError);
        return NextResponse.json(
          { message: "Failed to check registered company", error: registeredCompanyError },
          { status: 500 }
        );
      }

      if (!registeredCompany) {
        const { data: pendingCompany, error: pendingCompanyError } = await supabase
          .from("pending_companies")
          .select("*")
          .eq("id", formData.companyAssociation.companyId)
          .single();

        if (pendingCompanyError) {
          console.error("Error fetching pending company:", pendingCompanyError);
          return NextResponse.json(
            { message: "Failed to fetch pending company", error: pendingCompanyError },
            { status: 500 }
          );
        }

        if (pendingCompany) {
          const { error: registerCompanyError } = await supabase
            .from("registered_companies")
            .insert(pendingCompany);

          if (registerCompanyError) {
            console.error("Error moving company to registered_companies:", registerCompanyError);
            return NextResponse.json(
              { message: "Failed to move company to registered_companies", error: registerCompanyError },
              { status: 500 }
            );
          }

          const { error: deletePendingCompanyError } = await supabase
            .from("pending_companies")
            .delete()
            .eq("id", formData.companyAssociation.companyId);

          if (deletePendingCompanyError) {
            console.error("Error deleting company from pending_companies:", deletePendingCompanyError);
            return NextResponse.json(
              { message: "Failed to delete company from pending_companies", error: deletePendingCompanyError },
              { status: 500 }
            );
          }

          console.log("Company moved from pending_companies to registered_companies:", pendingCompany);
        }
      }
    }

    const { data: employerData, error: employerError } = await supabase
      .from("registered_employers")
      .insert({
        first_name: formData.personalDetails.firstName,
        middle_name: formData.personalDetails.middleName || null,
        last_name: formData.personalDetails.lastName,
        country_code: formData.personalDetails.countryCode,
        phone: formData.personalDetails.phone,
        email: formData.personalDetails.email,
        password: hashedPassword, 
        company_id: formData.companyAssociation.companyId,
        company_name: formData.companyAssociation.companyName,
        company_branch: formData.companyAssociation.companyBranch,
        company_role: formData.companyAssociation.companyRole,
        job_title: formData.companyAssociation.jobTitle,
        company_email: formData.companyAssociation.companyEmail,
        terms_accepted: formData.verificationDetails.termsAccepted,
      });

    if (employerError) {
      console.error("Error inserting data into registered_employers:", employerError);
      return NextResponse.json(
        { message: "Failed to save employer data", error: employerError },
        { status: 500 }
      );
    }

    console.log("New employer registered:", employerData);

    if (formData.companyAssociation.companyBranch) {
      const { data: pendingBranch, error: pendingBranchError } = await supabase
        .from("pending_branches")
        .select("*")
        .eq("branch_name", formData.companyAssociation.companyBranch)
        .single();

      if (pendingBranchError && pendingBranchError.code !== "PGRST116") {
        console.error("Error fetching pending branch:", pendingBranchError);
        return NextResponse.json(
          { message: "Failed to fetch pending branch", error: pendingBranchError },
          { status: 500 }
        );
      }

      if (pendingBranch) {
        const { error: registerBranchError } = await supabase
          .from("registered_branches")
          .insert(pendingBranch);

        if (registerBranchError) {
          console.error("Error moving branch to registered_branches:", registerBranchError);
          return NextResponse.json(
            { message: "Failed to move branch to registered_branches", error: registerBranchError },
            { status: 500 }
          );
        }

        const { error: deletePendingBranchError } = await supabase
          .from("pending_branches")
          .delete()
          .eq("branch_name", formData.companyAssociation.companyBranch);

        if (deletePendingBranchError) {
          console.error("Error deleting branch from pending_branches:", deletePendingBranchError);
          return NextResponse.json(
            { message: "Failed to delete branch from pending_branches", error: deletePendingBranchError },
            { status: 500 }
          );
        }

        console.log("Branch moved from pending_branches to registered_branches:", pendingBranch);
      }
    }

    return NextResponse.json({ message: "Data saved successfully", employerData });
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { message: "Internal server error", error },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get("email");

  if (!email) {
    return NextResponse.json({ exists: false });
  }

  try {
    const { data: registeredEmail } = await supabase
      .from("registered_employers")
      .select("email")
      .eq("email", email)
      .single();

    if (registeredEmail) {
      return NextResponse.json({ exists: true });
    }

    const { data: pendingEmail } = await supabase
      .from("pending_employers")
      .select("email")
      .eq("email", email)
      .single();

    if (pendingEmail) {
      return NextResponse.json({ exists: true });
    }

    return NextResponse.json({ exists: false });
  } catch (error) {
    console.error("Error checking email:", error);
    return NextResponse.json({ exists: false }, { status: 500 });
  }
}
