/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server"
import { getAdminSupabase } from "@/lib/supabase"

export async function GET(req: NextRequest) {
  const supabase = getAdminSupabase()
  const student_id = req.nextUrl.searchParams.get("student_id")
  if (!student_id) {
    return NextResponse.json({ error: "student_id is required" }, { status: 400 })
  }

  const { data: resumeData, error: resumeError } = await supabase
    .from("parsed_resumes")
    .select("*")
    .eq("student_id", student_id)
    .order("parsed_at", { ascending: false })
    .limit(1)

  if (resumeError) {
    return NextResponse.json({ error: "Failed to fetch parsed resume", details: resumeError }, { status: 500 })
  }

  if (!resumeData || resumeData.length === 0) {
    return NextResponse.json({ suggestions: { skills: [], experience: [], certificates: [], bio: "", educations: [] } })
  }

  const row = resumeData[0]
  console.log("resume row:", row);

  const expertiseArr = row.parsed_expertise;

  console.log("parsed_expertise parsed:", expertiseArr);

  const skillsArr = row.parsed_skills;
  const experienceArr = row.parsed_experience;
  const certificatesArr = row.parsed_certificates;
  const educationsArr = row.parsed_education;

  const skills = Array.isArray(skillsArr)
    ? skillsArr.map((s: any) => typeof s === "string" ? s : s.name || "")
    : [];
  const experience = Array.isArray(experienceArr)
    ? experienceArr.filter((e: any) =>
        typeof e === "object" &&
        e !== null &&
        ("jobTitle" in e || "company" in e || "years" in e)
      )
    : [];
  const certificates = Array.isArray(certificatesArr)
    ? certificatesArr.map((c: any) => ({
        title: c.title || "",
        issuer: c.issuer || "",
        description: c.description || ""
      }))
    : [];
  const bio = row.summary || "";

  const educations = Array.isArray(educationsArr)
    ? educationsArr.map((e: any) => ({
        level: e.level || "",
        years: e.years || "",
        degree: e.degree || "",
        school: e.school || "",
        acronym: e.acronym || ""
      }))
    : [];

  const expertise = Array.isArray(expertiseArr)
    ? expertiseArr
        .map((e: any) => typeof e === "string" ? e : e.name)
        .filter((name: any) => typeof name === "string" && name.length > 0)
    : [];
  console.log("expertise mapped:", expertise);

  return NextResponse.json({ suggestions: { skills, experience, certificates, bio, educations, expertise } })
}