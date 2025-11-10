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

  return new Response(JSON.stringify(data?.[0] || null), { status: 200 });
}
