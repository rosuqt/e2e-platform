import { NextRequest, NextResponse } from "next/server";
import supabase from "@/app/lib/supabase";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, terms_accepted } = body;

    if (!email || typeof terms_accepted !== "boolean") {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const { data: updatedEmployer, error: updateError } = await supabase
      .from("pending_employers")
      .update({ terms_accepted })
      .eq("email", email)
      .select()
      .single();

    if (updateError) {
      throw updateError;
    }

    if (!updatedEmployer) {
      return NextResponse.json({ error: "Pending employer not found" }, { status: 404 });
    }

    const hashedPassword = await bcrypt.hash(updatedEmployer.password, 10);
    updatedEmployer.password = hashedPassword;

    const { error: insertError } = await supabase
      .from("registered_employers")
      .insert(updatedEmployer);

    if (insertError) {
      throw insertError;
    }

    const { error: deleteError } = await supabase
      .from("pending_employers")
      .delete()
      .eq("email", email);

    if (deleteError) {
      throw deleteError;
    }

    return NextResponse.json({ message: "Employer registered successfully" }, { status: 200 });
  } catch (err: unknown) {
    console.error("Signup error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
