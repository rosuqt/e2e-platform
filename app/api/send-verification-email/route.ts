import { NextResponse } from "next/server"
import nodemailer from "nodemailer"
import { getAdminSupabase } from "@/lib/supabase"
import { getVerificationEmailHtml } from "../../../lib/emailTemplates/verificationEmail"

const smtpConfig = {
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false, 
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
}

const fromEmail = process.env.SMTP_FROM

export async function POST(request: Request) {
  const { to, subject, firstName, employerId } = await request.json()
  if (!to || !employerId) {
    return NextResponse.json({ error: "Missing email or employerId" }, { status: 400 })
  }
  let baseUrl = process.env.NEXT_PUBLIC_BASE_URL
  if (!baseUrl) {
    const host = request.headers.get("host")
    baseUrl = host ? `http://${host}` : "http://localhost:3000"
  }
  const token = Buffer.from(`${employerId}:${Date.now()}`).toString("base64")
  const verifyUrl = `${baseUrl}/api/send-verification-email?token=${encodeURIComponent(token)}`
  const transporter = nodemailer.createTransport(smtpConfig)
  const html = getVerificationEmailHtml(verifyUrl, firstName)
  await transporter.sendMail({
    from: fromEmail,
    to,
    subject: subject || "Verify your email address",
    html,
  })
  return NextResponse.json({ success: true })
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const token = searchParams.get("token")
  if (!token) {
    return new Response("Invalid verification link.", { status: 400 })
  }
  const decoded = Buffer.from(token, "base64").toString("utf-8")
  const [employerId] = decoded.split(":")
  if (!employerId) {
    return new Response("Invalid verification link.", { status: 400 })
  }
  const adminSupabase = getAdminSupabase()
  const { data: employerData, error: employerError } = await adminSupabase
    .from("registered_employers")
    .select("company_name")
    .eq("id", employerId)
    .single()
  if (employerError || !employerData?.company_name) {
    return new Response("Failed to find employer company.", { status: 500 })
  }
  const { error: updateEmployerError } = await adminSupabase
    .from("registered_employers")
    .update({ verify_status: "standard" })
    .eq("id", employerId)
  const { error: updateCompanyError } = await adminSupabase
    .from("registered_companies")
    .update({ verify_status: "standard" })
    .eq("company_name", employerData.company_name)
  if (updateEmployerError || updateCompanyError) {
    return new Response("Failed to update verification status.", { status: 500 })
  }
  const response = new Response(
    `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Email Verified - Seekr</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <script src="https://cdnjs.cloudflare.com/ajax/libs/lottie-web/5.12.2/lottie.min.js"></script>
  <style>
    body {
      background: linear-gradient(135deg, #2563eb 0%, #2563eb 100%);
      margin: 0;
      padding: 0;
      font-family: 'Segoe UI', 'Roboto', Arial, sans-serif;
      color: #222;
      min-height: 100vh;
    }
    .container {
      max-width: 480px;
      margin: 64px auto;
      background: #fff;
      border-radius: 18px;
      box-shadow: 0 8px 32px rgba(37,99,235,0.08);
      padding: 24px 32px 24px 32px;
      text-align: center;
      border: 1px solid #e5e7eb;
      position: relative;
    }
    .lottie-check {
      width: 120px;
      height: 120px;
      margin: 0 auto 0 auto;
      background: none;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .title {
      font-size: 2.2rem;
      font-weight: 800;
      color: #2563eb;
      margin-bottom: 12px;
      margin-top: 0;
      letter-spacing: 1px;
    }
    .subtitle {
      font-size: 1.1rem;
      color: #222;
      margin-bottom: 18px;
      margin-top: 0;
    }
    .highlight {
      color: #ff9900;
      font-weight: 700;
    }
    .btn {
      display: inline-block;
      background: #2563eb;
      color: #fff !important;
      text-decoration: none;
      border-radius: 8px;
      font-weight: 700;
      font-size: 1rem;
      padding: 14px 38px;
      margin-top: 28px;
      box-shadow: 0 2px 8px rgba(37,99,235,0.08);
      letter-spacing: 1px;
      transition: background 0.2s;
    }
    .btn:hover {
      background: #1e40af;
    }
    .footer {
      margin-top: 32px;
      font-size: 0.95rem;
      color: #2563eb;
      opacity: 0.8;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="lottie-check" id="lottie-check"></div>
    <div class="title">Email Verified!</div>
    <div class="subtitle">
      Your account has been upgraded to <span class="highlight">Standard Verification</span>. Please sign in again to enjoy your updated access and features.
    </div>
    <a href="/sign-in" class="btn">Go to Seekr</a>
    <div class="footer">
      &copy; 2025 Seekr. All rights reserved.
    </div>
  </div>
  <script>
    document.addEventListener("DOMContentLoaded", function() {
      if (window.lottie) {
        window.lottie.loadAnimation({
          container: document.getElementById("lottie-check"),
          renderer: "svg",
          loop: false,
          autoplay: true,
          path: "/animations/check.json"
        });
      }
    });
  </script>
</body>
</html>
    `,
    {
      status: 200,
      headers: {
        "Content-Type": "text/html",
        "Set-Cookie": [
          `next-auth.session-token=deleted; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; SameSite=Lax`,
          `next-auth.callback-url=deleted; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; SameSite=Lax`,
          `__Secure-next-auth.session-token=deleted; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; SameSite=Lax`
        ].join(", ")
      }
    }
  )
  return response
}
