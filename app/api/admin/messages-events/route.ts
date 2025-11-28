import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../lib/authOptions";
import supabase from "@/lib/supabase";
export async function GET() {
  try {
    // Fetch from multiple tables in parallel
    const [studentsRes, employersRes, adminsRes] = await Promise.all([
      supabase.from("registered_students").select("id, first_name, last_name"),
      supabase.from("registered_employers").select("id, first_name, last_name"),
      supabase.from("registered_admins").select("id, first_name, last_name"),
    ]);

    // Check for errors
    if (studentsRes.error || employersRes.error || adminsRes.error) {
      throw new Error(
        studentsRes.error?.message ||
        employersRes.error?.message ||
        adminsRes.error?.message
      );
    }

    // Return combined JSON
    return NextResponse.json({
      students: studentsRes.data,
      employers: employersRes.data,
      admins: adminsRes.data,
    })
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : String(err)
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    const user1_id = session?.user?.adminID

    const { user2_id } = await req.json()
    if (!user2_id)
      return new Response(JSON.stringify({ error: 'Missing chosen user ID' }), { status: 400 })

    // Check for existing conversation
    const { data: existing, error: checkError } = await supabase
      .from('messages')
      .select('*')
      .or(`and(user1_id.eq.${user1_id},user2_id.eq.${user2_id}),and(user1_id.eq.${user2_id},user2_id.eq.${user1_id})`)
      .limit(1)

    if (checkError) throw checkError

    if (existing && existing.length > 0) {
      return new Response(
        JSON.stringify({ message: 'Conversation already exists', data: existing[0] }),
        { status: 200 }
      )
    }

    // Insert new conversation
    const { data, error } = await supabase
      .from('messages')
      .insert([{ user1_id, user2_id }])
      .select()

    if (error) throw error

    return new Response(JSON.stringify({ success: true, data }), { status: 200 })
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : String(err)
    console.error(err)
    return new Response(JSON.stringify({ error: errorMsg }), { status: 500 })
  }
}






