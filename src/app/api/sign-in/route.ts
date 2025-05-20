//old route for sign in

import { NextResponse } from "next/server";
import supabase from "@/app/lib/supabase";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    const { data: user, error } = await supabase
      .from("registered_employers")
      .select("id, email, password")
      .eq("email", email)
      .single();

    if (error || !user) {
      console.log("User not found for email:", email);
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    const isPasswordValid = bcrypt.compareSync(password, user.password);
    if (!isPasswordValid) {
      console.log("Password mismatch for user:", email);
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET!, { expiresIn: "1h" });

    console.log("Sign-in successful for user:", email);
    return NextResponse.json({
      message: "Sign-in successful",
      token,
      user: { id: user.id, email: user.email },
    });
  } catch (error) {
    console.error("Sign-in error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
