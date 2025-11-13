/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { MdWorkOutline } from "react-icons/md"
import { FaBookmark, FaRegBookmark } from "react-icons/fa6"
import QuickViewModal from "./modals/quick-view"
import { useSession } from "next-auth/react"
import { SiStarship } from "react-icons/si"
import { BsSuitcaseLgFill } from "react-icons/bs"
import { useRouter } from "next/navigation"

type JobMatch = {
  job_id: string
  job_title: string
  company_id: string
  company_name: string
  company_logo_image_path: string
  location: string
  pay_amount: string
  pay_type: string
  similarity: number
  gpt_score?: number | null
}

export default function JobMatchesSection() {
  const router = useRouter()
  const { data: session } = useSession()
  const [openQuickView, setOpenQuickView] = useState(false)
  const [quickViewJob, setQuickViewJob] = useState<any>(null)
  const [savedJobs, setSavedJobs] = useState<number[]>([])
  const [matches, setMatches] = useState<JobMatch[]>([])
  const [loading, setLoading] = useState(true)
  const [hasFetched, setHasFetched] = useState(false);

  useEffect(() => {
    async function fetchMatches() {
      setLoading(true)
      const student_id = (session?.user as { studentId?: string })?.studentId || "student_001"
      try {
        // 1. Get initial matches
        const res = await fetch("/api/ai-matches/match/jobs", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ student_id })
        })
        const data = await res.json()
        let matchesArr = Array.isArray(data.matches) ? data.matches : []

        // 2. Get current gpt_scores from job_matches table
        const gptRes = await fetch("/api/ai-matches/fetch-current-matches", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ student_id })
        })
        const gptData = await gptRes.json()
        const gptScores = Array.isArray(gptData.matches) ? gptData.matches : []

        // 3. Merge gpt_scores into matches
        const gptMap = new Map<string, { gpt_score: number | null }>()
        gptScores.forEach((r: { job_id: string; gpt_score: number | null }) => gptMap.set(r.job_id, { gpt_score: r.gpt_score }))

        matchesArr = matchesArr.map((m: JobMatch) => ({
          ...m,
          gpt_score: gptMap.get(m.job_id)?.gpt_score ?? null
        }))

        setMatches(matchesArr)
      } catch {
        setMatches([])
      }
      setLoading(false)
    }
    if (session && !hasFetched) {
      fetchMatches();
      setHasFetched(true);
    } else if (!session) {
      setLoading(false);
    }
  }, [session, hasFetched])

  // Show top 4 highest match jobs by gpt_score
  const highMatches = [...matches]
    .filter((m: JobMatch) => typeof m.gpt_score === "number")
    .sort((a, b) => (b.gpt_score ?? 0) - (a.gpt_score ?? 0))
    .slice(0, 4)

  return (
    <div className="p-4 relative">
      {loading ? (
        <div className="flex flex-col items-center justify-center py-12">
          <span className="mb-4">
            <svg className="animate-spin h-12 w-12 text-blue-300" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"/>
            </svg>
          </span>
          <div className="text-gray-400 text-sm">Getting some job matches for you!</div>
        </div>
      ) : highMatches.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {highMatches.map((m, i) => (
            <JobMatchCard
              key={m.job_id || i}
              match={m}
              index={i}
              setQuickViewJob={setQuickViewJob}
              setOpenQuickView={setOpenQuickView}
              savedJobs={savedJobs}
              setSavedJobs={setSavedJobs}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12">
          <SiStarship size={48} className="text-gray-300 mb-2" />
          <div className="text-gray-400 text-sm">
            Looks like there aren’t any top matches for you right now. Keep your profile up to date and check back soon—new opportunities are on the way!
          </div>
          <Button
            size="sm"
            variant="outline"
            className="mt-6 border-blue-300 text-blue-600 hover:bg-blue-50 hover:text-blue-800"
            onClick={() => {
              setLoading(true)
              const student_id = (session?.user as { studentId?: string })?.studentId || "student_001"
              fetch("/api/ai-matches/match/jobs", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ student_id })
              })
                .then(res => res.json())
                .then(data => {
                  if (Array.isArray(data.matches)) {
                    setMatches(data.matches)
                  } else {
                    setMatches([])
                  }
                  setLoading(false)
                })
                .catch(() => {
                  setMatches([])
                  setLoading(false)
                })
            }}
            disabled={loading}
          >
        Refresh
          </Button>
        </div>
      )}
      <div className="text-right mt-4">
        <Button
          variant="link"
          className="text-blue-600 hover:underline"
          onClick={() => router.push("/students/jobs/job-matches")}
        >
          View More
        </Button>
      </div>
      <QuickViewModal
        open={openQuickView}
        onClose={() => setOpenQuickView(false)}
        job={quickViewJob || {
          title: "",
          company: "",
          location: "",
          salary: "",
          posted: "",
          logoUrl: "",
          type: "",
          vacancies: 0,
          description: "",
          closingDate: "",
          remote: false,
          matchScore: 0
        }}
      />
    </div>
  )
}

