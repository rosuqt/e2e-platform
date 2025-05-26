"use client"

import type React from "react"

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
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, Menu, MenuItem, Collapse, FormControl, Select } from "@mui/material"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import SearchSection from "../../../students/people/components/search-section"
import { LuLayoutGrid } from "react-icons/lu"
import InvitationModal from "./components/invitation-modal"
import ViewInviteModal from "./components/invitation-preview"

interface Candidate {
  id: string
  name: string
  school: string
  yearSection: string
  avatar: string
  status: "pending" | "accepted" | "declined"
  date: string
  isFavorite: boolean
  program?: string
}

interface SuggestedCandidate {
  id: string
  name: string
  school: string
  yearSection: string
  avatar: string
  matchPercentage: number
  program?: string
}

export default function InvitedCandidatesPage() {
  const [candidates, setCandidates] = useState<Candidate[]>([
    {
      id: "c1",
      name: "Kemly Rose",
      school: "STI Alabang",
      yearSection: "3rd year - 611",
      avatar: "/placeholder.svg?height=100&width=100",
      status: "pending",
      date: "May 10, 2025",
      isFavorite: true,
      program: "BS - Information Technology",
    },
    {
      id: "c2",
      name: "Kemlerin Kemeli",
      school: "STI Alabang",
      yearSection: "2nd year - 512",
      avatar: "/placeholder.svg?height=100&width=100",
      status: "accepted",
      date: "May 8, 2025",
      isFavorite: false,
      program: "BS - Information Technology",
    },
    {
      id: "c3",
      name: "Edrian Sevilla",
      school: "STI Alabang",
      yearSection: "4th year - 710",
      avatar: "/placeholder.svg?height=100&width=100",
      status: "declined",
      date: "May 5, 2025",
      isFavorite: false,
      program: "BS - Information Technology",
    },
    {
      id: "c4",
      name: "Suzeyn Zeyn",
      school: "STI Alabang",
      yearSection: "1st year - 101",
      avatar: "/placeholder.svg?height=100&width=100",
      status: "pending",
      date: "May 3, 2025",
      isFavorite: false,
      program: "BS - Information Technology",
    },
    {
      id: "c5",
      name: "Reri Wu",
      school: "STI Alabang",
      yearSection: "3rd year - 611",
      avatar: "/placeholder.svg?height=100&width=100",
      status: "accepted",
      date: "April 29, 2025",
      isFavorite: true,
      program: "BS - Information Technology",
    },
  ])

  const suggestedCandidates: SuggestedCandidate[] = [
    {
      id: "s1",
      name: "Jamal Janrei",
      school: "STI College Alabang",
      yearSection: "4th year - 710",
      avatar: "/placeholder.svg?height=100&width=100",
      matchPercentage: 95,
      program: "BS - Information Technology",
    },
    {
      id: "s2",
      name: "Valentina Valentines",
      school: "STI College Alabang",
      yearSection: "3rd year - 611",
      avatar: "/placeholder.svg?height=100&width=100",
      matchPercentage: 88,
      program: "BS - Information Technology",
    },
    {
      id: "s3",
      name: "Zeyn Delevwa",
      school: "STI College Alabang",
      yearSection: "2nd year - 512",
      avatar: "/placeholder.svg?height=100&width=100",
      matchPercentage: 82,
      program: "BS - Information Technology",
    },
    {
      id: "s4",
      name: "Reri Wu",
      school: "STI College Alabang",
      yearSection: "4th year - 710",
      avatar: "/placeholder.svg?height=100&width=100",
      matchPercentage: 78,
      program: "BS - Information Technology",
    },
  ]

  const [isGridView, setIsGridView] = useState(false)
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
  const [inviteModalOpen, setInviteModalOpen] = useState(false)
  const [selectedSuggested, setSelectedSuggested] = useState<SuggestedCandidate | null>(null)
  const [invitePreviewOpen, setInvitePreviewOpen] = useState(false)
  const [selectedInvite, setSelectedInvite] = useState<any>(null)

  const handleSearch = (params: { firstName: string; lastName: string }) => {
    setSearchParams(params)
    const { firstName, lastName } = params
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
    setSelectedSuggested(candidate)
    setInviteModalOpen(true)
  }

  // Helper to build invitation data for preview modal
  const buildInvitation = (candidate: Candidate) => ({
    id: candidate.id,
    candidateName: candidate.name,
    candidateAvatar: candidate.avatar,
    jobTitle: "Software Engineer", // Placeholder, replace as needed
    matchScore: 90, // Placeholder, replace as needed
    message: "We are excited to invite you to apply for our open position.", // Placeholder
    sentDate: candidate.date,
    status: candidate.status,
    companyName: "STI Alabang", // Placeholder, replace as needed
    companyLogo: "/placeholder.svg",
    employerName: "Employer Name", // Placeholder, replace as needed
    employerAvatar: "/placeholder.svg",
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-sky-100 p-4">
      <div className="max-w-6xl mx-auto space-y-6 ">
        <div className="top-0 z-0">
          <SearchSection
            title="Search Invited Candidates"
            description="Find and manage your invited candidates efficiently."
            bgColor="bg-gradient-to-r from-blue-700 to-blue-500"  
            icon={
              <span className="relative">
                <Mail className="h-8 w-8 text-white" />
                <Star className="h-4 w-4 text-yellow-400 absolute -top-1 -right-2 bg-blue-600 rounded-full p-0.5" />
              </span>
            }
            placeholderFirstName="First name"
            placeholderLastName="Last name"
            onSearch={handleSearch}
          />
        </div>
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 px-1">
          <div className="flex items-center">
            <span className="mr-2 text-sm text-gray-600">Sort by</span>
            <FormControl size="small" variant="outlined">
              <Select
                native
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                sx={{ minWidth: 140, backgroundColor: "white" }}
                inputProps={{ "aria-label": "Sort by" }}
              >
                <option value="relevance">Relevance</option>
                <option value="recent">Recent</option>
                <option value="alphabetical">Alphabetical</option>
              </Select>
            </FormControl>
          </div>
          <Button
            variant="outline"
            size="icon"
            className="rounded-full"
            onClick={() => setIsGridView((v) => !v)}
            aria-label={isGridView ? "List view" : "Grid view"}
          >
            {isGridView ? <List className="h-4 w-4 text-gray-500" /> : <LuLayoutGrid className="h-4 w-4 text-gray-500" />}
            <span className="sr-only">{isGridView ? "List view" : "Grid view"}</span>
          </Button>
        </div>

        {/* Search Results Section */}
        {searchActive && (
          <div className="bg-white rounded-xl shadow-md mb-6 overflow-hidden border border-blue-200">
            <div className="border-b border-blue-100 bg-gradient-to-r from-blue-50 to-blue-100 flex justify-between items-center">
              <div className="p-4">
                <h2 className="text-blue-700 font-medium flex items-center">
                  <Mail size={16} className="mr-2" />
                  Search Results
                </h2>
              </div>
              <button
                className="text-blue-600 font-medium hover:underline px-4"
                onClick={handleClearSearch}
                aria-label="Clear search"
              >
                Clear
              </button>
            </div>
            <div className="p-4">
              {searchResults.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {searchResults.map((candidate) => (
                    <CandidateCard
                      key={candidate.id}
                      candidate={candidate}
                      onToggleFavorite={handleToggleFavorite}
                      onRemoveCandidate={handleRemoveCandidate}
                      onViewInvite={() => {
                        setSelectedInvite(buildInvitation(candidate))
                        setInvitePreviewOpen(true)
                      }}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">No candidates found</div>
              )}
            </div>
          </div>
        )}

        {/* Favorites Section */}
        {favoriteCandidates.length > 0 && (
          <div className="bg-white rounded-xl shadow-md overflow-hidden border border-blue-200">
            <div className="flex justify-between items-center p-4 border-b border-blue-100">
              <h3 className="text-blue-700 font-medium flex items-center">
                <Star className="h-4 w-4 mr-1 text-yellow-500" />
                Favorite Candidates
              </h3>
              <Button
                variant="outline"
                size="icon"
                className="rounded-full"
                onClick={() => setIsFavoritesExpanded(!isFavoritesExpanded)}
              >
                <ChevronDown
                  size={16}
                  className={`transform transition-transform ${isFavoritesExpanded ? "rotate-180" : ""}`}
                />
              </Button>
            </div>
            <Collapse in={isFavoritesExpanded}>
              <div className="p-4">
                {isGridView ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {favoriteCandidates.map((candidate) => (
                      <CandidateCard
                        key={candidate.id}
                        candidate={candidate}
                        onToggleFavorite={handleToggleFavorite}
                        onRemoveCandidate={handleRemoveCandidate}
                        onViewInvite={() => {
                          setSelectedInvite(buildInvitation(candidate))
                          setInvitePreviewOpen(true)
                        }}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {favoriteCandidates.map((candidate) => (
                      <CandidateListItem
                        key={candidate.id}
                        candidate={candidate}
                        onToggleFavorite={handleToggleFavorite}
                        onRemoveCandidate={handleRemoveCandidate}
                        onViewInvite={() => {
                          setSelectedInvite(buildInvitation(candidate))
                          setInvitePreviewOpen(true)
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>
            </Collapse>
          </div>
        )}

        {/* Pending Candidates Section */}
        {pendingCandidates.length > 0 && (
          <div className="bg-white rounded-xl shadow-md overflow-hidden border border-blue-200">
            <div className="flex justify-between items-center p-4 border-b border-blue-100">
              <div className="flex items-center">
                <h3 className="text-blue-700 font-medium flex items-center">
                  <Clock className="h-4 w-4 mr-1 text-orange-500" />
                  Pending Invitations
                </h3>
                <Badge variant="outline" className="ml-2 bg-orange-50 text-orange-600 border-orange-200">
                  {pendingCandidates.length}
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full"
                  onClick={() => setIsPendingExpanded(!isPendingExpanded)}
                >
                  <ChevronDown
                    size={16}
                    className={`transform transition-transform ${isPendingExpanded ? "rotate-180" : ""}`}
                  />
                </Button>
              </div>
            </div>
            <Collapse in={isPendingExpanded}>
              <div className="p-4">
                {isGridView ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {pendingCandidates.map((candidate) => (
                      <CandidateCard
                        key={candidate.id}
                        candidate={candidate}
                        onToggleFavorite={handleToggleFavorite}
                        onRemoveCandidate={handleRemoveCandidate}
                        onViewInvite={() => {
                          setSelectedInvite(buildInvitation(candidate))
                          setInvitePreviewOpen(true)
                        }}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {pendingCandidates.map((candidate) => (
                      <CandidateListItem
                        key={candidate.id}
                        candidate={candidate}
                        onToggleFavorite={handleToggleFavorite}
                        onRemoveCandidate={handleRemoveCandidate}
                        onViewInvite={() => {
                          setSelectedInvite(buildInvitation(candidate))
                          setInvitePreviewOpen(true)
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>
            </Collapse>
          </div>
        )}

        {/* Accepted Candidates Section */}
        {acceptedCandidates.length > 0 && (
          <div className="bg-white rounded-xl shadow-md overflow-hidden border border-blue-200">
            <div className="flex justify-between items-center p-4 border-b border-blue-100">
              <div className="flex items-center">
                <h3 className="text-blue-700 font-medium flex items-center">
                  <CheckCircle className="h-4 w-4 mr-1 text-green-500" />
                  Accepted Invitations
                </h3>
                <Badge variant="outline" className="ml-2 bg-green-50 text-green-600 border-green-200">
                  {acceptedCandidates.length}
                </Badge>
              </div>
              <Button
                variant="outline"
                size="icon"
                className="rounded-full"
                onClick={() => setIsAcceptedExpanded(!isAcceptedExpanded)}
              >
                <ChevronDown
                  size={16}
                  className={`transform transition-transform ${isAcceptedExpanded ? "rotate-180" : ""}`}
                />
              </Button>
            </div>
            <Collapse in={isAcceptedExpanded}>
              <div className="p-4">
                {isGridView ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {acceptedCandidates.map((candidate) => (
                      <CandidateCard
                        key={candidate.id}
                        candidate={candidate}
                        onToggleFavorite={handleToggleFavorite}
                        onRemoveCandidate={handleRemoveCandidate}
                        onViewInvite={() => {
                          setSelectedInvite(buildInvitation(candidate))
                          setInvitePreviewOpen(true)
                        }}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {acceptedCandidates.map((candidate) => (
                      <CandidateListItem
                        key={candidate.id}
                        candidate={candidate}
                        onToggleFavorite={handleToggleFavorite}
                        onRemoveCandidate={handleRemoveCandidate}
                        onViewInvite={() => {
                          setSelectedInvite(buildInvitation(candidate))
                          setInvitePreviewOpen(true)
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>
            </Collapse>
          </div>
        )}

        {/* Declined Candidates Section */}
        {declinedCandidates.length > 0 && (
          <div className="bg-white rounded-xl shadow-md overflow-hidden border border-blue-200">
            <div className="flex justify-between items-center p-4 border-b border-blue-100">
              <div className="flex items-center">
                <h3 className="text-blue-700 font-medium flex items-center">
                  <XCircle className="h-4 w-4 mr-1 text-red-500" />
                  Declined Invitations
                </h3>
                <Badge variant="outline" className="ml-2 bg-red-50 text-red-600 border-red-200">
                  {declinedCandidates.length}
                </Badge>
              </div>
              <Button
                variant="outline"
                size="icon"
                className="rounded-full"
                onClick={() => setIsDeclinedExpanded(!isDeclinedExpanded)}
              >
                <ChevronDown
                  size={16}
                  className={`transform transition-transform ${isDeclinedExpanded ? "rotate-180" : ""}`}
                />
              </Button>
            </div>
            <Collapse in={isDeclinedExpanded}>
              <div className="p-4">
                {isGridView ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {declinedCandidates.map((candidate) => (
                      <CandidateCard
                        key={candidate.id}
                        candidate={candidate}
                        onToggleFavorite={handleToggleFavorite}
                        onRemoveCandidate={handleRemoveCandidate}
                        onViewInvite={() => {
                          setSelectedInvite(buildInvitation(candidate))
                          setInvitePreviewOpen(true)
                        }}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {declinedCandidates.map((candidate) => (
                      <CandidateListItem
                        key={candidate.id}
                        candidate={candidate}
                        onToggleFavorite={handleToggleFavorite}
                        onRemoveCandidate={handleRemoveCandidate}
                        onViewInvite={() => {
                          setSelectedInvite(buildInvitation(candidate))
                          setInvitePreviewOpen(true)
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>
            </Collapse>
          </div>
        )}

        {/* Suggested Candidates Section */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-blue-200">
          <div className="flex justify-between items-center p-4 border-b border-blue-100">
            <h2 className="text-blue-700 font-medium">Suggested Candidates</h2>
            <button className="text-blue-600 font-medium hover:underline">View All</button>
          </div>

          <div className="p-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {suggestedCandidates.map((candidate) => (
                <SuggestedCandidateCard
                  key={candidate.id}
                  candidate={candidate}
                  onInvite={() => handleInviteClick(candidate)}
                />
              ))}
            </div>
          </div>
        </div>
        <InvitationModal
          open={inviteModalOpen}
          onClose={() => setInviteModalOpen(false)}
          onSend={() => setInviteModalOpen(false)}
          candidate={
            selectedSuggested
              ? {
                  name: selectedSuggested.name,
                  matchScore: selectedSuggested.matchPercentage,
                  program: selectedSuggested.program,
                  yearSection: selectedSuggested.yearSection,
                }
              : { name: "", matchScore: undefined, program: "", yearSection: "" }
          }
        />
        <ViewInviteModal
          open={invitePreviewOpen}
          onClose={() => setInvitePreviewOpen(false)}
          invitation={selectedInvite}
          onEdit={() => {}}
          onResend={() => {}}
        />
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
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-orange-500"
      case "accepted":
        return "bg-green-500"
      case "declined":
        return "bg-red-500"
      default:
        return "bg-gray-500"
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
    <div className="bg-white border border-blue-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-16 relative">
        <button
          className="absolute top-2 right-2 text-white hover:bg-white/20 rounded-full p-1"
          onClick={handleMenuOpen}
        >
          <MoreHorizontal size={16} />
        </button>
        <Menu anchorEl={anchorEl} open={open} onClose={handleMenuClose}>
          <MenuItem
            onClick={() => {
              onToggleFavorite(candidate.id)
              handleMenuClose()
            }}
          >
            <Star
              className={`h-4 w-4 mr-2 text-yellow-500 ${candidate.isFavorite ? "fill-yellow-500" : ""}`}
            />
            {candidate.isFavorite ? "Unfavorite" : "Favorite"}
          </MenuItem>
          <MenuItem
            onClick={() => {
              onRemoveCandidate(candidate.id)
              handleMenuClose()
            }}
          >
            <Trash2 className="h-4 w-4 mr-2 text-gray-500" />
            Remove
          </MenuItem>
        </Menu>
      </div>
      <div className="px-4 pt-10 pb-4 relative">
        <Avatar
          className="absolute -top-8 left-1/2 transform -translate-x-1/2 w-16 h-16 border-4 border-white"
        >
          <Image
            src={candidate.avatar || "/placeholder.svg"}
            alt={candidate.name}
            width={64}
            height={64}
            className="object-cover"
          />
        </Avatar>
        <div className="text-center mb-2">
          <h3 className="font-medium text-gray-900 flex items-center justify-center">
            {candidate.name}
            {candidate.isFavorite && <Star className="h-3 w-3 ml-1 text-yellow-500 fill-yellow-500" />}
          </h3>
          <p className="text-sm text-gray-400">{candidate.yearSection}</p>
        </div>
        <div className="flex items-center justify-center mb-3">
          <div className="bg-yellow-400 text-black text-xs font-bold px-1 py-0.5 rounded mr-1 flex items-center justify-center">
            STI
          </div>
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200 text-xs">
            {candidate.program}
          </Badge>
        </div>
        <div className="flex items-center justify-center mb-3">
          <div
            className={`${getStatusColor(candidate.status)} text-white text-xs font-medium px-2 py-1 rounded-full flex items-center`}
          >
            {getStatusText(candidate.status)}
          </div>
          <div className="text-xs text-gray-500 ml-2">Invited: {candidate.date}</div>
        </div>
        <Button
          className="w-full bg-blue-500 hover:bg-blue-600 text-white rounded-full"
          onClick={() => onViewInvite(candidate.id)}
        >
          <Mail className="h-4 w-4 mr-2" />
          View Invite
        </Button>
      </div>
    </div>
  )
}

function CandidateListItem({ candidate, onToggleFavorite, onRemoveCandidate, onViewInvite }: CandidateCardProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-orange-500"
      case "accepted":
        return "bg-green-500"
      case "declined":
        return "bg-red-500"
      default:
        return "bg-gray-500"
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
    <div className="flex items-center justify-between border-b border-gray-100 pb-4">
      <div className="flex items-center">
        <Avatar className="h-12 w-12 mr-3">
          <Image src={candidate.avatar || "/placeholder.svg"} alt={candidate.name} width={48} height={48} />
        </Avatar>
        <div>
          <div className="flex items-center">
            <h3 className="font-medium text-gray-900 flex items-center">
              {candidate.name}
              {candidate.isFavorite && <Star className="h-3 w-3 ml-1 text-yellow-500 fill-yellow-500" />}
            </h3>
            {(candidate.status === "pending" || candidate.status === "accepted") && (
              <>
                <Badge
                  variant="outline"
                  className={`ml-3 ${
                    candidate.status === "pending"
                      ? "bg-orange-50 text-orange-600 border-orange-200"
                      : "bg-green-50 text-green-600 border-green-200"
                  }`}
                >
                  {getStatusText(candidate.status)}
                </Badge>
                <span className="text-xs text-gray-500 ml-2">Invited: {candidate.date}</span>
              </>
            )}
            {!(candidate.status === "pending" || candidate.status === "accepted") && (
              <span className="text-xs text-gray-500 ml-3">Invited: {candidate.date}</span>
            )}
          </div>
          <div className="text-sm text-gray-500">
            {candidate.school}
            <br />
            {candidate.yearSection}
          </div>
        </div>
      </div>
      <div className="flex items-center">
        <div className="mr-4 flex items-center">
          {!(candidate.status === "pending" || candidate.status === "accepted") && (
            <div
              className={`${getStatusColor(candidate.status)} text-white text-xs font-medium px-2 py-1 rounded-full flex items-center mr-2`}
            >
              {getStatusText(candidate.status)}
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button
            className="bg-blue-500 hover:bg-blue-600 text-white"
            onClick={() => onViewInvite(candidate.id)}
          >
            <Mail className="h-4 w-4 mr-2" />
            View Invite
          </Button>
          <button className="text-gray-600 hover:bg-gray-100 rounded-full p-1" onClick={handleMenuOpen}>
            <MoreHorizontal size={16} />
          </button>
          <Menu anchorEl={anchorEl} open={open} onClose={handleMenuClose}>
            <MenuItem
              onClick={() => {
                onToggleFavorite(candidate.id)
                handleMenuClose()
              }}
            >
              <Star
                className={`h-4 w-4 mr-2 ${candidate.isFavorite ? "text-yellow-500 fill-yellow-500" : "text-gray-500"}`}
              />
              {candidate.isFavorite ? "Unfavorite" : "Favorite"}
            </MenuItem>
            <MenuItem
              onClick={() => {
                onRemoveCandidate(candidate.id)
                handleMenuClose()
              }}
            >
              <Trash2 className="h-4 w-4 mr-2 text-gray-500" />
              Remove
            </MenuItem>
          </Menu>
        </div>
      </div>
    </div>
  )
}

interface SuggestedCandidateProps {
  candidate: SuggestedCandidate
  onInvite?: () => void
}

function SuggestedCandidateCard({ candidate, onInvite }: SuggestedCandidateProps) {
  return (
    <div className="bg-white border border-blue-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-16 relative">
        <button className="absolute top-2 right-2 text-white hover:bg-white/20 rounded-full p-1">
          <X size={16} />
        </button>
      </div>
      <div className="px-4 pt-10 pb-4 relative">
        <Avatar
          className="absolute -top-8 left-1/2 transform -translate-x-1/2 w-16 h-16 border-4 border-white"
        >
          <Image
            src={candidate.avatar || "/placeholder.svg"}
            alt={candidate.name}
            width={64}
            height={64}
            className="object-cover"
          />
        </Avatar>
        <div className="text-center mb-2">
          <h3 className="font-medium text-gray-900">{candidate.name}</h3>
          <p className="text-xs text-gray-400">{candidate.yearSection}</p>
        </div>
        <div className="flex items-center justify-center mb-3">
          <div className="bg-yellow-400 text-black text-xs font-bold px-1 py-0.5 rounded mr-1 flex items-center justify-center">
            STI
          </div>
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200 text-xs">
            {candidate.program}
          </Badge>
        </div>
        <div className="flex items-center justify-center mb-3">
          <div className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">
            {candidate.matchPercentage}% Match
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            className="w-full bg-blue-500 hover:bg-blue-600 text-white rounded-full"
            onClick={onInvite}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mr-1"
            >
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
            Invite
          </Button>
          <Button
            variant="outline"
            className="w-full border-blue-300 text-blue-600 hover:bg-blue-50 rounded-full flex items-center justify-center"
          >
            <User className="h-4 w-4 mr-1" />
            View Profile
          </Button>
        </div>
      </div>
    </div>
  )
}
