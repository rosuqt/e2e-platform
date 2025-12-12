/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import Image from "next/image"
import { useState, useEffect } from "react"
import {
  Grid,
  List,
  Send,

  Search,
  TrendingUp,
  Briefcase,
  MapPin,
  Filter,
  Loader2,
  GraduationCap,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import MuiTooltip from "@mui/material/Tooltip"
import InvitationModal from "../invited-candidates/components/invitation-modal"

interface JobListing {
  id: string
  title: string
}

interface Candidate {
  student_id: string
  first_name: string
  last_name: string
  course: string
  year: string
  email: string
  address: string
  is_alumni: boolean
  user_id: string
  profile_img_url: string
  cover_img_url?: string
  job_id: string
  job_title: string
  gpt_score: number
  last_scored_at: string
  application_status?: string
}

function formatDate(dateStr: string) {
  if (!dateStr) return ""
  const d = new Date(dateStr)
  if (isNaN(d.getTime())) return dateStr
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")} ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`
}

export default function SavedCandidatesPage() {
  const [jobListings, setJobListings] = useState<JobListing[]>([])
  const [candidates, setCandidates] = useState<Candidate[]>([])
  const [isGridView, setIsGridView] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [jobFilter, setJobFilter] = useState("all")
  const [loading, setLoading] = useState(true)
  const [showAll, setShowAll] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [modalCandidate, setModalCandidate] = useState<Candidate | null>(null)
  const [modalJobTitle, setModalJobTitle] = useState<string | null>(null)
  const [modalMatchScore, setModalMatchScore] = useState<number | null>(null)
  const router = useRouter()

  useEffect(() => {
    setLoading(true)
    fetch("/api/ai-matches/fetch-current-candidates", { method: "POST" })
      .then((res) => res.json())
      .then((data) => {
        setCandidates(data.candidates || [])
        const jobs: JobListing[] = Array.from(
          new Set(
            (data.candidates || []).map((c: any) => ({
              id: c.job_id,
              title: c.job_title,
            })),
          ),
        )
        setJobListings(jobs)
      })
      .finally(() => setLoading(false))
  }, [])

  const filteredCandidates = candidates
    .filter((candidate) => {
      const query = searchQuery.trim().toLowerCase()
      const name = `${candidate.first_name} ${candidate.last_name}`.toLowerCase()
      const matchesSearch =
        !query || name.includes(query)
      const matchesJob = jobFilter === "all" || candidate.job_id === jobFilter
      return matchesSearch && matchesJob
    })
    .sort((a, b) => {
      const query = searchQuery.trim().toLowerCase()
      if (!query) return 0
      const aName = `${a.first_name} ${a.last_name}`.toLowerCase()
      const bName = `${b.first_name} ${b.last_name}`.toLowerCase()
      const aMatch = aName.includes(query)
      const bMatch = bName.includes(query)
      if (aMatch === bMatch) return 0
      return aMatch ? -1 : 1
    })

  const displayedCandidates = showAll ? filteredCandidates : filteredCandidates.slice(0, 6)

  const getStatusColor = () => "bg-blue-100 text-blue-700 border-blue-200"

  const getTopMatch = (candidate: Candidate) => ({
    match: { matchScore: candidate.gpt_score },
    job: { title: candidate.job_title },
  })

  const handleSendInvite = (candidate: Candidate) => {
    setModalCandidate(candidate)
    setModalJobTitle(candidate.job_title)
    setModalMatchScore(candidate.gpt_score)
    setModalOpen(true)
  }

  const handleModalClose = () => {
    setModalOpen(false)
    setModalCandidate(null)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:20px_20px]"></div>
        </div>
        <div className="max-w-7xl mx-auto px-6 py-8 relative">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Candidates Matches</h1>
              <p className="text-blue-100">
                Discover perfect matches for your job openings • {filteredCandidates.length} candidates
              </p>
            </div>
            {/* Removed "I'm Feeling Lucky" button */}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6 space-y-6">
        {/* Filters and Search */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center flex-1">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search candidates..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4 text-gray-500" />
                    <span className="text-sm font-medium text-gray-700">Sort by:</span>
                  </div>

                  <Select value={jobFilter} onValueChange={setJobFilter}>
                    <SelectTrigger className="w-[200px]">
                      <SelectValue placeholder="Job Listing" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Job Listings</SelectItem>
                      {jobListings.map((job) => (
                        <SelectItem key={job.id} value={job.id}>
                          {job.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="new">New</SelectItem>
                      <SelectItem value="contacted">Contacted</SelectItem>
                      <SelectItem value="interviewed">Interviewed</SelectItem>
                      <SelectItem value="offered">Offered</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>

                  {/* Removed Favorites button */}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => setIsGridView(!isGridView)}>
                  {isGridView ? <List className="h-4 w-4" /> : <Grid className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Candidates Grid/List */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="animate-spin h-10 w-10 text-blue-500" />
          </div>
        ) : filteredCandidates.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No candidates found</h3>
              <p className="text-gray-600">Try adjusting your search or filters</p>
            </CardContent>
          </Card>
        ) : (
          <div>
            {isGridView ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {displayedCandidates.map((candidate) => (
                  <CandidateCard
                    key={candidate.student_id}
                    candidate={candidate}
                    getStatusColor={getStatusColor}
                    getTopMatch={getTopMatch}
                    router={router}
                    onSendInvite={handleSendInvite}
                  />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {displayedCandidates.map((candidate) => (
                  <CandidateListItem
                    key={candidate.student_id}
                    candidate={candidate}
                    getStatusColor={getStatusColor}
                    getTopMatch={getTopMatch}
                    router={router}
                    onSendInvite={handleSendInvite}
                  />
                ))}
              </div>
            )}
            {filteredCandidates.length > 6 && !showAll && (
              <div className="flex justify-center mt-6">
                <Button onClick={() => setShowAll(true)} className="bg-white text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                  Show More
                </Button>
              </div>
            )}
          </div>
        )}
        {/* Invitation Modal */}
        {modalCandidate && (
          <InvitationModal
            open={modalOpen}
            onClose={handleModalClose}
            candidate={{
              name: `${modalCandidate.first_name} ${modalCandidate.last_name}`,
              matchScore: modalMatchScore ?? modalCandidate.gpt_score,
              program: modalCandidate.course,
              yearSection: modalCandidate.year,
              avatar: modalCandidate.profile_img_url,
              id: modalCandidate.student_id,
            }}
            jobTitles={[modalJobTitle ?? modalCandidate.job_title]}
            jobMatchScores={
              modalJobTitle && modalMatchScore !== null
                ? { [modalJobTitle]: modalMatchScore }
                : undefined
            }
            jobId={modalCandidate.job_id}
            onSend={async (message) => {
              // Send invite API call
              await fetch("/api/employers/invitedCandidates/actionsInvites", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  action: "invite",
                  studentId: modalCandidate.student_id,
                  jobId: modalCandidate.job_id,
                  message,
                }),
              })
              setCandidates(prev =>
                prev.map(c =>
                  c.student_id === modalCandidate.student_id && c.job_id === modalCandidate.job_id
                    ? { ...c, application_status: "invited" }
                    : c
                )
              )
              setModalOpen(false)
              setModalCandidate(null)
            }}
          />
        )}
      </div>
    </div>
  )
}

interface CandidateCardProps {
  candidate: Candidate
  getStatusColor: () => string
  getTopMatch: (candidate: Candidate) => { match: { matchScore: number }; job: { title: string } }
  router?: any
  onSendInvite?: (candidate: Candidate) => void
}

function CandidateCard({
  candidate,
  getTopMatch,
  onSendInvite,
  router,
}: CandidateCardProps) {
  const { match: topMatch, job: topJob } = getTopMatch(candidate)
  let address = "Not Provided"
  if (candidate.address) {
    if (Array.isArray(candidate.address)) {
      address = candidate.address.filter(Boolean).join(", ")
    } else if (typeof candidate.address === "string") {
      try {
        const parsed = JSON.parse(candidate.address)
        if (Array.isArray(parsed)) {
          address = parsed.filter(Boolean).join(", ")
        } else {
          address = candidate.address
        }
      } catch {
        address = candidate.address
      }
    }
  }

  const matchScore = topMatch?.matchScore ?? 0
  const matchColor =
    matchScore >= 60
      ? "bg-green-500 text-white"
      : matchScore >= 25
        ? "bg-orange-400 text-white"
        : "bg-gray-200 text-gray-700"

  const coverUrl = candidate.cover_img_url ||
    "https://dbuyxpovejdakzveiprx.supabase.co/storage/v1/object/public/app.images/default_cover.jpg"

  const [invited, setInvited] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    setChecking(true);
    fetch("/api/employers/invitedCandidates/inviteCheck", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ studentId: candidate.student_id, jobId: candidate.job_id })
    })
      .then(res => res.json())
      .then(data => setInvited(!!data.invited))
      .finally(() => setChecking(false));
  }, [candidate.student_id, candidate.job_id]);

  let statusLabel = candidate.application_status ?? "";
  if (statusLabel === "offer_sent") statusLabel = "Offer sent";
  else if (["new", "New"].includes(statusLabel)) statusLabel = "Contacted";

  return (
    <Card className="overflow-visible hover:shadow-lg transition-all duration-300 group">
      <div className="relative h-32 bg-gradient-to-r from-blue-500 to-purple-500">
        <Image
          src={coverUrl}
          alt="Cover"
          layout="fill"
          objectFit="cover"
          className="opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        <div className="absolute top-3 left-3">
          <Badge className={`${matchColor} font-semibold backdrop-blur-sm`}>
            <TrendingUp className="h-3 w-3 mr-1" />
            {matchScore}% Match
          </Badge>
        </div>
        {candidate.application_status && (
          <div className="absolute top-3 right-3">
            <Badge className="bg-blue-100 text-blue-700 border-blue-300 text-xs font-semibold">
              {statusLabel}
            </Badge>
          </div>
        )}
      </div>
      <div className="relative">
        <Avatar className="absolute -top-6 left-4 h-14 w-14 border-4 border-white">
          <AvatarImage src={candidate.profile_img_url || "/placeholder.svg"} alt={candidate.first_name} />
          <AvatarFallback>
            {candidate.first_name.charAt(0)}
            {candidate.last_name.charAt(0)}
          </AvatarFallback>
        </Avatar>
        <CardContent className="pt-8 pb-4 px-4">
          <div className="space-y-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-gray-900">
                  {candidate.first_name} {candidate.last_name}
                </h3>
              </div>
              <p className="text-sm text-gray-600">{candidate.course}</p>
              <div className="flex items-center gap-4 text-xs text-gray-500 mt-1">
                <span className="flex items-center gap-1">
                  <GraduationCap className="h-3 w-3" />
                  Year {candidate.year}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {address}
                </span>
              </div>
            </div>
            {topJob && (
              <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium text-blue-700">Best Match</span>
                  <Badge variant="outline" className="bg-blue-100 text-blue-700 border-blue-300 text-xs">
                    {topMatch?.matchScore}%
                  </Badge>
                </div>
                <p className="text-sm font-medium text-gray-900">{topJob.title}</p>
              </div>
            )}
            <span className="text-xs text-gray-500">
              Last matched at {formatDate(candidate.last_scored_at)}
            </span>
            <div className="flex gap-2 pt-2">
              {invited && (
                <Button
                  size="sm"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={() => {
                    router.push(`/employers/jobs/invited-candidates?inviteId=${candidate.job_id}_${candidate.student_id}`)
                  }}
                >
                  <Send className="h-4 w-4 mr-1" />
                  View Invite
                </Button>
              )}
              <MuiTooltip
                title={
                  invited
                    ? "This candidate has already been invited for this job"
                    : candidate.application_status
                    ? "This candidate already has an existing application"
                    : ""
                }
                arrow
                disableHoverListener={!invited && !candidate.application_status}
              >
                <span className="flex-1">
                  <Button
                    size="sm"
                    className="w-full bg-blue-600 hover:bg-blue-700"
                    disabled={!!candidate.application_status || invited || checking}
                    onClick={() => onSendInvite?.(candidate)}
                  >
                    <Send className="h-4 w-4 mr-1" />
                    {checking ? "Checking..." : "Send Invite"}
                  </Button>
                </span>
              </MuiTooltip>
            </div>
          </div>
        </CardContent>
      </div>
    </Card>
  )
}

