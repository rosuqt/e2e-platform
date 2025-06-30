import { NextRequest, NextResponse } from 'next/server'
import { Pool } from 'pg'
import { promises as fs } from 'fs'
import path from 'path'

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
  const cover_letter = form.get('cover_letter') as string

  let resumeUrl: string | null = null
  const resume = form.get('resume')
  if (resume && typeof resume === 'object' && 'arrayBuffer' in resume) {
    const buffer = Buffer.from(await resume.arrayBuffer())
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'resumes')
    await fs.mkdir(uploadsDir, { recursive: true })
    const filename = `${Date.now()}-${resume.name}`
    const filepath = path.join(uploadsDir, filename)
    await fs.writeFile(filepath, buffer)
    resumeUrl = `/uploads/resumes/${filename}`
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
        resumeUrl,
        cover_letter,
      ]
    )
    return NextResponse.json({ success: true, application: result.rows[0] }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 })
  }
}