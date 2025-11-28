import { Button } from "@/components/ui/button"
import { Bookmark } from "lucide-react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"
import { PiShootingStarFill } from "react-icons/pi"

type SavedJob = {
  id: string
  title?: string
  job_title?: string
  company?: string
  company_name?: string
}

type ApiResponse = {
  jobs: SavedJob[]
}

export default function SavedJobs({ }: { refreshKey?: unknown } = {}) {
  const router = useRouter()
  const { data: session } = useSession()
  const [jobs, setJobs] = useState<SavedJob[]>([])
  const [loading, setLoading] = useState(true)
  const [total, setTotal] = useState<number>(0)
  //const [unsaving, setUnsaving] = useState<string | null>(null)

  const fetchSavedJobs = async () => {
    setLoading(true)
    const studentId = (session?.user as { studentId?: string })?.studentId
    if (!studentId) {
      setJobs([])
      setTotal(0)
      setLoading(false)
      return
    }

    const res = await fetch(
      `/api/students/job-listings/saved-jobs?studentId=${studentId}&limit=2`
    )
    const data: ApiResponse = await res.json()
    setJobs(Array.isArray(data.jobs) ? data.jobs : [])

    const resTotal = await fetch(
      `/api/students/job-listings/saved-jobs/count?studentId=${studentId}`
    )
    const totalData = await resTotal.json()
    setTotal(typeof totalData.count === "number" ? totalData.count : 0)

    setLoading(false)
  }

  useEffect(() => {
    if (
      session &&
      (session.user as { studentId?: string })?.studentId &&
      jobs.length === 0 
    ) {
      fetchSavedJobs()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session]) 

  /*const handleUnsave = async (jobId: string) => {
    setUnsaving(jobId)
    await fetch("/api/students/job-listings/saved-jobs", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ jobId }),
    })
    setUnsaving(null)
    fetchSavedJobs()
  }*/

  return (
    <div className="bg-white rounded-xl shadow p-4 mb-4 border-2 border-blue-200 relative overflow-hidden">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Bookmark className="h-5 w-5 text-blue-600" />
          <span className="text-base font-semibold text-blue-700">
            Saved Jobs
          </span>
          <span className="ml-2 text-xs text-blue-600 bg-blue-50 rounded-full px-2 py-0.5">
            {total}
          </span>
        </div>
        <Button
          variant="outline"
          className="text-blue-600 border-blue-100 hover:bg-blue-50 hover:text-blue-600 text-xs py-1 px-3 h-7"
          onClick={() => router.push("/students/jobs/saved-jobs")}
        >
          View All
        </Button>
      </div>
      <div className="space-y-2">
        {loading ? (
          <div className="flex justify-center items-center py-4">
            <span className="inline-block w-5 h-5 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : jobs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-2">
            <PiShootingStarFill className="text-gray-400 text-3xl mb-2" />
         
          <div className="text-gray-500 text-sm">Nothing saved for now — your dream job might be just a scroll away!</div> </div>
        ) : (
          jobs.map((job) => (
            <div
              key={job.id}
              className="bg-white border border-blue-100 rounded-lg px-3 py-2 flex items-center justify-between shadow-sm transition-transform duration-200 hover:scale-105"
            >
              <div className="flex flex-col">
                <span className="font-semibold text-sm text-gray-900">
                  {job.title || job.job_title}
                </span>
                <span className="text-xs text-gray-500">
                  {job.company || job.company_name}
                </span>
              </div>
              <span
                className="p-1 rounded bg-transparent"
                aria-label="Saved job"
              >
                <Bookmark className="h-4 w-4 text-blue-600 fill-blue-600" />
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

