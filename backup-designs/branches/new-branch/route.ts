import { NextRequest, NextResponse } from "next/server";
import supabase from "@/app/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const {
      branchName,
      branchPhone,
      branchEmailDomain,
      address: { country, city, street, province, exactAddress },
      companyId,
    } = await req.json();

    const normalizedBranchName = branchName.trim().toLowerCase();

    // Check if the branch is already pending
    const { data: existingPending, error: pendingError } = await supabase
      .from("pending_branches")
      .select("*")
      .eq("branch_name", normalizedBranchName)
      .eq("company_id", companyId);

    if (pendingError) {
      console.error("Error checking pending branches:", pendingError); // Log the exact error
      return NextResponse.json(
        { message: "Error checking pending branches", details: pendingError.message },
        { status: 500 }
      );
    }

    if (existingPending && existingPending.length > 0) {
      return NextResponse.json(
        { message: "A branch with this name is already pending for this company." },
        { status: 409 }
      );
    }

    // Insert the new branch into the pending_branches table
    const { data: newBranch, error: insertError } = await supabase
      .from("pending_branches")
      .insert({
        company_id: companyId,
        branch_name: normalizedBranchName,
        branch_phone: branchPhone,
        email_domain: branchEmailDomain,
        country,
        city,
        street,
        province,
        exact_address: exactAddress,
        main_branch: false, // Ensure main_branch is set to false
      })
      .select()
      .single();

    if (insertError) {
      console.error("Error inserting new branch:", insertError); // Log the exact error
      return NextResponse.json({ message: "Error creating branch.", details: insertError.message }, { status: 500 });
    }

    return NextResponse.json({ branch: newBranch }, { status: 200 });
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error creating branch:", error.message); // Log the error message
      return NextResponse.json(
        { message: "Error creating branch.", details: error.message },
        { status: 500 }
      );
    } else {
      console.error("Unexpected error:", error); // Log unexpected errors
      return NextResponse.json(
        { message: "An unexpected error occurred." },
        { status: 500 }
      );
    }
  }
}
