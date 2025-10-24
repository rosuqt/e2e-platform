import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../lib/authOptions';
import { getAdminSupabase } from '@/lib/supabase';

interface SessionUser {
  role?: string;
  employerId?: string;
}

interface JobPosting {
  id: string;
  job_title: string;
  application_deadline: string | null;
  work_type: string | null;
  pay_amount: string | null;
  created_at: string;
  recommended_course: string | null;
  paused: boolean | null;
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || session.user.role !== 'employer') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const employerId = (session.user as SessionUser).employerId;
    if (!employerId) {
      return NextResponse.json({ error: 'Employer ID not found' }, { status: 400 });
    }

    const supabase = getAdminSupabase();
    
    const { data, error } = await supabase
      .from('job_postings')
      .select('*')
      .eq('employer_id', employerId)
      .eq('is_archived', true)
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    const jobIds = data.map((job) => job.id);

    type JobStats = {
      views: number;
      total_applicants: number;
      qualified_applicants: number;
      interviews: number;
    };
    const jobStats: Record<string, JobStats> = {};
    if (jobIds.length > 0) {
      const { data: statsData, error: statsError } = await supabase
        .from("job_metrics")
        .select("job_id, views, total_applicants, qualified_applicants, interviews")
        .in("job_id", jobIds);

      if (!statsError && Array.isArray(statsData)) {
        for (const stat of statsData) {
          jobStats[stat.job_id] = {
            views: stat.views ?? 0,
            total_applicants: stat.total_applicants ?? 0,
            qualified_applicants: stat.qualified_applicants ?? 0,
            interviews: stat.interviews ?? 0,
          };
        }
      }
    }

    const mappedData = data.map((job: JobPosting) => {
      const stats = jobStats[job.id] || {
        views: 0,
        total_applicants: 0,
        qualified_applicants: 0,
        interviews: 0,
      };

      return {
        id: job.id,
        title: job.job_title,
        status: 'Archived',
        closing: job.application_deadline ? new Date(job.application_deadline) > new Date() ? `${Math.ceil((new Date(job.application_deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days left` : 'Closed' : 'No deadline',
        type: job.work_type || 'Not specified',
        salary: job.pay_amount || 'Not specified',
        posted: job.created_at,
        recommended_course: job.recommended_course,
        paused: job.paused || false,
        views: stats.views,
        total_applicants: stats.total_applicants,
        qualified_applicants: stats.qualified_applicants,
        interviews: stats.interviews,
        is_archived: true
      };
    });

    return NextResponse.json({ data: mappedData });
  } catch (error) {
    console.log('Error fetching archived job listings:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
