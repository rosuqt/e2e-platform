import { getAdminSupabase } from '@/lib/supabase'

const supabase = getAdminSupabase()

export async function GET() {
  const { error } = await supabase.rpc('auto_update_waitlisted')
  if (error) return Response.json({ success: false, error })
  return Response.json({ success: true })
}
