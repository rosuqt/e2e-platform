import { NextRequest, NextResponse } from "next/server"
import supabase from "@/lib/supabase"

type JobPosting = {
  id: string | number
  employer_id?: string | number
  [key: string]: unknown
}

type Application = {
  id: string | number
  job_id?: string | number
  status?: string
  applied_at?: string
  [key: string]: unknown
}

type ApplicationResult = Application & {
  job_posting: JobPosting | null
  company_name: string | null
  companyName: string | null
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const student_id = searchParams.get("student_id")
   // console.log("Received student_id:", student_id)
    if (!student_id) {
      //console.log("Missing student_id")
      return NextResponse.json({ error: "Missing student_id" }, { status: 400 })
    }
    const { data: applications, error } = await supabase
      .from("applications")
      .select("*")
      .eq("student_id", student_id)
      .order("applied_at", { ascending: false })
    //console.log("Applications query result:", applications, "Error:", error)
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    const results: ApplicationResult[] = []
    for (const app of applications || []) {
      let job_posting: JobPosting | null = null
      let company_name: string | null = null
      let job_title: string | null = null
      let company_logo_image_path: string | null = null
      //console.log("Application ID:", app.id, "Status:", app.status, "Company (job_id):", app.job_id)
      if (app.job_id) {
        const { data: jobData, error: jobError } = await supabase
          .from("job_postings")
          .select("*, employer_id, job_title")
          .eq("id", app.job_id)
          .maybeSingle()
        //console.log("Job posting for job_id", app.job_id, ":", jobData, "Error:", jobError)
        if (!jobError && jobData) {
          job_posting = jobData
          job_title = jobData.job_title || null
          if (jobData.employer_id) {
            const { data: employerData, error: employerError } = await supabase
              .from("registered_employers")
              .select("company_name")
              .eq("id", jobData.employer_id)
              .maybeSingle()
            //console.log("Employer for employer_id", jobData.employer_id, ":", employerData, "Error:", employerError)
            if (!employerError && employerData) {
              company_name = employerData.company_name || null
              if (company_name) {
                const { data: companyData, error: companyError } = await supabase
                  .from("registered_companies")
                  .select("company_logo_image_path, company_name")
                  .ilike("company_name", company_name)
                  .maybeSingle()
                if (!companyError && companyData && companyData.company_name === company_name) {
                  company_logo_image_path = companyData.company_logo_image_path || null
                } else {
                  company_logo_image_path = null
                }
              }
            }
          }
        }
      }
      results.push({
        ...app,
        job_posting,
        company_name,
        companyName: company_name,
        job_title,
        company_logo_image_path,
      })
    }
    //console.log("Final results:", results)
    return NextResponse.json(results)
  } catch (err) {
    console.error("fetchOJTProgress error:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
