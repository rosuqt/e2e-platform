/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Avatar from "@mui/material/Avatar"
import { Button } from "@/components/ui/button"
import { useSession } from "next-auth/react"
import { Lock } from "lucide-react"
import { RecruiterApplicationDetailsModal } from "./recruiter-application-details"
import InterviewScheduleModal from "./modals/interview-schedule"

type Candidate = {
  student_id: string
  job_id: string
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
  pay_amount?: string
  pay_type?: string
  work_type?: string
  remote_options?: string
  perks_and_benefits?: string[]
  location?: string
  contactInfo?: {
    email?: string
    phone?: string
    socials?: { key: string; url: string }[]
    countryCode?: string
  }
  application_id?: string
  experience_years?: string
  applied_date?: string
  applied_at?: string
  skills?: string[]
  education?: { degree: string; school: string; year: string }[]
  work_history?: { company: string; position: string; duration: string; description: string }[]
  timeline?: { status: string; date: string; icon: React.JSX.Element; iconBg: string; current?: boolean }[]
  notes?: string
  phone?: string
  linkedin?: string
  github?: string
  documents?: { name: string; date: string; size: string }[]
  expertise?: { skill: string; mastery: number }[]
  profile_image_url?: string
  resume?: string
  application_answers?: Record<string, string | string[]>
  job_skills?: string[]
  achievements?: string[]
  portfolio?: string[]
  raw_achievements?: string | string[] | Record<string, unknown> | null | undefined
  raw_portfolio?: string | string[] | Record<string, unknown> | null | undefined
}

export default function TopHighestMatchApplicants() {
  const { data: session } = useSession()
  const verifyStatus = session?.user?.verifyStatus
  const employerId = session?.user?.employerId
  const [candidates, setCandidates] = useState<Candidate[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedApplicant, setSelectedApplicant] = useState<Candidate | null>(null)
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [showInterviewModal, setShowInterviewModal] = useState(false)

  useEffect(() => {
    async function fetchCandidates() {
      setLoading(true)
      try {
        const res = await fetch("/api/employers/applications/fetch-high-match-applicants", {
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
              <div className="flex flex-col items-center justify-center py-8">
                <span className="w-8 h-8 border-4 border-blue-400 border-t-transparent rounded-full animate-spin mb-2"></span>
                <span className="text-blue-600 font-medium text-base mt-2">Fetching top match applicants...</span>
              </div>
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
                          {Array.isArray(candidate.address)
                            ? (candidate.address.length > 1 ? candidate.address[1] : candidate.address[0] || "")
                            : candidate.address}
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
    <>
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
              <div className="flex flex-col items-center justify-center py-8">
                <span className="w-8 h-8 border-4 border-blue-400 border-t-transparent rounded-full animate-spin mb-2"></span>
                <span className="text-blue-600 font-medium text-base mt-2">Fetching top match applicants...</span>
              </div>
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
                  <Button
                    size="sm"
                    className="bg-blue-600 text-xs flex-1"
                    onClick={() => {
                      setSelectedApplicant(candidate)
                      setDetailsOpen(true)
                    }}
                  >
                    View Details
                  </Button>
                  {(candidate.application_status === "new" || candidate.application_status === "shortlisted") && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-blue-600 border-blue-200 text-xs flex-1"
                      onClick={() => {
                        setSelectedApplicant(candidate)
                        setShowInterviewModal(true)
                      }}
                    >
                      Invite to Interview
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      {selectedApplicant && (
        <RecruiterApplicationDetailsModal
          applicant={{
            ...selectedApplicant,
            application_id: selectedApplicant.application_id ?? "",
            job_id: selectedApplicant.job_id ?? "",
            profile_image_url: selectedApplicant.profile_img_url ?? "",
            status: selectedApplicant.application_status ?? "",
            job_title: selectedApplicant.job_title ?? "",
            first_name: selectedApplicant.first_name ?? "",
            last_name: selectedApplicant.last_name ?? "",
            email: selectedApplicant.email ?? "",
            year: selectedApplicant.year ?? "",
            course: selectedApplicant.course ?? "",
            address: selectedApplicant.address ?? "",
            gpt_score: selectedApplicant.gpt_score ?? 0,
            pay_amount: selectedApplicant.pay_amount ?? "",
            pay_type: selectedApplicant.pay_type ?? "",
            work_type: selectedApplicant.work_type ?? "",
            remote_options: selectedApplicant.remote_options ?? "",
            perks_and_benefits: selectedApplicant.perks_and_benefits ?? [],
            location: selectedApplicant.location ?? selectedApplicant.address ?? "",
            contactInfo: selectedApplicant.contactInfo ?? {},
          }}
          isModalOpen={detailsOpen}
          setIsModalOpen={setDetailsOpen}
        />
      )}
      {selectedApplicant && (
        <InterviewScheduleModal
          open={showInterviewModal}
          onClose={() => setShowInterviewModal(false)}
          initial={{
            application_id: selectedApplicant.application_id ?? "",
            student_id: selectedApplicant.student_id ?? "",
            employer_id: employerId ?? "",
            status: selectedApplicant.application_status ?? "",
          }}
        />
      )}
    </>
  )
}
