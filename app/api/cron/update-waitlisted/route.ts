import { getAdminSupabase } from '@/lib/supabase'

const supabase = getAdminSupabase()

export async function GET(req: Request) {
  const auth = req.headers.get('authorization')

  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', { status: 401 })
  }

  const { error } = await supabase.rpc('auto_update_waitlisted')
  if (error) return Response.json({ success: false, error })

  return Response.json({ success: true })
}
