import { serve } from "https://deno.land/std@0.203.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

serve(async (req) => {
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  // Get all interviews in the past
  const today = new Date();
  const { data: interviews, error } = await supabase
    .from("interview_schedules")
    .select("application_id, date, time")
    .not("application_id", "is", null);

  if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500 });

  let updated = 0;
  for (const interview of interviews || []) {
    const interviewDateTime = new Date(`${interview.date}T${interview.time}`);
    if (interviewDateTime < today) {
      const { error: updateError } = await supabase
        .from("applications")
        .update({ status: "waitlisted" })
        .eq("application_id", interview.application_id)
        .neq("status", "waitlisted");
      if (!updateError) updated++;
    }
  }

  return new Response(JSON.stringify({ updated }), { status: 200 });
});