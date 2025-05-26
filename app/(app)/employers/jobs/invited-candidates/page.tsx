"use client"

import { useState } from "react"
import {
  ChevronDown,
  MoreHorizontal,
  List,
  Star,
  X,
  Mail,
  Trash2,
  Clock,
  CheckCircle,
  XCircle,
  User,
  Search,
  TrendingUp,
  Heart,
  Share2,
  Send,
} from "lucide-react"
import { LuLayoutGrid } from "react-icons/lu"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import Collapse from "@mui/material/Collapse"
import ViewInviteModal from "./components/invitation-preview"
import InvitationModal from "./components/invitation-modal"
import { DndContext } from "@dnd-kit/core"
import { SortableContext, verticalListSortingStrategy, useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"

interface Candidate {
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
}

interface SuggestedCandidate {
  id: string
  name: string
  school: string
  yearSection: string
  avatar: string
  coverPhoto?: string
  matchPercentage: number
  program?: string
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
  const [candidates, setCandidates] = useState<Candidate[]>([
    {
      id: "c1",
      name: "Kemly Rose",
      school: "STI Alabang",
      yearSection: "3rd year - 611",
      avatar: "/placeholder.svg?height=100&width=100",
      coverPhoto: "/placeholder.svg?height=200&width=400",
      status: "pending",
      date: "May 10, 2025",
      isFavorite: true,
      program: "BS - Information Technology",
      matchScore: 95,
    },
    {
      id: "c2",
      name: "Kemlerin Kemeli",
      school: "STI Alabang",
      yearSection: "2nd year - 512",
      avatar: "/placeholder.svg?height=100&width=100",
      coverPhoto: "/placeholder.svg?height=200&width=400",
      status: "accepted",
      date: "May 8, 2025",
      isFavorite: false,
      program: "BS - Information Technology",
      matchScore: 88,
    },
    {
      id: "c3",
      name: "Edrian Sevilla",
      school: "STI Alabang",
      yearSection: "4th year - 710",
      avatar: "/placeholder.svg?height=100&width=100",
      coverPhoto: "/placeholder.svg?height=200&width=400",
      status: "declined",
      date: "May 5, 2025",
      isFavorite: false,
      program: "BS - Information Technology",
      matchScore: 82,
    },
    {
      id: "c4",
      name: "Suzeyn Zeyn",
      school: "STI Alabang",
      yearSection: "1st year - 101",
      avatar: "/placeholder.svg?height=100&width=100",
      coverPhoto: "/placeholder.svg?height=200&width=400",
      status: "pending",
      date: "May 3, 2025",
      isFavorite: false,
      program: "BS - Information Technology",
      matchScore: 90,
    },
    {
      id: "c5",
      name: "Reri Wu",
      school: "STI Alabang",
      yearSection: "3rd year - 611",
      avatar: "/placeholder.svg?height=100&width=100",
      coverPhoto: "/placeholder.svg?height=200&width=400",
      status: "accepted",
      date: "April 29, 2025",
      isFavorite: true,
      program: "BS - Information Technology",
      matchScore: 89,
    },
  ])

  const suggestedCandidates: SuggestedCandidate[] = [
    {
      id: "s1",
      name: "Jamal Janrei",
      school: "STI College Alabang",
      yearSection: "4th year - 710",
      avatar: "/placeholder.svg?height=100&width=100",
      coverPhoto: "/placeholder.svg?height=200&width=400",
      matchPercentage: 95,
      program: "BS - Information Technology",
    },
    {
      id: "s2",
      name: "Valentina Valentines",
      school: "STI College Alabang",
      yearSection: "3rd year - 611",
      avatar: "/placeholder.svg?height=100&width=100",
      coverPhoto: "/placeholder.svg?height=200&width=400",
      matchPercentage: 88,
      program: "BS - Information Technology",
    },
    {
      id: "s3",
      name: "Zeyn Delevwa",
      school: "STI College Alabang",
      yearSection: "2nd year - 512",
      avatar: "/placeholder.svg?height=100&width=100",
      coverPhoto: "/placeholder.svg?height=200&width=400",
      matchPercentage: 82,
      program: "BS - Information Technology",
    },
    {
      id: "s4",
      name: "Reri Wu",
      school: "STI College Alabang",
      yearSection: "4th year - 710",
      avatar: "/placeholder.svg?height=100&width=100",
      coverPhoto: "/placeholder.svg?height=200&width=400",
      matchPercentage: 78,
      program: "BS - Information Technology",
    },
  ]

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

  const handleToggleFavorite = (candidateId: string) => {
    setCandidates((prev) =>
      prev.map((candidate) =>
        candidate.id === candidateId ? { ...candidate, isFavorite: !candidate.isFavorite } : candidate,
      ),
    )
  }

  const handleRemoveCandidate = (candidateId: string) => {
    setCandidates((prev) => prev.filter((candidate) => candidate.id !== candidateId))
  }

  const pendingCandidates = candidates.filter((candidate) => candidate.status === "pending")
  const acceptedCandidates = candidates.filter((candidate) => candidate.status === "accepted")
  const declinedCandidates = candidates.filter((candidate) => candidate.status === "declined")
  const favoriteCandidates = candidates.filter((candidate) => candidate.isFavorite)

  const handleInviteClick = (candidate: SuggestedCandidate) => {
    setInviteModal({ open: true, candidate })
  }

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
      {/* Header */}
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
      {viewInviteModal.open && viewInviteModal.candidate && (
        <ViewInviteModal
          open={viewInviteModal.open}
          onClose={() => setViewInviteModal({ open: false })}
          invitation={{
            id: viewInviteModal.candidate.id,
            candidateName: viewInviteModal.candidate.name,
            candidateAvatar: viewInviteModal.candidate.avatar,
            jobTitle: viewInviteModal.candidate.program || "Job Invitation",
            matchScore: viewInviteModal.candidate.matchScore || 0,
            message: "Thank you for your interest. Please review the invitation details.",
            sentDate: viewInviteModal.candidate.date,
            status: viewInviteModal.candidate.status,
            companyName: "STI Alabang",
            companyLogo: "",
            employerName: "Employer Name",
            employerAvatar: "",
          }}
          onEdit={() => setViewInviteModal({ open: false })}
          onResend={() => setViewInviteModal({ open: false })}
        />
      )}

      {inviteModal.open && inviteModal.candidate && (
        <InvitationModal
          open={inviteModal.open}
          onClose={() => setInviteModal({ open: false, candidate: inviteModal.candidate })}
          candidate={{
            name: inviteModal.candidate.name,
            avatar: inviteModal.candidate.avatar,
            program: inviteModal.candidate.program,
            yearSection: inviteModal.candidate.yearSection,
            matchScore: inviteModal.candidate.matchPercentage,
          }}
          jobTitles={[inviteModal.candidate.program || "Job Invitation"]}
          jobMatchScores={{
            [inviteModal.candidate.program || "Job Invitation"]: inviteModal.candidate.matchPercentage,
          }}
          onSend={() => {}} 
        />
      )}

      <div className="max-w-7xl mx-auto px-6 py-6 space-y-6">
        {/* Search and Filters */}
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

        {/* Search Results Section */}
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

        {/* Suggested Candidates Section */}
        <Card>
          <div className="border-b p-4">
            <div className="flex justify-between items-center">
              <h2 className="text-blue-700 font-medium">Suggested Candidates</h2>
              <Button variant="ghost" className="text-blue-600 hover:text-blue-700">
                View All
              </Button>
            </div>
          </div>
          <CardContent className="p-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {suggestedCandidates.map((candidate) => (
                <SuggestedCandidateCard
                  key={candidate.id}
                  candidate={candidate}
                  onInvite={() => handleInviteClick(candidate)}
                />
              ))}
            </div>
          </CardContent>
        </Card>
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

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 group">
      {/* Cover Photo */}
      <div className="relative h-32 bg-gradient-to-r from-blue-500 to-purple-500 overflow-hidden">
        <img
          src={candidate.coverPhoto || "/placeholder.svg"}
          alt="Cover"
          className="w-full h-full object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />

        {/* Match Score Badge */}
        {candidate.matchScore && (
          <div className="absolute top-3 left-3">
            <Badge className="bg-white/90 text-gray-900 font-semibold backdrop-blur-sm">
              <TrendingUp className="h-3 w-3 mr-1" />
              {candidate.matchScore}% Match
            </Badge>
          </div>
        )}

        {/* Quick Actions */}
        <div className="absolute top-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            size="sm"
            variant="secondary"
            className="h-8 w-8 p-0 bg-white/90 hover:bg-white backdrop-blur-sm"
            onClick={() => onToggleFavorite(candidate.id)}
          >
            <Heart className={`h-4 w-4 ${candidate.isFavorite ? "fill-red-500 text-red-500" : "text-gray-600"}`} />
          </Button>
          <Button size="sm" variant="secondary" className="h-8 w-8 p-0 bg-white/90 hover:bg-white backdrop-blur-sm">
            <Share2 className="h-4 w-4 text-gray-600" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="sm" variant="secondary" className="h-8 w-8 p-0 bg-white/90 hover:bg-white backdrop-blur-sm">
                <MoreHorizontal className="h-4 w-4 text-gray-600" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onRemoveCandidate(candidate.id)} className="text-red-600">
                <Trash2 className="h-4 w-4 mr-2" />
                Remove Candidate
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Avatar */}
        <Avatar className="absolute -bottom-6 left-4 h-12 w-12 border-4 border-white">
          <AvatarImage src={candidate.avatar || "/placeholder.svg"} alt={candidate.name} />
          <AvatarFallback>
            {candidate.name
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </AvatarFallback>
        </Avatar>
      </div>

      <CardContent className="pt-8 pb-4 px-4">
        <div className="space-y-3">
          {/* Name and Details */}
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

          {/* Program */}
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200 text-xs">
            {candidate.program}
          </Badge>

          {/* Status and Date */}
          <div className="flex items-center justify-between">
            <Badge variant="outline" className={getStatusColor(candidate.status)}>
              {getStatusText(candidate.status)}
            </Badge>
            <span className="text-xs text-gray-500">Invited {candidate.date}</span>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-2">
            <Button variant="outline" size="sm" className="flex-1">
              <User className="h-4 w-4 mr-1" />
              View Profile
            </Button>
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

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 flex-1">
            <div className="relative">
              <Avatar className="h-12 w-12">
                <AvatarImage src={candidate.avatar || "/placeholder.svg"} alt={candidate.name} />
                <AvatarFallback>
                  {candidate.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              {candidate.matchScore && (
                <Badge className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs px-1 py-0">
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

              <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200 text-xs">
                {candidate.program}
              </Badge>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline" onClick={() => onToggleFavorite(candidate.id)}>
              <Heart className={`h-4 w-4 mr-1 ${candidate.isFavorite ? "fill-red-500 text-red-500" : ""}`} />
              Save
            </Button>

            <Button size="sm" variant="outline">
              <Share2 className="h-4 w-4 mr-1" />
              Share
            </Button>

            <Button variant="outline" size="sm">
              <User className="h-4 w-4 mr-1" />
              View Profile
            </Button>

            <Button size="sm" className="bg-blue-600 hover:bg-blue-700" onClick={() => onViewInvite(candidate.id)}>
              <Mail className="h-4 w-4 mr-1" />
              View Invite
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onRemoveCandidate(candidate.id)} className="text-red-600">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Remove Candidate
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

interface SuggestedCandidateProps {
  candidate: SuggestedCandidate
  onInvite?: () => void
}

function SuggestedCandidateCard({ candidate, onInvite }: SuggestedCandidateProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 group">
      {/* Cover Photo */}
      <div className="relative h-32 bg-gradient-to-r from-blue-500 to-purple-500 overflow-hidden">
        <img
          src={candidate.coverPhoto || "/placeholder.svg"}
          alt="Cover"
          className="w-full h-full object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />

        {/* Match Score Badge */}
        <div className="absolute top-3 left-3">
          <Badge className="bg-white/90 text-gray-900 font-semibold backdrop-blur-sm">
            <TrendingUp className="h-3 w-3 mr-1" />
            {candidate.matchPercentage}% Match
          </Badge>
        </div>

        {/* Close Button */}
        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button size="sm" variant="secondary" className="h-8 w-8 p-0 bg-white/90 hover:bg-white backdrop-blur-sm">
            <X className="h-4 w-4 text-gray-600" />
          </Button>
        </div>

        {/* Avatar */}
        <Avatar className="absolute -bottom-6 left-4 h-12 w-12 border-4 border-white">
          <AvatarImage src={candidate.avatar || "/placeholder.svg"} alt={candidate.name} />
          <AvatarFallback>
            {candidate.name
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </AvatarFallback>
        </Avatar>
      </div>

      <CardContent className="pt-8 pb-4 px-4">
        <div className="space-y-3">
          {/* Name and Details */}
          <div>
            <h3 className="font-semibold text-gray-900">{candidate.name}</h3>
            <p className="text-sm text-gray-600">{candidate.yearSection}</p>
            <div className="flex items-center gap-2 mt-1">
              <div className="bg-yellow-400 text-black text-xs font-bold px-1 py-0.5 rounded">STI</div>
              <span className="text-xs text-gray-500">{candidate.school}</span>
            </div>
          </div>

          {/* Program */}
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200 text-xs">
            {candidate.program}
          </Badge>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-2">
            <Button variant="outline" size="sm" className="flex-1">
              <User className="h-4 w-4 mr-1" />
              View Profile
            </Button>
            <Button size="sm" className="flex-1 bg-blue-600 hover:bg-blue-700" onClick={onInvite}>
              <Send className="h-4 w-4 mr-1" />
              Invite
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