function JobMatchCard({
  match,
  index,
  setQuickViewJob,
  setOpenQuickView,
  savedJobs,
  setSavedJobs
}: {
  match: JobMatch
  index: number
  setQuickViewJob: (job: any) => void
  setOpenQuickView: (open: boolean) => void
  savedJobs: number[]
  setSavedJobs: React.Dispatch<React.SetStateAction<number[]>>
}) {
  const { data: session } = useSession()
  const [imgError, setImgError] = useState(false)
  const [saving, setSaving] = useState(false)
  function getCity(location: string) {
    if (!location) return ""
    const parts = location.split(",").map(s => s.trim())
    const cityPart = parts.find(p => /city/i.test(p))
    return cityPart || (parts.length > 1 ? parts[1] : parts[0])
  }
  const companyImageUrl = match.company_logo_image_path
    ? (match.company_logo_image_path.startsWith("http")
        ? match.company_logo_image_path
        : `https://dbuyxpovejdakzveiprx.supabase.co/storage/v1/object/public/company.logo/${match.company_logo_image_path}`)
    : ""
  console.log("company_image link:", companyImageUrl)
  return (
    <div className="bg-white border border-blue-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow min-h-[260px] flex flex-col">
      <div className="flex justify-center pt-6">
        <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-lg">
          {match.company_logo_image_path && !imgError ? (
            <img
              src={companyImageUrl}
              alt={match.company_name}
              className="w-16 h-16 rounded-full object-cover"
              onError={() => setImgError(true)}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          ) : (
            <span className="w-12 h-12 flex items-center justify-center ">
              <BsSuitcaseLgFill className="text-blue-900 w-7 h-7" />
            </span>
          )}
        </div>
      </div>
      <div className="px-4 pt-4 pb-4 relative flex-1">
        <div className="text-center mb-2">
          <h3 className="font-medium  text-gray-900">{match.job_title || "Job Title"}</h3>
          <p className="text-sm text-gray-500">
            {match.company_name || ""}
            {match.location ? ` | ${getCity(match.location)}` : ""}
          </p>
          <p className="text-sm text-gray-400">
            {match.pay_amount
              ? `${match.pay_amount} / ${match.pay_type}`
              : "No Pay"}
          </p>
        </div>

        <div
          className={`text-sm font-medium mb-4 text-center ${
            typeof match.gpt_score === "number"
              ? match.gpt_score <= 20
                ? "text-red-500"
                : match.gpt_score <= 59
                ? "text-yellow-500"
                : "text-green-600"
              : "text-gray-400"
          }`}
        >
          {typeof match.gpt_score === "number"
            ? `${match.gpt_score}% match to this job`
            : "No AI score available"}
        </div>
        <div className="flex gap-2">
          <Button
            size="sm"
            className="flex-1 bg-blue-600 text-white hover:bg-blue-700"
            onClick={() => {
              setQuickViewJob({
                title: match.job_title || "",
                company: match.company_name || "",
                location: match.location || "",
                salary: match.pay_amount ? `${match.pay_amount} / ${match.pay_type}` : "",
                logoUrl: match.company_logo_image_path || "",
                matchScore: Math.round(match.similarity * 100)
              })
              setOpenQuickView(true)
            }}
          >
            <MdWorkOutline className="mr-1" size={16} /> Quick View
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="flex-1 border-blue-300 text-blue-600 hover:bg-blue-100 hover:text-blue-800"
            disabled={saving}
            onClick={async () => {
              setSaving(true)
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              const student_id = (session?.user as { studentId?: string })?.studentId || "student_001"
              if (savedJobs.includes(index)) {
                await fetch("/api/students/job-listings/saved-jobs", {
                  method: "DELETE",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ jobId: match.job_id })
                })
                setSavedJobs(prev => prev.filter(id => id !== index))
              } else {
                await fetch("/api/students/job-listings/saved-jobs", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ jobId: match.job_id })
                })
                setSavedJobs(prev => [...prev, index])
              }
              setSaving(false)
            }}
          >
            {savedJobs.includes(index) ? (
              <>
                <FaBookmark className="mr-1" size={16} /> Saved
              </>
            ) : (
              <>
                <FaRegBookmark className="mr-1" size={16} /> Save Job
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
