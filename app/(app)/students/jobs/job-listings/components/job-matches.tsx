import { useRouter } from "next/navigation";
import { BriefcaseIcon } from "lucide-react";
export default function JobMatches() {
  const router = useRouter();

  const jobMatches = [
    { id: 1, title: "Software Engineer", company: "ABC", match: 96 },
    { id: 2, title: "Frontend Developer", company: "XYZ", match: 92 },
  ];

  function getBadgeColor(match: number) {
    if (match >= 70) return "bg-green-100 text-green-700 border-green-300";
    if (match >= 20) return "bg-orange-100 text-orange-700 border-orange-300";
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
        {jobMatches.map((job) => (
          <div
            key={job.id}
            className="bg-white border border-blue-100 rounded-lg px-3 py-2 flex flex-col shadow-sm transition-transform duration-200 hover:scale-105"
          >
            <div className="flex items-center justify-between">
              <span className="font-semibold text-sm text-gray-900">{job.title}</span>
              <span className="flex items-center gap-1">
              
                <span
                  className={`border text-xs font-semibold px-2 py-0.5 rounded ${getBadgeColor(job.match)}`}
                >
                  {job.match}%
                </span>
              </span>
            </div>
            <span className="text-xs text-gray-500">{job.company}</span>
          </div>
        ))}
      </div>
      {/* Removed bottom View All button and number count */}
    </div>
  );
}
