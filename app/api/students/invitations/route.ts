import { NextRequest, NextResponse } from "next/server"
import supabase from "@/lib/supabase"

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const invitationId = searchParams.get("invitation_id")

  if (!invitationId) {
    return NextResponse.json({ error: "Missing invitation_id" }, { status: 400 })
  }

  // Define types for the related tables
  type JobPosting = {
    id: string
    job_title: string
  }
  type RegisteredEmployer = {
    id: string
    first_name: string
    last_name: string
    company_name: string
    company_logo: string
  }
  type InvitationData = {
    id: string
    student_id: string
    employer_id: string
    job_id: string
    status: string
    invited_at: string
    message: string
    is_favorite: boolean
    job_postings: JobPosting | JobPosting[] | null
    registered_employers: RegisteredEmployer | RegisteredEmployer[] | null
  }

  // Fetch invitation with job, employer, and student details
  const { data, error } = await supabase
      .from("job_invitations")
      .select(`
      id,
      student_id,
      employer_id,
      job_id,
      status,
      invited_at,
      message,
      is_favorite,
      job_postings (
        id,
        job_title
      ),
      registered_employers (
        id,
        first_name,
        last_name,
        company_name,
        company_logo
      )
    `)
      .eq("id", invitationId)
      .maybeSingle<InvitationData>() // add generic type for type safety

  if (error || !data) {
    return NextResponse.json({ error: error?.message || "Invitation not found" }, { status: 404 })
  }

  // Compose response
  const invitation = {
    id: data.id,
    student_id: data.student_id,
    employer_id: data.employer_id,
    job_id: data.job_id,
    status: data.status,
    invited_at: data.invited_at,
    message: data.message,
    is_favorite: data.is_favorite,
    job_title: Array.isArray(data.job_postings) ? data.job_postings[0]?.job_title || "" : data.job_postings?.job_title || "",
    employer_first_name: Array.isArray(data.registered_employers) ? data.registered_employers[0]?.first_name || "" : data.registered_employers?.first_name || "",
    employer_last_name: Array.isArray(data.registered_employers) ? data.registered_employers[0]?.last_name || "" : data.registered_employers?.last_name || "",
    company_name: Array.isArray(data.registered_employers) ? data.registered_employers[0]?.company_name || "" : data.registered_employers?.company_name || "",
    company_logo: Array.isArray(data.registered_employers) ? data.registered_employers[0]?.company_logo || "" : data.registered_employers?.company_logo || "",
  }

  return NextResponse.json({ invitation })
}
