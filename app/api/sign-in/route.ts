import { NextResponse } from "next/server";
import supabase from "@/app/lib/supabase";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  const { email, password } = await request.json();

  const { data: employer, error } = await supabase
    .from("registered_employers")
    .select("*")
    .eq("email", email)
    .single();

  if (error || !employer) {
    return NextResponse.json(
      { message: "Invalid email or password" },
      { status: 401 }
    );
  }

  const passwordMatch = await bcrypt.compare(password, employer.password);
  if (!passwordMatch) {
    return NextResponse.json(
      { message: "Invalid email or password" },
      { status: 401 }
    );
  }
  return NextResponse.json({
    message: "Sign in successful",
    user: {
      id: employer.user_id,
      email: employer.email,
      role: "employer",
      firstName: employer.first_name,
      lastName: employer.last_name,
    },
  });
}
