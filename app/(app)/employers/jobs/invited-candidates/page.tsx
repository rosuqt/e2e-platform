/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import Image from "next/image"
import { useRouter, useSearchParams } from "next/navigation"

import { useState, useEffect } from "react"
import {
  ChevronDown,
  List,
  Star,
  Mail,
  Trash2,
  Clock,
  CheckCircle,
  XCircle,
  Search,
  TrendingUp,
  Heart,
  Loader2,
} from "lucide-react"
import { LuLayoutGrid } from "react-icons/lu"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Collapse from "@mui/material/Collapse"
import ViewInviteModal from "./components/invitation-preview"
import InvitationModal from "./components/invitation-modal"
import { DndContext } from "@dnd-kit/core"
import { SortableContext, verticalListSortingStrategy, useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"

interface Candidate {
  message: string
  employerName: string
  id: string
  name: string
  school: string
  yearSection: string
  avatar: string
  coverPhoto?: string
  status: "pending" | "accepted" | "declined"
  date: string
  isFavorite: boolean
  program?: string
  matchScore?: number
  jobTitle?: string 
  companyName?: string 
  jobId?: string
  studentId?: string 
}

interface SuggestedCandidate {
  jobTitle: any
  jobTitleRaw: any
  id: string
  name: string
  school: string
  yearSection: string
  avatar: string
  coverPhoto?: string
  matchPercentage: number
  program?: string
  jobId?: string
  studentId?: string 
}

function SortableSection({ id, children }: { id: string; children: React.ReactNode }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id })
  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.7 : 1,
    pointerEvents: isDragging ? "none" as React.CSSProperties["pointerEvents"] : undefined,
  }
  return (
    <div ref={setNodeRef} style={style}>
      <div className="mb-2 cursor-move flex items-center gap-2 text-xs text-gray-400" {...attributes} {...listeners}>
        <List className="h-4 w-4" />
        Drag to reorder section
      </div>
      {children}
    </div>
  )
}

