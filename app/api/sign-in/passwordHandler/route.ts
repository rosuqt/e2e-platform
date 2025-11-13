import { NextRequest, NextResponse } from "next/server";
import supabase from "@/lib/supabase";
import { sendPasswordResetEmail } from "@/lib/email";

// Note: This endpoint only sends the reset link. The password is updated
// when the user submits the new password on the /reset-password page
// using supabase.auth.updateUser({ password }) on the client.

export async function POST(req: NextRequest) {
  const { email } = await req.json();

  if (!email) {
    return NextResponse.json({ error: "Email is required" }, { status: 400 });
  }

  const { data: user, error: userError } = await supabase
    .from("registered_employers")
    .select("id")
    .eq("email", email.toLowerCase())
    .single();

  if (userError || !user) {
    return NextResponse.json({ error: "No account found with this email address" }, { status: 404 });
  }

  const { data, error } = await supabase.auth.admin.generateLink({
    type: "recovery",
    email: email.toLowerCase(),
    options: {
      redirectTo: process.env.NEXT_PUBLIC_PASSWORD_RESET_REDIRECT_URL,
    },
  });

  type GenerateLinkData = {
    action_link?: string;
    properties?: { action_link?: string };
    [key: string]: unknown;
  };

  const linkData = data as GenerateLinkData;
  const actionLink = linkData.action_link || linkData.properties?.action_link;

  console.log("Generated password reset link:", actionLink); // Debug: log the link

  if (error || !actionLink) {
    return NextResponse.json({ error: "Failed to generate reset link" }, { status: 500 });
  }

  const sent = await sendPasswordResetEmail(email, actionLink);

  if (!sent) {
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
