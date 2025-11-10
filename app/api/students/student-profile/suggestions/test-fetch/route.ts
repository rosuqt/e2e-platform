/* eslint-disable @typescript-eslint/no-explicit-any */
import supabase from "@/lib/supabase";

export async function GET() {
  const { data, error } = await supabase
    .from("parsed_resumes")
    .select("*")
    .order("parsed_at", { ascending: false })
    .limit(1);

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }

  const row = data?.[0];
  if (!row) {
    return new Response(JSON.stringify(null), { status: 200 });
  }

  const skills = Array.isArray(row.parsed_skills)
    ? row.parsed_skills.map((s: any) => typeof s === "string" ? s : s.name || "")
    : [];
  const experience = Array.isArray(row.parsed_experience)
    ? row.parsed_experience.map((e: any) => {
        if (typeof e === "string") return e;
        if (e.title && e.company) return `${e.title} — ${e.company}`;
        if (e.title) return e.title;
        if (e.company) return e.company;
        return JSON.stringify(e);
      })
    : [];
  const certificates = Array.isArray(row.parsed_certificates)
    ? row.parsed_certificates.map((c: any) => ({
        title: c.title || "",
        issuer: c.issuer || "",
        description: c.description || ""
      }))
    : [];
  const bio = row.summary || "";

  return new Response(
    JSON.stringify({ skills, experience, certificates, bio }),
    { status: 200 }
  );
}