export default function InvitedCandidatesPage() {
  const [candidates, setCandidates] = useState<Candidate[]>([])
  const [loading, setLoading] = useState(true)
  const [isGridView, setIsGridView] = useState(true)
  const [isPendingExpanded, setIsPendingExpanded] = useState(true)
  const [isAcceptedExpanded, setIsAcceptedExpanded] = useState(true)
  const [isDeclinedExpanded, setIsDeclinedExpanded] = useState(true)
  const [isFavoritesExpanded, setIsFavoritesExpanded] = useState(true)
  const [sortBy, setSortBy] = useState<"relevance" | "recent" | "alphabetical">("relevance")

  const [searchParams, setSearchParams] = useState<{ firstName: string; lastName: string }>({
    firstName: "",
    lastName: "",
  })
  const [searchActive, setSearchActive] = useState(false)
  const [searchResults, setSearchResults] = useState<Candidate[]>([])

  const [viewInviteModal, setViewInviteModal] = useState<{
    open: boolean
    candidate?: Candidate
  }>({ open: false, candidate: undefined })

  const [inviteModal, setInviteModal] = useState<{
    open: boolean
    candidate?: SuggestedCandidate
  }>({ open: false, candidate: undefined })

  const [removeModal, setRemoveModal] = useState<{ open: boolean; candidateId?: string }>({ open: false, candidateId: undefined })

  const router = useRouter()
  const searchParamsNext = useSearchParams()

  async function fetchCandidates() {
    setLoading(true)
    const res = await fetch("/api/employers/invitedCandidates/displayInvites")
    const data = await res.json()
    const invitations = data.invitations || []
    setCandidates(
      invitations.map((invite: any) => {
        const student = invite.student || invite.registered_students || {}
        return {
          id: invite.id,
          name: `${student.first_name || ""} ${student.last_name || ""}`.trim(),
          school: student.course || "",
          yearSection: student.year || "",
          avatar: student.avatarUrl || "/placeholder.svg",
          coverPhoto: student.coverUrl || "https://dbuyxpovejdakzveiprx.supabase.co/storage/v1/object/public/app.images/default_cover.jpg",
          status: invite.status === "invited" ? "pending" : invite.status || "pending",
          date: invite.invited_at ? new Date(invite.invited_at).toLocaleDateString() : "",
          isFavorite: invite.is_favorite ?? false,
          program: student.course || "",
          matchScore: invite.matchScore || 0,
          jobTitle: invite.jobTitle || "",
          employerName: invite.employerName || "",
          companyName: invite.companyName || "",
          message: invite.message || "",
          jobId: invite.job_id,
          studentId: invite.student_id 
        }
      })
    )
    setLoading(false)
  }

  useEffect(() => {
    fetchCandidates()
  }, [])

  useEffect(() => {
    const inviteId = searchParamsNext?.get("inviteId")
    if (inviteId && candidates.length > 0) {
      const [jobId, studentId] = inviteId.split("_")
      const candidate = candidates.find(
        c => (c.jobId === jobId || c.jobId === jobId) && (c.studentId === studentId || c.studentId === studentId)
      )
      if (candidate) {
        setViewInviteModal({ open: true, candidate })
      }
    }
  }, [searchParamsNext, candidates])

  const handleSearch = (firstName: string, lastName: string) => {
    setSearchParams({ firstName, lastName })
    const normalize = (s: string) => s.trim().toLowerCase()
    const fName = normalize(firstName)
    const lName = normalize(lastName)
    const filtered = candidates.filter((c) => {
      const [candidateFirst, ...rest] = c.name.split(" ")
      const candidateLast = rest.join(" ")
      const matchFirst = fName ? candidateFirst.toLowerCase().includes(fName) : true
      const matchLast = lName ? candidateLast.toLowerCase().includes(lName) : true
      return matchFirst && matchLast
    })
    setSearchResults(filtered)
    setSearchActive(!!fName || !!lName)
  }

  const handleClearSearch = () => {
    setSearchParams({ firstName: "", lastName: "" })
    setSearchResults([])
    setSearchActive(false)
  }

  const handleToggleFavorite = async (candidateId: string) => {
    await fetch("/api/employers/invitedCandidates/actionsInvites", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "favorite", invitationId: candidateId }),
    })
    setCandidates((prev) =>
      prev.map((candidate) =>
        candidate.id === candidateId ? { ...candidate, isFavorite: true } : candidate,
      ),
    )
  }

  const handleRemoveCandidate = async (candidateId: string) => {
    setRemoveModal({ open: true, candidateId })
  }

  const confirmRemoveCandidate = async () => {
    if (!removeModal.candidateId) return
    await fetch("/api/employers/invitedCandidates/actionsInvites", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "remove", invitationId: removeModal.candidateId }),
    })
    await fetchCandidates()
    setRemoveModal({ open: false, candidateId: undefined })
  }

  const handleEditCandidate = async (candidate: Candidate) => {
    setInviteModal({
      open: true,
      candidate: {
        id: candidate.id,
        name: candidate.name,
        avatar: candidate.avatar,
        program: candidate.program,
        yearSection: candidate.yearSection,
        matchPercentage: candidate.matchScore ?? 0,
        school: "",
        jobTitle: candidate.jobTitle ?? candidate.program ?? "",
        jobTitleRaw: candidate.jobTitle ?? candidate.program ?? "",
        jobId: candidate.jobId,
        studentId: candidate.studentId
      },
    })
  }

  const pendingCandidates = candidates.filter((candidate) => candidate.status === "pending")
  const acceptedCandidates = candidates.filter((candidate) => candidate.status === "accepted")
  const declinedCandidates = candidates.filter((candidate) => candidate.status === "declined")
  const favoriteCandidates = candidates.filter((candidate) => candidate.isFavorite)


  const handleViewInvite = (candidateId: string) => {
    const candidate = candidates.find((c) => c.id === candidateId)
    if (candidate) {
      setViewInviteModal({ open: true, candidate })
    }
  }

  const [sectionOrder, setSectionOrder] = useState<string[]>([
    "favorites",
    "pending",
    "accepted",
    "declined",
  ])

  const sectionData: Record<string, { key: string; show: boolean; node: React.ReactElement }> = {
    favorites: {
      key: "favorites",
      show: favoriteCandidates.length > 0,
      node: (
        <Card>
          <div className="border-b p-4">
            <div
              className="flex justify-between items-center cursor-pointer"
              onClick={() => setIsFavoritesExpanded((prev) => !prev)}
            >
              <h3 className="text-blue-700 font-medium flex items-center">
                <Star className="h-4 w-4 mr-2 text-yellow-500 fill-yellow-500" />
                Favorite Candidates
                <Badge variant="outline" className="ml-2 bg-yellow-50 text-yellow-600 border-yellow-200">
                  {favoriteCandidates.length}
                </Badge>
              </h3>
              <ChevronDown
                className={`h-4 w-4 transition-transform ${isFavoritesExpanded ? "rotate-180" : ""}`}
              />
            </div>
          </div>
          <Collapse in={isFavoritesExpanded}>
            <CardContent className="p-4">
              <div className={isGridView ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
                {favoriteCandidates.map((candidate) =>
                  isGridView ? (
                    <CandidateCard
                      key={candidate.id}
                      candidate={candidate}
                      onToggleFavorite={handleToggleFavorite}
                      onRemoveCandidate={handleRemoveCandidate}
                      onViewInvite={handleViewInvite}
                    />
                  ) : (
                    <CandidateListItem
                      key={candidate.id}
                      candidate={candidate}
                      onToggleFavorite={handleToggleFavorite}
                      onRemoveCandidate={handleRemoveCandidate}
                      onViewInvite={handleViewInvite}
                    />
                  ),
                )}
              </div>
            </CardContent>
          </Collapse>
        </Card>
      ),
    },
    pending: {
      key: "pending",
      show: pendingCandidates.length > 0,
      node: (
        <Card>
          <div className="border-b p-4">
            <div
              className="flex justify-between items-center cursor-pointer"
              onClick={() => setIsPendingExpanded((prev) => !prev)}
            >
              <h3 className="text-blue-700 font-medium flex items-center">
                <Clock className="h-4 w-4 mr-2 text-orange-500" />
                Pending Invitations
                <Badge variant="outline" className="ml-2 bg-orange-50 text-orange-600 border-orange-200">
                  {pendingCandidates.length}
                </Badge>
              </h3>
              <ChevronDown className={`h-4 w-4 transition-transform ${isPendingExpanded ? "rotate-180" : ""}`} />
            </div>
          </div>
          <Collapse in={isPendingExpanded}>
            <CardContent className="p-4">
              <div className={isGridView ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
                {pendingCandidates.map((candidate) =>
                  isGridView ? (
                    <CandidateCard
                      key={candidate.id}
                      candidate={candidate}
                      onToggleFavorite={handleToggleFavorite}
                      onRemoveCandidate={handleRemoveCandidate}
                      onViewInvite={handleViewInvite}
                    />
                  ) : (
                    <CandidateListItem
                      key={candidate.id}
                      candidate={candidate}
                      onToggleFavorite={handleToggleFavorite}
                      onRemoveCandidate={handleRemoveCandidate}
                      onViewInvite={handleViewInvite}
                    />
                  ),
                )}
              </div>
            </CardContent>
          </Collapse>
        </Card>
      ),
    },
    accepted: {
      key: "accepted",
      show: acceptedCandidates.length > 0,
      node: (
        <Card>
          <div className="border-b p-4">
            <div
              className="flex justify-between items-center cursor-pointer"
              onClick={() => setIsAcceptedExpanded((prev) => !prev)}
            >
              <h3 className="text-blue-700 font-medium flex items-center">
                <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                Accepted Invitations
                <Badge variant="outline" className="ml-2 bg-green-50 text-green-600 border-green-200">
                  {acceptedCandidates.length}
                </Badge>
              </h3>
              <ChevronDown className={`h-4 w-4 transition-transform ${isAcceptedExpanded ? "rotate-180" : ""}`} />
            </div>
          </div>
          <Collapse in={isAcceptedExpanded}>
            <CardContent className="p-4">
              <div className={isGridView ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
                {acceptedCandidates.map((candidate) =>
                  isGridView ? (
                    <CandidateCard
                      key={candidate.id}
                      candidate={candidate}
                      onToggleFavorite={handleToggleFavorite}
                      onRemoveCandidate={handleRemoveCandidate}
                      onViewInvite={handleViewInvite}
                    />
                  ) : (
                    <CandidateListItem
                      key={candidate.id}
                      candidate={candidate}
                      onToggleFavorite={handleToggleFavorite}
                      onRemoveCandidate={handleRemoveCandidate}
                      onViewInvite={handleViewInvite}
                    />
                  ),
                )}
              </div>
            </CardContent>
          </Collapse>
        </Card>
      ),
    },
    declined: {
      key: "declined",
      show: declinedCandidates.length > 0,
      node: (
        <Card>
          <div className="border-b p-4">
            <div
              className="flex justify-between items-center cursor-pointer"
              onClick={() => setIsDeclinedExpanded((prev) => !prev)}
            >
              <h3 className="text-blue-700 font-medium flex items-center">
                <XCircle className="h-4 w-4 mr-2 text-red-500" />
                Declined Invitations
                <Badge variant="outline" className="ml-2 bg-red-50 text-red-600 border-red-200">
                  {declinedCandidates.length}
                </Badge>
              </h3>
              <ChevronDown className={`h-4 w-4 transition-transform ${isDeclinedExpanded ? "rotate-180" : ""}`} />
            </div>
          </div>
          <Collapse in={isDeclinedExpanded}>
            <CardContent className="p-4">
              <div className={isGridView ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
                {declinedCandidates.map((candidate) =>
                  isGridView ? (
                    <CandidateCard
                      key={candidate.id}
                      candidate={candidate}
                      onToggleFavorite={handleToggleFavorite}
                      onRemoveCandidate={handleRemoveCandidate}
                      onViewInvite={handleViewInvite}
                    />
                  ) : (
                    <CandidateListItem
                      key={candidate.id}
                      candidate={candidate}
                      onToggleFavorite={handleToggleFavorite}
                      onRemoveCandidate={handleRemoveCandidate}
                      onViewInvite={handleViewInvite}
                    />
                  ),
                )}
              </div>
            </CardContent>
          </Collapse>
        </Card>
      ),
    },
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:20px_20px]"></div>
        </div>
        <div className="max-w-7xl mx-auto px-6 py-8 relative">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Invited Candidates</h1>
              <p className="text-blue-100">
                Track and manage your invitation responses • {candidates.length} total invitations
              </p>
            </div>
          </div>
        </div>
      </div>
 

      {/* Modals */}
      {removeModal.open && (
        <Dialog open={removeModal.open} onOpenChange={() => setRemoveModal({ open: false, candidateId: undefined })}>
          <DialogContent>
            <DialogTitle>Remove Candidate</DialogTitle>
            <div className="py-4">
              <p className="text-red-600 font-semibold mb-2">Are you sure you want to remove this candidate?</p>
              <p className="text-gray-700 mb-4">This action cannot be undone and will cancel the invitation.</p>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setRemoveModal({ open: false, candidateId: undefined })}>
                  Cancel
                </Button>
                <Button className="bg-red-600 hover:bg-red-700 text-white" onClick={confirmRemoveCandidate}>
                  Remove
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {viewInviteModal.open && viewInviteModal.candidate && (
        <ViewInviteModal
          open={viewInviteModal.open}
          onClose={() => setViewInviteModal({ open: false })}
          invitation={{
            id: viewInviteModal.candidate.id,
            candidateName: viewInviteModal.candidate.name,
            candidateAvatar: viewInviteModal.candidate.avatar,
            jobTitle: viewInviteModal.candidate.jobTitle || viewInviteModal.candidate.program || "Job Invitation",
            matchScore: viewInviteModal.candidate.matchScore || 0,
            message: viewInviteModal.candidate.message,
            sentDate: viewInviteModal.candidate.date,
            status: viewInviteModal.candidate.status,
            companyName: viewInviteModal.candidate.companyName || viewInviteModal.candidate.school,
            companyLogo: "",
            employerName: viewInviteModal.candidate.employerName || "",
            employerAvatar: "",
            course: viewInviteModal.candidate.school,
            year: viewInviteModal.candidate.yearSection,
            jobTitleRaw: viewInviteModal.candidate.jobTitle || viewInviteModal.candidate.program,
          }}
          onEdit={() => {
            setViewInviteModal({ open: false })
            if (viewInviteModal.candidate) handleEditCandidate(viewInviteModal.candidate)
          }}
          onResend={() => setViewInviteModal({ open: false })}
          onRefresh={fetchCandidates}
        />
      )}

      {inviteModal.open && inviteModal.candidate && (
        <InvitationModal
          open={inviteModal.open}
          onClose={async () => {
            setInviteModal({ open: false, candidate: inviteModal.candidate })
            await fetchCandidates()
          }}
          candidate={{
            name: inviteModal.candidate?.name ?? "",
            avatar: inviteModal.candidate?.avatar ?? "",
            program: inviteModal.candidate?.program ?? "",
            yearSection: inviteModal.candidate?.yearSection ?? "",
            matchScore: inviteModal.candidate?.matchPercentage ?? 0,
            id: inviteModal.candidate?.studentId || undefined,
          }}
          jobTitles={[
            inviteModal.candidate?.jobTitle ??
            inviteModal.candidate?.jobTitleRaw ??
            inviteModal.candidate?.program ??
            "Job Invitation"
          ]}
          jobMatchScores={{
            [inviteModal.candidate?.jobTitle ??
              inviteModal.candidate?.jobTitleRaw ??
              inviteModal.candidate?.program ??
              "Job Invitation"]: inviteModal.candidate?.matchPercentage ?? 0,
          }}
          // Only pass onSend if editing (i.e., if inviteModal.candidate.id exists and is an existing invitation)
          {...(inviteModal.candidate?.id ? {
            onSend: async (message, jobTitle) => {
              const jobId =
                inviteModal.candidate?.jobId ??
                jobTitle
              const student_id = inviteModal.candidate?.studentId && inviteModal.candidate.studentId !== "" 
                ? inviteModal.candidate.studentId 
                : undefined;
              await fetch("/api/employers/invitedCandidates/actionsInvites", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  action: "edit",
                  invitationId: inviteModal.candidate?.id ?? "",
                  data: {
                    message,
                    job_id: jobId,
                    ...(student_id ? { student_id } : {}),
                  },
                }),
              })
              setInviteModal({ open: false, candidate: inviteModal.candidate })
              await fetchCandidates()
            }
          } : {})}
        />
      )}

      <div className="max-w-7xl mx-auto px-6 py-6 space-y-6">
        {loading && (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="animate-spin h-8 w-8 text-blue-600" />
          </div>
        )}
        {!loading && (
          <>
            <Card>
              <CardContent className="p-4">
                <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
                  <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center flex-1">
                    <div className="flex gap-2 flex-1 max-w-md">
                      <Input
                        placeholder="First name"
                        value={searchParams.firstName}
                        onChange={(e) => handleSearch(e.target.value, searchParams.lastName)}
                        className="flex-1"
                      />
                      <Input
                        placeholder="Last name"
                        value={searchParams.lastName}
                        onChange={(e) => handleSearch(searchParams.firstName, e.target.value)}
                        className="flex-1"
                      />
                      {searchActive && (
                        <Button variant="outline" onClick={handleClearSearch}>
                          Clear
                        </Button>
                      )}
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium text-gray-700">Sort by:</span>
                      <Select value={sortBy} onValueChange={(value: string) => setSortBy(value as "relevance" | "recent" | "alphabetical")}>
                        <SelectTrigger className="w-[140px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="relevance">Relevance</SelectItem>
                          <SelectItem value="recent">Recent</SelectItem>
                          <SelectItem value="alphabetical">Alphabetical</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={() => setIsGridView(!isGridView)}>
                      {isGridView ? <List className="h-4 w-4" /> : <LuLayoutGrid className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Fallback for no invitations */}
            {candidates.length === 0 && !searchActive && (
              <div className="flex flex-col items-center justify-center py-24 text-center text-gray-400">
                <Mail className="w-16 h-16 mb-4 text-blue-200" />
                <h2 className="text-xl font-semibold mb-2 text-gray-500">No Invitations Yet</h2>
                <p className="mb-2 text-gray-400">You haven&apos;t invited any candidates yet.<br />Start inviting to see them here!</p>
                <Button
                  className="mt-6 px-6 py-2 rounded bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold shadow hover:from-blue-700 hover:to-purple-700 transition"
                  onClick={() => router.push("/employers/jobs/candidate-matches")}
                >
                  Go to Candidate Matches
                </Button>
              </div>
            )}

            {searchActive && (
              <Card>
                <CardContent className="p-0">
                  <div className="border-b bg-gradient-to-r from-blue-50 to-blue-100 p-4">
                    <h2 className="text-blue-700 font-medium flex items-center">
                      <Search className="h-4 w-4 mr-2" />
                      Search Results ({searchResults.length})
                    </h2>
                  </div>
                  <div className="p-4">
                    {searchResults.length > 0 ? (
                      <div className={isGridView ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
                        {searchResults.map((candidate) =>
                          isGridView ? (
                            <CandidateCard
                              key={candidate.id}
                              candidate={candidate}
                              onToggleFavorite={handleToggleFavorite}
                              onRemoveCandidate={handleRemoveCandidate}
                              onViewInvite={handleViewInvite}
                            />
                          ) : (
                            <CandidateListItem
                              key={candidate.id}
                              candidate={candidate}
                              onToggleFavorite={handleToggleFavorite}
                              onRemoveCandidate={handleRemoveCandidate}
                              onViewInvite={handleViewInvite}
                            />
                          ),
                        )}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500">No candidates found</div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            <DndContext
              onDragEnd={(e) => {
                const { active, over } = e
                if (over && active.id !== over.id && typeof active.id === "string" && typeof over.id === "string") {
                  setSectionOrder((prev: string[]) => {
                    const oldIndex = prev.indexOf(active.id as string)
                    const newIndex = prev.indexOf(over.id as string)
                    return arrayMove(prev, oldIndex, newIndex) as string[]
                  })
                }
              }}
            >
              <SortableContext items={sectionOrder} strategy={verticalListSortingStrategy}>
                <div className="space-y-6">
                  {sectionOrder.map((sectionKey) => {
                    const section = sectionData[sectionKey]
                    if (!section.show) return null
                    return (
                      <SortableSection key={section.key} id={section.key}>
                        {section.node}
                      </SortableSection>
                    )
                  })}
                </div>
              </SortableContext>
            </DndContext>
          </>
        )}
      </div>
    </div>
  )
}

interface CandidateCardProps {
  candidate: Candidate
  onToggleFavorite: (id: string) => void
  onRemoveCandidate: (id: string) => void
  onViewInvite: (id: string) => void
}

function CandidateCard({ candidate, onToggleFavorite, onRemoveCandidate, onViewInvite }: CandidateCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-orange-100 text-orange-700 border-orange-200"
      case "accepted":
        return "bg-green-100 text-green-700 border-green-200"
      case "declined":
        return "bg-red-100 text-red-700 border-red-200"
      default:
        return "bg-gray-100 text-gray-700 border-gray-200"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "Pending"
      case "accepted":
        return "Accepted"
      case "declined":
        return "Declined"
      default:
        return "Unknown"
    }
  }

  const getMatchScoreColor = (score?: number) => {
    if (typeof score !== "number") return "bg-gray-200 text-gray-700"
    if (score >= 60) return "bg-green-600 text-white"
    if (score >= 25) return "bg-orange-500 text-white"
    return "bg-gray-200 text-gray-700"
  }

  return (
    <Card className="overflow-visible hover:shadow-lg transition-all duration-300 group">
      <div className="relative h-32 bg-gradient-to-r from-blue-500 to-purple-500">
        <Image
          src={candidate.coverPhoto || "/placeholder.svg"}
          alt="Cover"
          fill
          className="w-full h-full object-cover opacity-80 absolute z-0"
          style={{ objectFit: "cover" }}
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent z-0" />

        {candidate.matchScore !== undefined && (
          <div className="absolute top-3 left-3 z-10">
            <Badge className={`font-semibold backdrop-blur-sm ${getMatchScoreColor(candidate.matchScore)}`}>
              <TrendingUp className="h-3 w-3 mr-1" />
              {candidate.matchScore}% Match
            </Badge>
          </div>
        )}

        <div className="absolute top-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
          <Button
            size="sm"
            variant="secondary"
            className="h-8 w-8 p-0 bg-white/90 hover:bg-white backdrop-blur-sm"
            onClick={() => onToggleFavorite(candidate.id)}
          >
            <Heart className={`h-4 w-4 ${candidate.isFavorite ? "fill-red-500 text-red-500" : "text-gray-600"}`} />
          </Button>
          <Button
            size="sm"
            variant="secondary"
            className="h-8 w-8 p-0 bg-white/90 hover:bg-white backdrop-blur-sm"
            onClick={() => onRemoveCandidate(candidate.id)}
          >
            <Trash2 className="h-4 w-4 text-red-600" />
          </Button>
        </div>

        <Avatar className="absolute -bottom-4 left-4 h-14 w-14 border-4 border-white z-20">
          <AvatarImage src={candidate.avatar || "/placeholder.svg"} alt={candidate.name} />
          <AvatarFallback>
            {candidate.name
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </AvatarFallback>
        </Avatar>
      </div>

      <CardContent className="pt-10 pb-4 px-4">
        <div className="space-y-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-gray-900">{candidate.name}</h3>
              {candidate.isFavorite && <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />}
            </div>
            <p className="text-sm text-gray-600">{candidate.yearSection}</p>
            <div className="flex items-center gap-2 mt-1">
              <div className="bg-yellow-400 text-black text-xs font-bold px-1 py-0.5 rounded">STI</div>
              <span className="text-xs text-gray-500">{candidate.school}</span>
            </div>
          </div>
          <Badge variant="outline" className={getStatusColor(candidate.status)}>
            {getStatusText(candidate.status)}
          </Badge>
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">Invited {candidate.date}</span>
          </div>
          <div className="flex gap-2 pt-2">
            <Button
              size="sm"
              className="flex-1 bg-blue-600 hover:bg-blue-700"
              onClick={() => onViewInvite(candidate.id)}
            >
              <Mail className="h-4 w-4 mr-1" />
              View Invite
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function CandidateListItem({ candidate, onToggleFavorite, onRemoveCandidate, onViewInvite }: CandidateCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-orange-100 text-orange-700 border-orange-200"
      case "accepted":
        return "bg-green-100 text-green-700 border-green-200"
      case "declined":
        return "bg-red-100 text-red-700 border-red-200"
      default:
        return "bg-gray-100 text-gray-700 border-gray-200"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "Pending"
      case "accepted":
        return "Accepted"
      case "declined":
        return "Declined"
      default:
        return "Unknown"
    }
  }

  const getMatchScoreColor = (score?: number) => {
    if (typeof score !== "number") return "bg-gray-200 text-gray-700"
    if (score >= 60) return "bg-green-600 text-white"
    if (score >= 25) return "bg-orange-500 text-white"
    return "bg-gray-200 text-gray-700"
  }

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 flex-1">
            <div className="relative">
              <Avatar className="h-12 w-12 z-20">
                <AvatarImage src={candidate.avatar || "/placeholder.svg"} alt={candidate.name} />
                <AvatarFallback>
                  {candidate.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              {candidate.matchScore !== undefined && (
                <Badge className={`absolute -top-2 -right-2 text-xs px-1 py-0 ${getMatchScoreColor(candidate.matchScore)}`}>
                  {candidate.matchScore}%
                </Badge>
              )}
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-gray-900">{candidate.name}</h3>
                {candidate.isFavorite && <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />}
                <Badge variant="outline" className={getStatusColor(candidate.status)}>
                  {getStatusText(candidate.status)}
                </Badge>
              </div>

              <p className="text-sm text-gray-600 mb-1">{candidate.yearSection}</p>

              <div className="flex items-center gap-4 text-xs text-gray-500 mb-2">
                <div className="flex items-center gap-1">
                  <div className="bg-yellow-400 text-black text-xs font-bold px-1 py-0.5 rounded">STI</div>
                  <span>{candidate.school}</span>
                </div>
                <span>Invited {candidate.date}</span>
              </div>

              <Badge variant="outline" className={getStatusColor(candidate.status)}>
                {getStatusText(candidate.status)}
              </Badge>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline" onClick={() => onToggleFavorite(candidate.id)}>
              <Heart className={`h-4 w-4 mr-1 ${candidate.isFavorite ? "fill-red-500 text-red-500" : ""}`} />
              Save
            </Button>
            <Button size="sm" className="bg-blue-600 hover:bg-blue-700" onClick={() => onViewInvite(candidate.id)}>
              <Mail className="h-4 w-4 mr-1" />
              View Invite
            </Button>
            <Button
              size="sm"
              variant="secondary"
              className="h-8 w-8 p-0 bg-white/90 hover:bg-white backdrop-blur-sm"
              onClick={() => onRemoveCandidate(candidate.id)}
            >
              <Trash2 className="h-4 w-4 text-red-600" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function arrayMove(arr: unknown[], from: number, to: number) {
  const item = arr[from]
  const newArr = arr.filter((_, index) => index !== from)
  newArr.splice(to, 0, item)
  return newArr
}