function CandidateListItem({
  candidate,
  getTopMatch,
  onSendInvite,
  router,
}: CandidateCardProps) {
  const { match: topMatch, job: topJob } = getTopMatch(candidate)
  let address = "Not Provided"
  if (candidate.address) {
    if (Array.isArray(candidate.address)) { 
      address = candidate.address.filter(Boolean).join(", ")
    } else if (typeof candidate.address === "string") {
      try {
        const parsed = JSON.parse(candidate.address)
        if (Array.isArray(parsed)) {
          address = parsed.filter(Boolean).join(", ")
        } else {
          address = candidate.address
        }
      } catch {
        address = candidate.address
      }
    }
  }

  const [invited, setInvited] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    setChecking(true);
    fetch("/api/employers/invitedCandidates/inviteCheck", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ studentId: candidate.student_id, jobId: candidate.job_id })
    })
      .then(res => res.json())
      .then(data => setInvited(!!data.invited))
      .finally(() => setChecking(false));
  }, [candidate.student_id, candidate.job_id]);

  let statusLabel = candidate.application_status ?? "";
  if (statusLabel === "offer_sent") statusLabel = "Offer sent";
  else if (["new", "New"].includes(statusLabel)) statusLabel = "Contacted";

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          {candidate.application_status && (
            <div className="absolute top-4 right-4">
              <Badge className="bg-blue-100 text-blue-700 border-blue-300 text-xs font-semibold">
                {statusLabel}
              </Badge>
            </div>
          )}
          <div className="flex items-center gap-4 flex-1">
            <div className="relative">
              <Avatar className="h-12 w-12">
                <AvatarImage src={candidate.profile_img_url || "/placeholder.svg"} alt={candidate.first_name} />
                <AvatarFallback>
                  {candidate.first_name.charAt(0)}
                  {candidate.last_name.charAt(0)}
                </AvatarFallback>
              </Avatar>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-gray-900">
                  {candidate.first_name} {candidate.last_name}
                </h3>
                {topMatch && (
                  <Badge className="bg-blue-600 text-white text-xs px-1 py-0">
                    {topMatch.matchScore}%
                  </Badge>
                )}
              </div>
              <p className="text-sm text-gray-600 mb-1">{candidate.course}</p>
              {topJob && (
                <div className="bg-blue-50 rounded px-2 py-1 mb-2 inline-block">
                  <span className="text-xs font-medium text-blue-700">
                    {topMatch?.matchScore}% match for {topJob.title}
                  </span>
                </div>
              )}
              <div className="flex items-center gap-6 text-xs text-gray-500 mb-2">
                <span className="flex items-center gap-1">
                  <GraduationCap className="h-3 w-3" />
                  Year {candidate.year}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {address}
                </span>
                <span>
                  Last matched at {formatDate(candidate.last_scored_at)}
                </span>
                {candidate.application_status && (
                  <Badge className="bg-blue-100 text-blue-700 border-blue-300 text-xs font-semibold">
                    {statusLabel}
                  </Badge>
                )}
              </div>
              <div className="flex gap-2 pt-2">
                {invited && (
                  <Button
                    size="sm"
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                    onClick={() => {
                      router.push(`/employers/jobs/invited-candidates?inviteId=${candidate.job_id}_${candidate.student_id}`)
                    }}
                  >
                    <Send className="h-4 w-4 mr-1" />
                    View Invite
                  </Button>
                )}
                <MuiTooltip
                  title={
                    invited
                      ? "This candidate has already been invited for this job"
                      : candidate.application_status
                      ? "This candidate already has an existing application"
                      : ""
                  }
                  arrow
                  disableHoverListener={!invited && !candidate.application_status}
                >
                  <span className="flex-1">
                    <Button
                      size="sm"
                      className="w-full bg-blue-600 hover:bg-blue-700"
                      disabled={!!candidate.application_status || invited || checking}
                      onClick={() => onSendInvite?.(candidate)}
                    >
                      <Send className="h-4 w-4 mr-1" />
                      {checking ? "Checking..." : "Send Invite"}
                    </Button>
                  </span>
                </MuiTooltip>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
