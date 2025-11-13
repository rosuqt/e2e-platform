"use client"

import type React from "react"

import { useState } from "react"
import {
  ChevronDown,
  MoreHorizontal,
  Grid,
  List,
  Star,
  MessageSquare,
  FileText,
  Trash2,
  Briefcase,
  Calendar,
  Filter,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, Menu, MenuItem, Collapse } from "@mui/material"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"

interface Candidate {
  id: string
  name: string
  title: string
  experience: string
  skills: string[]
  avatar: string
  isFavorite: boolean
  status: "New" | "Contacted" | "Interviewed" | "Offered" | "Rejected"
  savedDate: string
}

interface CandidateCategory {
  id: string
  name: string
  candidates: Candidate[]
}

export default function SavedCandidatesPage() {
  const [categories, setCategories] = useState<CandidateCategory[]>([
    {
      id: "cat1",
      name: "Frontend Developers",
      candidates: [
        {
          id: "c1",
          name: "Kemly Rose",
          title: "Senior Frontend Developer",
          experience: "5 years",
          skills: ["React", "TypeScript", "Tailwind CSS"],
          avatar: "/placeholder.svg?height=100&width=100",
          isFavorite: true,
          status: "Interviewed",
          savedDate: "May 10, 2025",
        },
        {
          id: "c2",
          name: "Kemlerin Kemeli",
          title: "UI/UX Designer & Developer",
          experience: "3 years",
          skills: ["Figma", "React", "CSS"],
          avatar: "/placeholder.svg?height=100&width=100",
          isFavorite: false,
          status: "Contacted",
          savedDate: "May 12, 2025",
        },
      ],
    },
    {
      id: "cat2",
      name: "Backend Developers",
      candidates: [
        {
          id: "c3",
          name: "Edrian Sevilla",
          title: "Node.js Developer",
          experience: "4 years",
          skills: ["Node.js", "Express", "MongoDB"],
          avatar: "/placeholder.svg?height=100&width=100",
          isFavorite: true,
          status: "New",
          savedDate: "May 14, 2025",
        },
        {
          id: "c4",
          name: "Suzeyn Zeyn",
          title: "Python Backend Engineer",
          experience: "6 years",
          skills: ["Python", "Django", "PostgreSQL"],
          avatar: "/placeholder.svg?height=100&width=100",
          isFavorite: false,
          status: "Offered",
          savedDate: "May 8, 2025",
        },
      ],
    },
    {
      id: "cat3",
      name: "Full Stack Developers",
      candidates: [
        {
          id: "c5",
          name: "Zeyn Delevwa",
          title: "Full Stack Developer",
          experience: "7 years",
          skills: ["React", "Node.js", "AWS"],
          avatar: "/placeholder.svg?height=100&width=100",
          isFavorite: false,
          status: "Interviewed",
          savedDate: "May 5, 2025",
        },
        {
          id: "c6",
          name: "Reri Wu",
          title: "MERN Stack Developer",
          experience: "4 years",
          skills: ["MongoDB", "Express", "React", "Node.js"],
          avatar: "/placeholder.svg?height=100&width=100",
          isFavorite: true,
          status: "Contacted",
          savedDate: "May 11, 2025",
        },
        {
          id: "c7",
          name: "Jamal Janrei",
          title: "Full Stack Engineer",
          experience: "5 years",
          skills: ["Vue.js", "Laravel", "MySQL"],
          avatar: "/placeholder.svg?height=100&width=100",
          isFavorite: false,
          status: "New",
          savedDate: "May 15, 2025",
        },
      ],
    },
  ])

  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({
    cat1: true,
    cat2: true,
    cat3: true,
  })

  const [isGridView, setIsGridView] = useState(false)
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false)

  const handleToggleCategoryExpand = (categoryId: string) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [categoryId]: !prev[categoryId],
    }))
  }

  const handleToggleFavorite = (categoryId: string, candidateId: string) => {
    setCategories((prev) =>
      prev.map((category) =>
        category.id === categoryId
          ? {
              ...category,
              candidates: category.candidates.map((candidate) =>
                candidate.id === candidateId ? { ...candidate, isFavorite: !candidate.isFavorite } : candidate,
              ),
            }
          : category,
      ),
    )
  }

  const handleRemoveCandidate = (categoryId: string, candidateId: string) => {
    setCategories((prev) =>
      prev.map((category) =>
        category.id === categoryId
          ? {
              ...category,
              candidates: category.candidates.filter((candidate) => candidate.id !== candidateId),
            }
          : category,
      ),
    )
  }

  const handleUpdateStatus = (categoryId: string, candidateId: string, newStatus: Candidate["status"]) => {
    setCategories((prev) =>
      prev.map((category) =>
        category.id === categoryId
          ? {
              ...category,
              candidates: category.candidates.map((candidate) =>
                candidate.id === candidateId ? { ...candidate, status: newStatus } : candidate,
              ),
            }
          : category,
      ),
    )
  }

  // Get all favorite candidates across all categories
  const allFavoriteCandidates = categories.flatMap((category) =>
    category.candidates.filter((candidate) => candidate.isFavorite),
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-sky-100 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Page Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 shadow-lg mb-6 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:20px_20px]"></div>
          </div>
          <h1 className="text-2xl font-bold text-white mb-1">Saved Candidates</h1>
          <p className="text-blue-100">Manage your saved talent pool and track candidate statuses</p>
        </div>

        {/* Filters and Controls */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-blue-200 p-4">
          <div className="flex flex-wrap justify-between items-center gap-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center">
                <Filter className="h-4 w-4 mr-2 text-blue-600" />
                <span className="text-sm font-medium text-gray-700">Filters:</span>
              </div>

              <Button
                variant="outline"
                size="sm"
                className={`text-sm ${showFavoritesOnly ? "bg-blue-50 border-blue-300 text-blue-700" : ""}`}
                onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
              >
                <Star
                  className={`h-4 w-4 mr-1 ${showFavoritesOnly ? "text-yellow-500 fill-yellow-500" : "text-gray-400"}`}
                />
                Favorites Only
              </Button>

              <div className="flex items-center text-sm text-gray-600">
                <span className="mr-2">Status:</span>
                <select className="border border-gray-200 rounded-md text-sm p-1">
                  <option value="all">All Statuses</option>
                  <option value="new">New</option>
                  <option value="contacted">Contacted</option>
                  <option value="interviewed">Interviewed</option>
                  <option value="offered">Offered</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" className="rounded-full" onClick={() => setIsGridView(!isGridView)}>
                {isGridView ? <List className="h-4 w-4" /> : <Grid className="h-4 w-4" />}
                <span className="sr-only">{isGridView ? "List view" : "Grid view"}</span>
              </Button>

              <Button className="bg-blue-500 hover:bg-blue-600 text-white">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mr-2"
                >
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
                Find More Candidates
              </Button>
            </div>
          </div>
        </div>

        {/* Favorites Section */}
        {allFavoriteCandidates.length > 0 && !showFavoritesOnly && (
          <div className="bg-white rounded-xl shadow-md overflow-hidden border border-blue-200">
            <div className="flex justify-between items-center p-4 border-b border-blue-100">
              <h3 className="text-blue-700 font-medium flex items-center">
                <Star className="h-4 w-4 mr-1 text-yellow-500 fill-yellow-500" />
                Favorite Candidates
              </h3>
              <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200">
                {allFavoriteCandidates.length}
              </Badge>
            </div>
            <div className="p-4">
              {isGridView ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {allFavoriteCandidates.map((candidate) => (
                    <CandidateCard
                      key={candidate.id}
                      candidate={candidate}
                      onToggleFavorite={(candidateId) => {
                        // Find which category this candidate belongs to
                        const categoryId =
                          categories.find((cat) => cat.candidates.some((c) => c.id === candidateId))?.id || ""

                        if (categoryId) {
                          handleToggleFavorite(categoryId, candidateId)
                        }
                      }}
                      onRemove={(candidateId) => {
                        // Find which category this candidate belongs to
                        const categoryId =
                          categories.find((cat) => cat.candidates.some((c) => c.id === candidateId))?.id || ""

                        if (categoryId) {
                          handleRemoveCandidate(categoryId, candidateId)
                        }
                      }}
                      onUpdateStatus={(candidateId, status) => {
                        // Find which category this candidate belongs to
                        const categoryId =
                          categories.find((cat) => cat.candidates.some((c) => c.id === candidateId))?.id || ""

                        if (categoryId) {
                          handleUpdateStatus(categoryId, candidateId, status)
                        }
                      }}
                    />
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {allFavoriteCandidates.map((candidate) => (
                    <CandidateListItem
                      key={candidate.id}
                      candidate={candidate}
                      onToggleFavorite={(candidateId) => {
                        // Find which category this candidate belongs to
                        const categoryId =
                          categories.find((cat) => cat.candidates.some((c) => c.id === candidateId))?.id || ""

                        if (categoryId) {
                          handleToggleFavorite(categoryId, candidateId)
                        }
                      }}
                      onRemove={(candidateId) => {
                        // Find which category this candidate belongs to
                        const categoryId =
                          categories.find((cat) => cat.candidates.some((c) => c.id === candidateId))?.id || ""

                        if (categoryId) {
                          handleRemoveCandidate(categoryId, candidateId)
                        }
                      }}
                      onUpdateStatus={(candidateId, status) => {
                        // Find which category this candidate belongs to
                        const categoryId =
                          categories.find((cat) => cat.candidates.some((c) => c.id === candidateId))?.id || ""

                        if (categoryId) {
                          handleUpdateStatus(categoryId, candidateId, status)
                        }
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Categories Sections */}
        {categories.map((category) => {
          // Filter candidates based on showFavoritesOnly
          const displayCandidates = showFavoritesOnly
            ? category.candidates.filter((c) => c.isFavorite)
            : category.candidates

          // Skip rendering empty categories when filtering
          if (displayCandidates.length === 0) return null

          return (
            <div key={category.id} className="bg-white rounded-xl shadow-md overflow-hidden border border-blue-200">
              <div className="flex justify-between items-center p-4 border-b border-blue-100">
                <h3 className="text-blue-700 font-medium flex items-center">
                  <Briefcase className="h-4 w-4 mr-1 text-blue-600" />
                  {category.name}
                </h3>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200">
                    {displayCandidates.length}
                  </Badge>
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full"
                    onClick={() => handleToggleCategoryExpand(category.id)}
                  >
                    <ChevronDown
                      size={16}
                      className={`transform transition-transform ${
                        expandedCategories[category.id] ? "rotate-180" : ""
                      }`}
                    />
                  </Button>
                </div>
              </div>
              <Collapse in={expandedCategories[category.id]}>
                <div className="p-4">
                  {isGridView ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {displayCandidates.map((candidate) => (
                        <CandidateCard
                          key={candidate.id}
                          candidate={candidate}
                          onToggleFavorite={(candidateId) => handleToggleFavorite(category.id, candidateId)}
                          onRemove={(candidateId) => handleRemoveCandidate(category.id, candidateId)}
                          onUpdateStatus={(candidateId, status) => handleUpdateStatus(category.id, candidateId, status)}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {displayCandidates.map((candidate) => (
                        <CandidateListItem
                          key={candidate.id}
                          candidate={candidate}
                          onToggleFavorite={(candidateId) => handleToggleFavorite(category.id, candidateId)}
                          onRemove={(candidateId) => handleRemoveCandidate(category.id, candidateId)}
                          onUpdateStatus={(candidateId, status) => handleUpdateStatus(category.id, candidateId, status)}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </Collapse>
            </div>
          )
        })}
      </div>
    </div>
  )
}

interface CandidateCardProps {
  candidate: Candidate
  onToggleFavorite: (id: string) => void
  onRemove: (id: string) => void
  onUpdateStatus: (id: string, status: Candidate["status"]) => void
}

function CandidateCard({ candidate, onToggleFavorite, onRemove, onUpdateStatus }: CandidateCardProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [statusAnchorEl, setStatusAnchorEl] = useState<null | HTMLElement>(null)

  const open = Boolean(anchorEl)
  const statusOpen = Boolean(statusAnchorEl)

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const handleStatusMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setStatusAnchorEl(event.currentTarget)
  }

  const handleStatusMenuClose = () => {
    setStatusAnchorEl(null)
  }

  const getStatusColor = (status: Candidate["status"]) => {
    switch (status) {
      case "New":
        return "bg-blue-100 text-blue-700"
      case "Contacted":
        return "bg-purple-100 text-purple-700"
      case "Interviewed":
        return "bg-amber-100 text-amber-700"
      case "Offered":
        return "bg-green-100 text-green-700"
      case "Rejected":
        return "bg-red-100 text-red-700"
      default:
        return "bg-gray-100 text-gray-700"
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
              className={`h-4 w-4 mr-2 ${candidate.isFavorite ? "text-yellow-500 fill-yellow-500" : "text-gray-500"}`}
            />
            {candidate.isFavorite ? "Remove from Favorites" : "Add to Favorites"}
          </MenuItem>
          <MenuItem onClick={handleStatusMenuOpen}>
            <Calendar className="h-4 w-4 mr-2 text-blue-500" />
            Update Status
          </MenuItem>
          <MenuItem
            onClick={() => {
              onRemove(candidate.id)
              handleMenuClose()
            }}
          >
            <Trash2 className="h-4 w-4 mr-2 text-gray-500" />
            Remove Candidate
          </MenuItem>
        </Menu>
        <Menu anchorEl={statusAnchorEl} open={statusOpen} onClose={handleStatusMenuClose}>
          <MenuItem
            onClick={() => {
              onUpdateStatus(candidate.id, "New")
              handleStatusMenuClose()
              handleMenuClose()
            }}
          >
            New
          </MenuItem>
          <MenuItem
            onClick={() => {
              onUpdateStatus(candidate.id, "Contacted")
              handleStatusMenuClose()
              handleMenuClose()
            }}
          >
            Contacted
          </MenuItem>
          <MenuItem
            onClick={() => {
              onUpdateStatus(candidate.id, "Interviewed")
              handleStatusMenuClose()
              handleMenuClose()
            }}
          >
            Interviewed
          </MenuItem>
          <MenuItem
            onClick={() => {
              onUpdateStatus(candidate.id, "Offered")
              handleStatusMenuClose()
              handleMenuClose()
            }}
          >
            Offered
          </MenuItem>
          <MenuItem
            onClick={() => {
              onUpdateStatus(candidate.id, "Rejected")
              handleStatusMenuClose()
              handleMenuClose()
            }}
          >
            Rejected
          </MenuItem>
        </Menu>
      </div>
      <div className="px-4 pt-10 pb-4 relative">
        <Avatar className="absolute -top-8 left-1/2 transform -translate-x-1/2 w-16 h-16 border-4 border-white rounded-full">
          <Image
            src={candidate.avatar || "/placeholder.svg"}
            alt={candidate.name}
            width={64}
            height={64}
            className="object-cover"
          />
        </Avatar>

        <div className="text-center mb-3">
          <h3 className="font-medium text-gray-900 flex items-center justify-center">
            {candidate.name}
            {candidate.isFavorite && <Star className="h-3 w-3 ml-1 text-yellow-500 fill-yellow-500" />}
          </h3>
          <p className="text-sm font-medium text-gray-700">{candidate.title}</p>
          <p className="text-xs text-gray-500">{candidate.experience} experience</p>

          <div className="mt-2 flex flex-wrap justify-center gap-1">
            {candidate.skills.slice(0, 3).map((skill, index) => (
              <Badge key={index} variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 text-xs">
                {skill}
              </Badge>
            ))}
            {candidate.skills.length > 3 && (
              <Badge variant="outline" className="bg-gray-50 text-gray-600 border-gray-200 text-xs">
                +{candidate.skills.length - 3}
              </Badge>
            )}
          </div>

          <div className="mt-2 flex items-center justify-center">
            <Badge className={`${getStatusColor(candidate.status)} text-xs`}>{candidate.status}</Badge>
            <span className="text-xs text-gray-400 ml-2">Saved {candidate.savedDate}</span>
          </div>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" className="flex-1 border-blue-300 text-blue-600 hover:bg-blue-50">
            <FileText className="h-4 w-4 mr-1" />
            Resume
          </Button>
          <Button className="flex-1 bg-blue-500 hover:bg-blue-600 text-white">
            <MessageSquare className="h-4 w-4 mr-1" />
            Contact
          </Button>
        </div>
      </div>
    </div>
  )
}

function CandidateListItem({ candidate, onToggleFavorite, onRemove, onUpdateStatus }: CandidateCardProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [statusAnchorEl, setStatusAnchorEl] = useState<null | HTMLElement>(null)

  const open = Boolean(anchorEl)
  const statusOpen = Boolean(statusAnchorEl)

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const handleStatusMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setStatusAnchorEl(event.currentTarget)
  }

  const handleStatusMenuClose = () => {
    setStatusAnchorEl(null)
  }

  const getStatusColor = (status: Candidate["status"]) => {
    switch (status) {
      case "New":
        return "bg-blue-100 text-blue-700"
      case "Contacted":
        return "bg-purple-100 text-purple-700"
      case "Interviewed":
        return "bg-amber-100 text-amber-700"
      case "Offered":
        return "bg-green-100 text-green-700"
      case "Rejected":
        return "bg-red-100 text-red-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  return (
    <div className="flex items-center justify-between border-b border-gray-100 pb-4">
      <div className="flex items-center">
        <Avatar className="h-12 w-12 mr-3">
          <Image src={candidate.avatar || "/placeholder.svg"} alt={candidate.name} width={48} height={48} />
        </Avatar>
        <div>
          <h3 className="font-medium text-gray-900 flex items-center">
            {candidate.name}
            {candidate.isFavorite && <Star className="h-3 w-3 ml-1 text-yellow-500 fill-yellow-500" />}
          </h3>
          <div className="text-sm text-gray-700">
            {candidate.title} • {candidate.experience} experience
          </div>
          <div className="flex flex-wrap gap-1 mt-1">
            {candidate.skills.slice(0, 3).map((skill, index) => (
              <Badge key={index} variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 text-xs">
                {skill}
              </Badge>
            ))}
            {candidate.skills.length > 3 && (
              <Badge variant="outline" className="bg-gray-50 text-gray-600 border-gray-200 text-xs">
                +{candidate.skills.length - 3}
              </Badge>
            )}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <Badge className={`${getStatusColor(candidate.status)}`}>{candidate.status}</Badge>

        <div className="text-xs text-gray-400">Saved {candidate.savedDate}</div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="border-blue-300 text-blue-600 hover:bg-blue-50">
            <FileText className="h-4 w-4 mr-1" />
            Resume
          </Button>
          <Button size="sm" className="bg-blue-500 hover:bg-blue-600 text-white">
            <MessageSquare className="h-4 w-4 mr-1  " />
            Contact
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
              {candidate.isFavorite ? "Remove from Favorites" : "Add to Favorites"}
            </MenuItem>
            <MenuItem onClick={handleStatusMenuOpen}>
              <Calendar className="h-4 w-4 mr-2 text-blue-500" />
              Update Status
            </MenuItem>
            <MenuItem
              onClick={() => {
                onRemove(candidate.id)
                handleMenuClose()
              }}
            >
              <Trash2 className="h-4 w-4 mr-2 text-gray-500" />
              Remove Candidate
            </MenuItem>
          </Menu>
          <Menu anchorEl={statusAnchorEl} open={statusOpen} onClose={handleStatusMenuClose}>
            <MenuItem
              onClick={() => {
                onUpdateStatus(candidate.id, "New")
                handleStatusMenuClose()
                handleMenuClose()
              }}
            >
              New
            </MenuItem>
            <MenuItem
              onClick={() => {
                onUpdateStatus(candidate.id, "Contacted")
                handleStatusMenuClose()
                handleMenuClose()
              }}
            >
              Contacted
            </MenuItem>
            <MenuItem
              onClick={() => {
                onUpdateStatus(candidate.id, "Interviewed")
                handleStatusMenuClose()
                handleMenuClose()
              }}
            >
              Interviewed
            </MenuItem>
            <MenuItem
              onClick={() => {
                onUpdateStatus(candidate.id, "Offered")
                handleStatusMenuClose()
                handleMenuClose()
              }}
            >
              Offered
            </MenuItem>
            <MenuItem
              onClick={() => {
                onUpdateStatus(candidate.id, "Rejected")
                handleStatusMenuClose()
                handleMenuClose()
              }}
            >
              Rejected
            </MenuItem>
          </Menu>
        </div>
      </div>
    </div>
  )
}
