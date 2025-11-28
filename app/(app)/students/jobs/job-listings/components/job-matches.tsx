/* eslint-disable @typescript-eslint/no-explicit-any */
import { useRouter } from "next/navigation";
import { BriefcaseIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { getSession } from "next-auth/react";
import { PiShootingStarFill } from "react-icons/pi";

export default function JobMatches() {
  const router = useRouter();
  const [jobMatches, setJobMatches] = useState<
    { job_id: string; job_title: string; company_name: string; gpt_score: number }[]
  >([]);

  useEffect(() => {
    getSession().then((session: any) => {
      const student_id = session?.user?.studentId;
      if (!student_id) return;
      fetch("/api/ai-matches/fetch-current-matches", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ student_id }),
      })
        .then((res) => res.json())
        .then((data) => {
          const sorted = (data.matches || [])
            .sort((a: any, b: any) => b.gpt_score - a.gpt_score)
            .slice(0, 2);
          setJobMatches(sorted);
        });
    });
  }, []);

  function getBadgeColor(match: number) {
    if (match >= 60) return "bg-green-100 text-green-700 border-green-300";
    if (match >= 31) return "bg-orange-100 text-orange-700 border-orange-300";
    return "bg-red-100 text-red-700 border-red-300";
  }

  return (
    <div className="bg-white rounded-xl shadow p-4 mb-4 border-2 border-blue-200 relative overflow-hidden">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <BriefcaseIcon className="h-5 w-5 text-blue-600" />
          <span className="text-base font-semibold text-blue-700">Job Matches</span>
        </div>
        <button
          className="text-blue-600 border border-blue-100 hover:bg-blue-50 text-xs py-1 px-3 h-7 rounded-md transition-colors"
          onClick={() => router.push("/students/jobs/job-matches")}
        >
          View All
        </button>
      </div>
      <div className="space-y-2">
        {(jobMatches.length === 0 ||
          jobMatches.some((job) => job.gpt_score === 0 || job.gpt_score < 6)) ? (
          <div className="flex flex-col items-center justify-center py-2">
            <PiShootingStarFill className="text-gray-400 text-3xl mb-2" />
            <div className="text-gray-500 text-sm">
              Looks like we couldn’t find any matches. Maybe your profile needs a little tune-up?
            </div>
          </div>
        ) : (
          jobMatches.map((job) => (
            <div
              key={job.job_id}
              className="bg-white border border-blue-100 rounded-lg px-3 py-2 flex flex-col shadow-sm transition-transform duration-200 hover:scale-105"
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold text-sm text-gray-900">{job.job_title}</span>
                <span className="flex items-center gap-1">
                  <span
                    className={`border text-xs font-semibold px-2 py-0.5 rounded ${getBadgeColor(job.gpt_score)}`}
                  >
                    {job.gpt_score}%
                  </span>
                </span>
              </div>
              <span className="text-xs text-gray-500">{job.company_name}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
