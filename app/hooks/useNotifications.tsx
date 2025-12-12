/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { RiRobot2Fill } from 'react-icons/ri';
import { useSession } from "next-auth/react";
import supabase from '../../src/lib/supabase'

function getActivityLogContent(payload: any, name: string, jobTitle: string) {
  const key = (payload.new.status ?? payload.new.type)?.toLowerCase() || "default";

  switch (key) {
    case "new":
    case "applications":
      return {
        title: `New Applicant ${name}`,
        description: `${name} has applied for ${jobTitle}. Check out their application!`,
      }
    case "shortlisted":
      return {
        title: `Applicant Shortlisted ${name}`,
        description: `${name} has been shortlisted for ${jobTitle}. Consider scheduling an interview!`,
      }
    case "interview":
      return {
        title: `Interview Scheduled ${name}`,
        description: `${name} has been scheduled for an interview for ${jobTitle}. Get ready to meet them!`,
      }
    case "waitlisted":
      return {
        title: `Interview Completed ${name}`,
        description: `${name} has completed their interview for ${jobTitle}. You can send an offer now!`,
      }
    case "offer_updated":
      return {
        title: `Offer Updated ${name}`,
        description: `The offer for ${name} has been updated for ${jobTitle}. Check the latest details!`,
      }
    case "offer sent":
    case "job_offers":
      return {
        title: `Offer Sent ${name}`,
        description: `An offer has been sent to ${name} for ${jobTitle}. Awaiting their response.`,
      }
    case "hired":
      return {
        title: `Applicant Hired ${name}`,
        description: `${name} has been successfully hired for ${jobTitle}. Congratulations!`,
      }
    case "rejected":
      return {
        title: `Applicant Rejected ${name}`,
        description: `${name} has been rejected for ${jobTitle}. You can move to the next candidate.`,
      }
    case "event_reminder":
      return {
        title: `Interview Tomorrow ${name}`,
        description: payload.new.message,
      }
    case "event_today":
      return {
        title: `Interview Today ${name}`,
        description: payload.new.message,
      }
    default:
      return {
        title: payload.new.title || (payload.new.user_name || "Activity"),
        description: payload.new.message,
      }
  }
}

export function useNotifications() {
  const { data: session } = useSession();
  const employerId = session?.user?.employerId || session?.user?.company_id;
  const studentIdSession = session?.user?.studentId;

  useEffect(() => {
    const channel = supabase
      .channel('realtime-notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'test_cases'
        },
        (payload) => {
          if (payload.new.employer_id && employerId && payload.new.employer_id !== employerId) return;

          toast.custom((t) => (
            <div
              className={`${
                t.visible ? 'animate-spring-in-left' : 'animate-spring-out-right'
              }`}
              style={{
                background: '#181028',
                color: '#fff',
                borderRadius: 10,
                padding: '18px 22px 12px 18px',
                minWidth: 320,
                boxShadow: '0 2px 12px #0004',
                border: '2px solid #a259ff',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                gap: 8
              }}
            >
              <div style={{
                position: 'absolute',
                top: 5,
                right: 8,
                zIndex: 2,
                display: 'flex',
                alignItems: 'center',
                gap: 12
              }}>
                <button
                  onClick={() => toast.dismiss(t.id)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#fff',
                    fontSize: 18,
                    cursor: 'pointer',
                    padding: 0,
                    lineHeight: 1,
                  }}
                  aria-label="Close"
                >
                  ×
                </button>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <RiRobot2Fill size={28} style={{ color: '#a259ff' }} />
                <div>
                  <div style={{ fontWeight: 600, color: '#fff' }}>
                    New issue submitted by {payload.new.tester_name}
                  </div>
                  <div style={{ fontSize: 14, opacity: 0.85, color: '#d1b3ff', marginTop: 2 }}>
                    {payload.new.issue_title}
                  </div>
                </div>
              </div>
              <div style={{
                display: 'flex',
                justifyContent: 'flex-end',
                alignItems: 'center',
                marginTop: 10
              }}>
                <a
                  href="/feedback/ally"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: '#a259ff',
                    background: 'none',
                    border: 'none',
                    padding: 0,
                    fontWeight: 600,
                    fontSize: 15,
                    textDecoration: 'none',
                    cursor: 'pointer'
                  }}
                >
                  View Issue
                </a>
              </div>
            </div>
          ), { duration: 5000, position: "bottom-right" });
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'activity_log'
        },
        async (payload) => {
          if (
            (!payload.new.employer_id || !employerId || payload.new.employer_id !== employerId) &&
            (!payload.new.student_id || !studentIdSession || payload.new.student_id !== studentIdSession)
          ) return;

          let avatarUrl = "/default-avatar.png";
          let name = "";
          let jobTitle = "";

          const studentId = payload.new.student_id;
          const jobId = payload.new.job_id;

          if (studentId) {
            const { data: student, error: studentError } = await supabase
              .from('registered_students')
              .select('first_name, last_name')
              .eq('id', studentId) 
              .single();
            console.log('Student fetch:', { student, studentError, studentId });
            if (!studentError && student) {
              name = `${student.first_name ?? ""} ${student.last_name ?? ""}`.trim();
            }
          }
          if (!name) {
            name = payload.new.applicant_name || payload.new.user_name || "";
          }

          if (studentId) {
            const { data: profile, error } = await supabase
              .from('student_profile')
              .select('profile_img')
              .eq('student_id', studentId)
              .single();
            if (!error && profile?.profile_img) {
              try {
                const res = await fetch('/api/students/get-signed-url', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    bucket: 'user.avatars',
                    path: profile.profile_img,
                  }),
                });
                const { signedUrl } = await res.json();
                if (signedUrl) avatarUrl = signedUrl;
              } catch (e) {
     
              }
            }
          }

          if (jobId) {
            const { data: job, error: jobError } = await supabase
              .from('job_postings')
              .select('job_title')
              .eq('id', jobId)
              .single();
            console.log('Job fetch:', { job, jobError, jobId });
            if (!jobError && job) {
              jobTitle = job.job_title;
            }
          }

          const { title, description } = getActivityLogContent(payload, name, jobTitle);

          toast.custom((t) => (
            <div
              className={`${
                t.visible ? 'animate-spring-in-left' : 'animate-spring-out-right'
              } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
            >
              <div className="flex-1 w-0 p-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0 pt-0.5">
                    <img
                      className="h-10 w-10 rounded-full"
                      src={avatarUrl}
                      alt=""
                    />
                  </div>
                  <div className="ml-3 flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      {title}
                    </p>
                    <p className="mt-1 text-sm text-gray-500">
                      {description}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex border-l border-gray-200">
                <button
                  onClick={() => toast.dismiss(t.id)}
                  className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  Close
                </button>
              </div>
            </div>
          ), { duration: 5000, position: "bottom-right" });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [employerId]);
}
