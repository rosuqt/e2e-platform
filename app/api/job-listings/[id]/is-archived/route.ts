import { NextRequest, NextResponse } from 'next/server';
import { getAdminSupabase } from '@/lib/supabase';

export async function PATCH(request: NextRequest) {
  try {
    const supabase = getAdminSupabase();
    let isArchived = true;
    try {
      const body = await request.json();
      isArchived = body.is_archived ?? true;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      isArchived = true;
    }

    const urlParts = request.nextUrl.pathname.split('/');
    const id = urlParts[urlParts.length - 3];

    const { data, error } = await supabase
      .from('job_postings')
      .update({ is_archived: isArchived })
      .eq('id', id)
      .select();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    if (!data || data.length === 0) {
      return NextResponse.json({ error: 'Job posting not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: data[0] });
  } catch (err) {
    console.error('Error archiving job:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
