import { NextRequest, NextResponse } from "next/server";
import supabase from "@/app/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { step, first_name, last_name, phone, email, password, country_code, company_name, company_branch, company_role, job_title, company_email, signature, terms_accepted } = body;

    const branchName = typeof company_branch === "string" ? company_branch : "test";

    if (step === 1) {
      const { data: existingRegistered, error: registeredError } = await supabase
        .from("registered_employers")
        .select("email")
        .eq("email", email);

      if (registeredError) {
        console.error("Error checking registered employers:", registeredError);
        return NextResponse.json({ message: "Error checking registered employers" }, { status: 500 });
      }

      if (existingRegistered && existingRegistered.length > 0) {
        return NextResponse.json(
          { message: "User with this email is already registered!" },
          { status: 400 }
        );
      }

      const { data: existingPending, error: pendingError } = await supabase
        .from("pending_employers")
        .select("email")
        .eq("email", email);

      if (pendingError) {
        console.error("Error checking pending employers:", pendingError);
        return NextResponse.json({ message: "Error checking pending employers" }, { status: 500 });
      }

      if (existingPending && existingPending.length > 0) {
        return NextResponse.json(
          { message: "User with this email is already pending approval!", type: "pending" },
          { status: 409 }
        );
      }

      const { data: newEmployer, error: insertError } = await supabase
        .from("pending_employers")
        .insert({
          first_name,
          last_name,
          phone,
          email,
          password,
          country_code,
        })
        .select()
        .single();

      if (insertError) {
        throw insertError;
      }

      return NextResponse.json(
        { message: "Step 1 complete", data: newEmployer },
        { status: 201 }
      );
    }

    if (step === 2) {
      const { data: updatedEmployer, error: updateError } = await supabase
        .from("pending_employers")
        .update({
          company_name,
          company_branch: branchName,
          company_role,
          job_title,
          company_email,
        })
        .eq("email", email)
        .select()
        .single();

      if (updateError) {
        throw updateError;
      }

      return NextResponse.json(
        { message: "Step 2 complete", data: updatedEmployer },
        { status: 200 }
      );
    }

    if (step === 3) {
      const { data: updatedEmployer, error: updateError } = await supabase
        .from("pending_employers")
        .update({
          signature,
          terms_accepted,
        })
        .eq("email", email)
        .select()
        .single();

      if (updateError) {
        throw updateError;
      }

      return NextResponse.json(
        { message: "Step 3 complete", data: updatedEmployer },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { message: "Invalid step" },
      { status: 400 }
    );
  } catch (error: unknown) {
    if (error instanceof Error) {
      if (error.message.includes("duplicate key value")) {
        return NextResponse.json(
          { message: "User with this email already exists!" },
          { status: 400 }
        );
      }

      return NextResponse.json(
        { message: "Something went wrong", error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "Unknown error occurred", error },
      { status: 500 }
    );
  }
}