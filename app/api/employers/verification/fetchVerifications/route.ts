import { NextResponse } from 'next/server';
import { getAdminSupabase } from '@/lib/supabase';

export async function GET() {
  const supabase = getAdminSupabase();
  const { data, error } = await supabase
    .from('employer_verifications')
    .select('*');

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const verifications = await Promise.all(
    (data ?? []).map(async (verification) => {
      const { data: signed, error: signedError } = await supabase
        .storage
        .from('employer.documents')
        .createSignedUrl(verification.file_path, 60 * 60 * 24); // 1 day

      return {
        ...verification,
        signed_url: signed?.signedUrl ?? null,
        signed_url_error: signedError?.message ?? null,
      };
    })
  );

  return NextResponse.json({ verifications });
}
