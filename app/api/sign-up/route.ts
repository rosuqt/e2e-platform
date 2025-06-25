import { NextResponse } from "next/server";
import supabase, { getAdminSupabase } from "@/lib/supabase";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  const formData = await request.json();

  const adminSupabase = getAdminSupabase();

  function capitalizeWords(str: string) {
    if (!str) return str;
    return str.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.slice(1).toLowerCase());
  }

  try {
    function isValidUUID(str: string) {
      return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(str);
    }

    let companyId = formData.companyAssociation.companyId;
    let companyJustCreated = false;
    if (companyId && !isValidUUID(companyId)) {
      const { data: pendingCompany, error: pendingCompanyError } = await supabase
        .from("pending_companies")
        .select("*")
        .eq("company_name", formData.companyAssociation.companyName)
        .single();

      if (pendingCompanyError) {
        if (pendingCompanyError.code === "PGRST116") {
          return NextResponse.json(
            { message: `No pending company found with name "${formData.companyAssociation.companyName}".`, error: pendingCompanyError },
            { status: 400 }
          );
        }
        console.error("Error fetching pending company by name:", pendingCompanyError);
        return NextResponse.json(
          { message: "Failed to fetch pending company", error: pendingCompanyError },
          { status: 500 }
        );
      }

      if (pendingCompany) {
        companyId = pendingCompany.id;
        companyJustCreated = true;

        const { error: registerCompanyError } = await supabase
          .from("registered_companies")
          .insert({
            ...pendingCompany,
            id: companyId
          });

        if (registerCompanyError) {
          console.error("Error moving company to registered_companies:", registerCompanyError);
          return NextResponse.json(
            { message: "Failed to move company to registered_companies", error: registerCompanyError },
            { status: 500 }
          );
        } else {
          await supabase
            .from("company_profile")
            .insert({
              company_id: companyId
            });
        }

        const { error: deletePendingCompanyError } = await supabase
          .from("pending_companies")
          .delete()
          .eq("id", companyId);

        if (deletePendingCompanyError) {
          console.error("Error deleting company from pending_companies:", deletePendingCompanyError);
          return NextResponse.json(
            { message: "Failed to delete company from pending_companies", error: deletePendingCompanyError },
            { status: 500 }
          );
        }

        const { data: pendingBranches, error: pendingBranchesError } = await supabase
          .from("pending_branches")
          .select("*")
          .eq("company_id", companyId);

        if (pendingBranchesError) {
          console.error("Error fetching pending branches:", pendingBranchesError);
          return NextResponse.json(
            { message: "Failed to fetch pending branches", error: pendingBranchesError },
            { status: 500 }
          );
        } else if (pendingBranches && pendingBranches.length > 0) {
          const { error: registerBranchesError } = await supabase
            .from("registered_branches")
            .insert(pendingBranches);

          if (registerBranchesError) {
            console.error("Error moving branches to registered_branches:", registerBranchesError);
            return NextResponse.json(
              { message: "Failed to move branches to registered_branches", error: registerBranchesError },
              { status: 500 }
            );
          }

          const { error: deletePendingBranchesError } = await supabase
            .from("pending_branches")
            .delete()
            .eq("company_id", companyId);

          if (deletePendingBranchesError) {
            console.error("Error deleting branches from pending_branches:", deletePendingBranchesError);
            return NextResponse.json(
              { message: "Failed to delete branches from pending_branches", error: deletePendingBranchesError },
              { status: 500 }
            );
          }
        }
      }
    } else if (companyId) {
      const { data: registeredCompany, error: registeredCompanyError } = await supabase
        .from("registered_companies")
        .select("*")
        .eq("id", companyId)
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
          .eq("id", companyId)
          .single();

        if (pendingCompanyError) {
          console.error("Error fetching pending company:", pendingCompanyError);
          return NextResponse.json(
            { message: "Failed to fetch pending company", error: pendingCompanyError },
            { status: 500 }
          );
        }

        if (pendingCompany) {
          companyJustCreated = true;
          const { error: registerCompanyError } = await supabase
            .from("registered_companies")
            .insert(pendingCompany);

          if (registerCompanyError) {
            console.error("Error moving company to registered_companies:", registerCompanyError);
            return NextResponse.json(
              { message: "Failed to move company to registered_companies", error: registerCompanyError },
              { status: 500 }
            );
          } else {
            await supabase
              .from("company_profile")
              .insert({
                company_id: companyId
              });
          }

          const { error: deletePendingCompanyError } = await supabase
            .from("pending_companies")
            .delete()
            .eq("id", companyId);

          if (deletePendingCompanyError) {
            console.error("Error deleting company from pending_companies:", deletePendingCompanyError);
            return NextResponse.json(
              { message: "Failed to delete company from pending_companies", error: deletePendingCompanyError },
              { status: 500 }
            );
          }

          const { data: pendingBranches, error: pendingBranchesError } = await supabase
            .from("pending_branches")
            .select("*")
            .eq("company_id", companyId);

          if (pendingBranchesError) {
            console.error("Error fetching pending branches:", pendingBranchesError);
            return NextResponse.json(
              { message: "Failed to fetch pending branches", error: pendingBranchesError },
              { status: 500 }
            );
          } else if (pendingBranches && pendingBranches.length > 0) {
            const { error: registerBranchesError } = await supabase
              .from("registered_branches")
              .insert(pendingBranches);

            if (registerBranchesError) {
              console.error("Error moving branches to registered_branches:", registerBranchesError);
              return NextResponse.json(
                { message: "Failed to move branches to registered_branches", error: registerBranchesError },
                { status: 500 }
              );
            }

            const { error: deletePendingBranchesError } = await supabase
              .from("pending_branches")
              .delete()
              .eq("company_id", companyId);

            if (deletePendingBranchesError) {
              console.error("Error deleting branches from pending_branches:", deletePendingBranchesError);
              return NextResponse.json(
                { message: "Failed to delete branches from pending_branches", error: deletePendingBranchesError },
                { status: 500 }
              );
            }
          }
        }
      }
    }

    let branchId = formData.companyAssociation.branchId;

    if (!branchId || !isValidUUID(branchId)) {
      const { data: registeredBranch, error: registeredBranchError } = await supabase
        .from("registered_branches")
        .select("id")
        .eq("company_id", companyId)
        .eq("branch_name", capitalizeWords(formData.companyAssociation.companyBranch))
        .single();

      if (!registeredBranchError && registeredBranch) {
        branchId = registeredBranch.id;
      }
    }

    const { data: authData, error: authError } = await adminSupabase.auth.admin.createUser({
      email: formData.personalDetails.email,
      password: formData.personalDetails.password,
      user_metadata: { role: "employer" },
      email_confirm: true,
    });

    if (authError) {
      console.error("Error creating Supabase Auth user:", authError);
      return NextResponse.json(
        { message: "Failed to create user in auth", error: authError },
        { status: 500 }
      );
    }

    const userId = authData?.user?.id;
    if (!userId) {
      return NextResponse.json(
        { message: "User ID not returned from auth" },
        { status: 500 }
      );
    }

    const hashedPassword = await bcrypt.hash(formData.personalDetails.password, 10);

    const { data: employerData, error: employerError } = await supabase
      .from("registered_employers")
      .insert({
        user_id: userId, 
        first_name: capitalizeWords(formData.personalDetails.firstName),
        middle_name: formData.personalDetails.middleName ? capitalizeWords(formData.personalDetails.middleName) : null,
        last_name: capitalizeWords(formData.personalDetails.lastName),
        suffix: formData.personalDetails.suffix ? capitalizeWords(formData.personalDetails.suffix) : null,
        country_code: formData.personalDetails.countryCode,
        phone: formData.personalDetails.phone,
        email: formData.personalDetails.email,
        password: hashedPassword,
        company_id: companyId,
        branch_id: branchId,
        company_name: capitalizeWords(formData.companyAssociation.companyName),
        company_branch: capitalizeWords(formData.companyAssociation.companyBranch),
        company_role: capitalizeWords(formData.companyAssociation.companyRole),
        job_title: capitalizeWords(formData.companyAssociation.jobTitle),
        company_email: formData.companyAssociation.companyEmail,
        terms_accepted: formData.verificationDetails.termsAccepted,
        company_admin: companyJustCreated ? true : false,
      })
      .select()
    
    if (employerError) {
      console.error("Error inserting data into registered_employers:", employerError);
      return NextResponse.json(
        { message: "Failed to save employer data", error: employerError },
        { status: 500 }
      );
    }

    const employerId = employerData?.[0]?.id
    if (employerId) {
      const { error: profileError } = await supabase
        .from("employer_profile")
        .insert({
          employer_id: employerId,
          // Store hashed password, not plain
          password: hashedPassword
        })
      if (profileError) {
        console.error("Error inserting employer_profile:", profileError)
      }
    } else {
      console.error("No employerId found after insert into registered_employers")
    }

    console.log("New employer registered:", employerData);

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
