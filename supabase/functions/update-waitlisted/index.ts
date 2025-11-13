// import { serve } from "https://deno.land/std@0.203.0/http/server.ts";
// import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// serve(async (req) => {
//   const supabase = createClient(
//     Deno.env.get("SUPABASE_URL")!,
//     Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
//   );

//   // Get all interviews in the past
//   const today = new Date();
//   const { data: interviews, error } = await supabase
//     .from("interview_schedules")
//     .select("application_id, date, time")
//     .not("application_id", "is", null);

//   if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500 });

//   let updated = 0;
//   for (const interview of interviews || []) {
//     const interviewDateTime = new Date(`${interview.date}T${interview.time}`);
//     if (interviewDateTime < today) {

//       const { data: application, error: appError } = await supabase
//         .from("applications")
//         .select("application_id, student_id, job_id")
//         .eq("application_id", interview.application_id)
//         .single();

//       if (appError || !application) continue;

//       let employer_id: string | null = null;
//       if (application.job_id) {
//         const { data: job, error: jobError } = await supabase
//           .from("job_postings")
//           .select("employer_id")
//           .eq("id", application.job_id)
//           .single();
//         if (!jobError && job && job.employer_id) {
//           employer_id = job.employer_id;
//         }
//       }

//       const { error: updateError } = await supabase
//         .from("applications")
//         .update({ status: "waitlisted" })
//         .eq("application_id", interview.application_id)
//         .neq("status", "waitlisted");
//       if (!updateError) {
//         await supabase
//           .from("activity_log")
//           .insert([{
//             application_id: interview.application_id,
//             student_id: application.student_id,
//             employer_id: employer_id,
//             type: "waitlisted",
//             message: "Application was waitlisted after interview date passed."
//           }]);
//         updated++;
//       }
//     }
//   }

//   return new Response(JSON.stringify({ updated }), { status: 200 });
// });