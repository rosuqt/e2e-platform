/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Avatar from "@mui/material/Avatar"
import { Button } from "@/components/ui/button"
import { useSession } from "next-auth/react"
import { Lock } from "lucide-react"

type Candidate = {
  student_id: string
  first_name: string
  last_name: string
  email: string
  year: string
  section: string
  course: string
  address: string
  is_alumni: boolean
  user_id: string
  profile_img_url: string
  gpt_score: number
  job_title: string
  application_status: string
}

export default function TopHighestMatchApplicants() {
  const { data: session } = useSession()
  const verifyStatus = session?.user?.verifyStatus
  const employerId = session?.user?.employerId
  const [candidates, setCandidates] = useState<Candidate[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchCandidates() {
      setLoading(true)
      try {
        const res = await fetch("/api/ai-matches/fetch-current-candidates", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ employer_id: employerId }),
        })
        const data = await res.json()
        if (Array.isArray(data.candidates)) {
          const sorted = [...data.candidates]
            .sort((a, b) => (b.gpt_score ?? 0) - (a.gpt_score ?? 0))
            .slice(0, 3)
          setCandidates(sorted)
        }
      } catch {}
      setLoading(false)
    }
    if (employerId) fetchCandidates()
  }, [employerId])

  if (verifyStatus !== "full") {
    return (
      <Card className="shadow-sm border-blue-100 relative">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center">
            Top 3 Highest Match Applicants
            <Badge
              className="ml-2 bg-green-500 text-white text-xs blur-sm select-none"
              style={{ filter: "blur(8px)" }}
            >
              95%+ Match
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="relative">
          <div className="space-y-3 mt-0">
            {loading ? (
              <div className="text-center text-gray-400">Loading...</div>
            ) : candidates.length === 0 ? (
              <div className="text-center text-gray-400">No candidates found</div>
            ) : candidates.map((candidate, index) => (
              <div
                key={candidate.student_id}
                className="border border-green-100 rounded-lg p-3 opacity-70 relative"
                style={{ filter: "blur(8px)" }}
              >
                <div className="flex gap-3 items-start">
                  <Avatar
                    sx={{
                      width: 40,
                      height: 40,
                      fontWeight: "bold",
                      bgcolor: "#DCFCE7",
                      color: "#15803D",
                      fontSize: 22,
                    }}
                    src={candidate.profile_img_url || undefined}
                  >
                    {!candidate.profile_img_url && (candidate.first_name?.charAt(0) || "A")}
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <p className="font-medium text-gray-800">{candidate.first_name} {candidate.last_name}</p>
                      <Badge
                        className="bg-green-100 text-green-700 blur-sm select-none"
                        style={{ filter: "blur(8px)" }}
                      >
                        {Math.round(candidate.gpt_score)}% Match
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-500">{candidate.job_title}</p>
                    <p className="text-xs text-gray-500 mt-1">{candidate.course} {candidate.year && `· Year ${candidate.year}`}</p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {candidate.address && (
                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                          {candidate.address}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="mt-3 flex gap-2">
                  <Button size="sm" className="bg-blue-600 text-xs flex-1" disabled>
                    View Details
                  </Button>
                  <Button variant="outline" size="sm" className="text-blue-600 border-blue-200 text-xs flex-1" disabled>
                    Invite to Interview
                  </Button>
                </div>
              </div>
            ))}
          </div>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10">
            <Lock className="w-10 h-10 text-gray-400 mb-2" />
            <div className="text-lg font-semibold text-gray-500 mb-1">Match scores are hidden</div>
            <div className="text-sm text-gray-400">Verify your account to unlock applicant match scores.</div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="shadow-sm border-blue-100">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center">
          Top 3 Highest Match Applicants
          <Badge className="ml-2 bg-green-500 text-white text-xs">95%+ Match</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {loading ? (
            <div className="text-center text-gray-400">Loading...</div>
          ) : candidates.length === 0 ? (
            <div className="text-center text-gray-400">No candidates found</div>
          ) : candidates.map((candidate, index) => (
            <div
              key={candidate.student_id}
              className="border border-green-100 rounded-lg p-3 hover:bg-green-50 transition-colors"
            >
              <div className="flex gap-3 items-start">
                <Avatar
                  sx={{
                    width: 40,
                    height: 40,
                    fontWeight: "bold",
                    bgcolor: "#DCFCE7",
                    color: "#15803D",
                    fontSize: 22,
                  }}
                  src={candidate.profile_img_url || undefined}
                >
                  {!candidate.profile_img_url && (candidate.first_name?.charAt(0) || "A")}
                </Avatar>
                <div className="flex-1">
                  <div className="flex justify-between">
                    <p className="font-medium text-gray-800">{candidate.first_name} {candidate.last_name}</p>
                    <Badge className="bg-green-100 text-green-700">{Math.round(candidate.gpt_score)}% Match</Badge>
                  </div>
                  <p className="text-xs text-gray-500">{candidate.job_title}</p>
                  <p className="text-xs text-gray-500 mt-1">{candidate.course} {candidate.year && `· Year ${candidate.year}`}</p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {candidate.address && (
                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                        {candidate.address}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="mt-3 flex gap-2">
                <Button size="sm" className="bg-blue-600 text-xs flex-1">
                  View Details
                </Button>
                <Button variant="outline" size="sm" className="text-blue-600 border-blue-200 text-xs flex-1">
                  Invite to Interview
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
