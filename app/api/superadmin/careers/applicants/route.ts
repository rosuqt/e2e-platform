import { NextResponse } from "next/server"
import { Pool } from "pg"
import { getAdminSupabase } from "@/../src/lib/supabase"

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
})

export async function GET() {
  const { rows } = await pool.query(`
    SELECT
      a.*,
      c.position_title,
      c.department
    FROM public.sti_applications a
    LEFT JOIN public.sti_careers c ON a.career_id = c.id
    ORDER BY a.created_at DESC
  `)
  console.log("DB rows:", rows)
  const supabase = getAdminSupabase()
  const applicants = await Promise.all(
    rows.map(async (row) => {
      let resume_url = null
      let cover_letter_url = null
      // Only generate signed URL if resume is a filename (not a path or null)
      if (
        row.resume &&
        typeof row.resume === "string" &&
        !row.resume.startsWith("/uploads/")
      ) {
        // Use the full path used in upload, not just filename
        const path = `sti-hiring/${row.career_id}/resume/${row.resume}`
        const { data, error } = await supabase.storage.from("application.records").createSignedUrl(
          path,
          60 * 60 * 24
        )
        resume_url = error || !data?.signedUrl ? null : data.signedUrl
      }
      if (
        row.cover_letter &&
        typeof row.cover_letter === "string" &&
        !row.cover_letter.startsWith("/uploads/")
      ) {
        const path = `sti-hiring/${row.career_id}/cover_letter/${row.cover_letter}`
        const { data, error } = await supabase.storage.from("application.records").createSignedUrl(
          path,
          60 * 60 * 24
        )
        cover_letter_url = error || !data?.signedUrl ? null : data.signedUrl
      }
      return {
        ...row,
        resume_url,
        cover_letter_url,
      }
    })
  )
  return NextResponse.json({ data: applicants })
}
