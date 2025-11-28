import { NextRequest, NextResponse } from 'next/server'
import { Pool } from 'pg'
import { getAdminSupabase } from '@/../src/lib/supabase'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
})

export async function POST(req: NextRequest) {
  const form = await req.formData()
  const career_id = form.get('career_id') as string
  const first_name = form.get('first_name') as string
  const last_name = form.get('last_name') as string
  const middle_name = form.get('middle_name') as string
  const suffix = form.get('suffix') as string
  const email = form.get('email') as string
  const country_code = form.get('country_code') as string
  const phone = form.get('phone') as string

  let resume_path: string | null = null
  let cover_letter_path: string | null = null

  const supabase = getAdminSupabase()

  const resume = form.get('resume')
  if (resume && typeof resume === 'object' && 'arrayBuffer' in resume) {
    const buffer = Buffer.from(await resume.arrayBuffer())
    const ext = resume.name.split('.').pop()
    const safeFirst = first_name.replace(/[^a-zA-Z0-9]/g, "")
    const safeLast = last_name.replace(/[^a-zA-Z0-9]/g, "")
    const filename = `${safeFirst}_${safeLast}_RESUME.${ext}`
    const path = `sti-hiring/${career_id}/resume/${filename}`
    const { error } = await supabase.storage.from("application.records").upload(path, buffer, {
      upsert: true,
      cacheControl: "3600",
      contentType: resume.type
    })
    if (error) throw new Error(error.message)
    resume_path = filename
  }

  const coverLetter = form.get('coverLetter')
  if (coverLetter && typeof coverLetter === 'object' && 'arrayBuffer' in coverLetter) {
    const buffer = Buffer.from(await coverLetter.arrayBuffer())
    const ext = coverLetter.name.split('.').pop()
    const safeFirst = first_name.replace(/[^a-zA-Z0-9]/g, "")
    const safeLast = last_name.replace(/[^a-zA-Z0-9]/g, "")
    const filename = `${safeFirst}_${safeLast}_COVERLETTER.${ext}`
    const path = `sti-hiring/${career_id}/cover_letter/${filename}`
    const { error } = await supabase.storage.from("application.records").upload(path, buffer, {
      upsert: true,
      cacheControl: "3600",
      contentType: coverLetter.type
    })
    if (error) throw new Error(error.message)
    cover_letter_path = filename
  }

  try {
    const result = await pool.query(
      `INSERT INTO public.sti_applications (
        career_id, first_name, last_name, middle_name, suffix, email, country_code, phone, resume, cover_letter
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
      RETURNING id, created_at`,
      [
        career_id,
        first_name,
        last_name,
        middle_name,
        suffix,
        email,
        country_code,
        phone,
        resume_path,
        cover_letter_path,
      ]
    )
    return NextResponse.json({ success: true, application: result.rows[0] }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 })
  }
}