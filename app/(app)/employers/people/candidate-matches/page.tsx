"use client"

import { useState } from "react"
import {
  MoreHorizontal,
  Grid,
  List,
  Star,
  Send,
  User,
  Heart,
  Share2,
  Trash2,
  Search,
  Sparkles,
  TrendingUp,
  Briefcase,
  MapPin,
  Clock,
  Filter,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"

interface JobListing {
  id: string
  title: string
  department: string
  location: string
}

interface Candidate {
  id: string
  name: string
  title: string
  experience: string
  location: string
  skills: string[]
  avatar: string
  coverPhoto: string
  isFavorite: boolean
  status: "New" | "Contacted" | "Interviewed" | "Offered" | "Rejected"
  savedDate: string
  jobMatches: {
    jobId: string
    matchScore: number
    isTopMatch: boolean
  }[]
}

export default function SavedCandidatesPage() {
  const [jobListings] = useState<JobListing[]>([
    {
      id: "job1",
      title: "Senior Frontend Developer",
      department: "Engineering",
      location: "San Francisco, CA",
    },
    {
      id: "job2",
      title: "Full Stack Engineer",
      department: "Engineering",
      location: "Remote",
    },
    {
      id: "job3",
      title: "UI/UX Designer",
      department: "Design",
      location: "New York, NY",
    },
  ])

  const [candidates, setCandidates] = useState<Candidate[]>([
    {
      id: "c1",
      name: "Kemly Rose",
      title: "Senior Frontend Developer",
      experience: "5 years",
      location: "San Francisco, CA",
      skills: ["React", "TypeScript", "Tailwind CSS", "Next.js"],
      avatar: "/placeholder.svg?height=100&width=100",
      coverPhoto: "/placeholder.svg?height=200&width=400",
      isFavorite: true,
      status: "Interviewed",
      savedDate: "May 10, 2025",
      jobMatches: [
        { jobId: "job1", matchScore: 95, isTopMatch: true },
        { jobId: "job2", matchScore: 88, isTopMatch: false },
        { jobId: "job3", matchScore: 45, isTopMatch: false },
      ],
    },
    {
      id: "c2",
      name: "Kemlerin Kemeli",
      title: "UI/UX Designer & Developer",
      experience: "3 years",
      location: "New York, NY",
      skills: ["Figma", "React", "CSS", "Design Systems"],
      avatar: "/placeholder.svg?height=100&width=100",
      coverPhoto: "/placeholder.svg?height=200&width=400",
      isFavorite: false,
      status: "Contacted",
      savedDate: "May 12, 2025",
      jobMatches: [
        { jobId: "job3", matchScore: 92, isTopMatch: true },
        { jobId: "job1", matchScore: 78, isTopMatch: false },
        { jobId: "job2", matchScore: 82, isTopMatch: false },
      ],
    },
    {
      id: "c3",
      name: "Edrian Sevilla",
      title: "Node.js Developer",
      experience: "4 years",
      location: "Austin, TX",
      skills: ["Node.js", "Express", "MongoDB", "AWS"],
      avatar: "/placeholder.svg?height=100&width=100",
      coverPhoto: "/placeholder.svg?height=200&width=400",
      isFavorite: true,
      status: "New",
      savedDate: "May 14, 2025",
      jobMatches: [
        { jobId: "job2", matchScore: 94, isTopMatch: true },
        { jobId: "job1", matchScore: 72, isTopMatch: false },
        { jobId: "job3", matchScore: 35, isTopMatch: false },
      ],
    },
    {
      id: "c4",
      name: "Suzeyn Zeyn",
      title: "Python Backend Engineer",
      experience: "6 years",
      location: "Seattle, WA",
      skills: ["Python", "Django", "PostgreSQL", "Docker"],
      avatar: "/placeholder.svg?height=100&width=100",
      coverPhoto: "/placeholder.svg?height=200&width=400",
      isFavorite: false,
      status: "Offered",
      savedDate: "May 8, 2025",
      jobMatches: [
        { jobId: "job2", matchScore: 89, isTopMatch: true },
        { jobId: "job1", matchScore: 65, isTopMatch: false },
        { jobId: "job3", matchScore: 28, isTopMatch: false },
      ],
    },
    {
      id: "c5",
      name: "Zeyn Delevwa",
      title: "Full Stack Developer",
      experience: "7 years",
      location: "Los Angeles, CA",
      skills: ["React", "Node.js", "AWS", "GraphQL"],
      avatar: "/placeholder.svg?height=100&width=100",
      coverPhoto: "/placeholder.svg?height=200&width=400",
      isFavorite: false,
      status: "Interviewed",
      savedDate: "May 5, 2025",
      jobMatches: [
        { jobId: "job2", matchScore: 91, isTopMatch: true },
        { jobId: "job1", matchScore: 87, isTopMatch: false },
        { jobId: "job3", matchScore: 52, isTopMatch: false },
      ],
    },
    {
      id: "c6",
      name: "Reri Wu",
      title: "MERN Stack Developer",
      experience: "4 years",
      location: "Chicago, IL",
      skills: ["MongoDB", "Express", "React", "Node.js"],
      avatar: "/placeholder.svg?height=100&width=100",
      coverPhoto: "/placeholder.svg?height=200&width=400",
      isFavorite: true,
      status: "Contacted",
      savedDate: "May 11, 2025",
      jobMatches: [
        { jobId: "job2", matchScore: 93, isTopMatch: true },
        { jobId: "job1", matchScore: 85, isTopMatch: false },
        { jobId: "job3", matchScore: 41, isTopMatch: false },
      ],
    },
  ])

  const [isGridView, setIsGridView] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [jobFilter, setJobFilter] = useState("all")
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false)

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

  const handleUpdateStatus = (candidateId: string, newStatus: Candidate["status"]) => {
    setCandidates((prev) =>
      prev.map((candidate) => (candidate.id === candidateId ? { ...candidate, status: newStatus } : candidate)),
    )
  }

  // Filter candidates based on search, status, job, and favorites
  const filteredCandidates = candidates.filter((candidate) => {
    const matchesSearch =
      candidate.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      candidate.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      candidate.skills.some((skill) => skill.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesStatus = statusFilter === "all" || candidate.status.toLowerCase() === statusFilter
    const matchesFavorites = !showFavoritesOnly || candidate.isFavorite

    const matchesJob =
      jobFilter === "all" || candidate.jobMatches.some((match) => match.jobId === jobFilter && match.isTopMatch)

    return matchesSearch && matchesStatus && matchesFavorites && matchesJob
  })

  const getStatusColor = (status: Candidate["status"]) => {
    switch (status) {
      case "New":
        return "bg-blue-100 text-blue-700 border-blue-200"
      case "Contacted":
        return "bg-purple-100 text-purple-700 border-purple-200"
      case "Interviewed":
        return "bg-amber-100 text-amber-700 border-amber-200"
      case "Offered":
        return "bg-green-100 text-green-700 border-green-200"
      case "Rejected":
        return "bg-red-100 text-red-700 border-red-200"
      default:
        return "bg-gray-100 text-gray-700 border-gray-200"
    }
  }

  const getTopMatch = (candidate: Candidate) => {
    const topMatch = candidate.jobMatches.find((match) => match.isTopMatch)
    const job = jobListings.find((job) => job.id === topMatch?.jobId)
    return { match: topMatch, job }
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
              <h1 className="text-3xl font-bold text-white mb-2">Saved Candidates</h1>
              <p className="text-blue-100">
                Discover perfect matches for your job openings • {filteredCandidates.length} candidates
              </p>
            </div>
            <Button className="bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm">
              <Sparkles className="h-4 w-4 mr-2" />
              I'm Feeling Lucky
            </Button>
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

                  <Button
                    variant={showFavoritesOnly ? "default" : "outline"}
                    size="sm"
                    onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
                    className={showFavoritesOnly ? "bg-yellow-500 hover:bg-yellow-600" : ""}
                  >
                    <Star className={`h-4 w-4 mr-1 ${showFavoritesOnly ? "fill-white" : ""}`} />
                    Favorites
                  </Button>
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
        {filteredCandidates.length === 0 ? (
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
                {filteredCandidates.map((candidate) => (
                  <CandidateCard
                    key={candidate.id}
                    candidate={candidate}
                    jobListings={jobListings}
                    onToggleFavorite={handleToggleFavorite}
                    onRemove={handleRemoveCandidate}
                    onUpdateStatus={handleUpdateStatus}
                    getStatusColor={getStatusColor}
                    getTopMatch={getTopMatch}
                  />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredCandidates.map((candidate) => (
                  <CandidateListItem
                    key={candidate.id}
                    candidate={candidate}
                    jobListings={jobListings}
                    onToggleFavorite={handleToggleFavorite}
                    onRemove={handleRemoveCandidate}
                    onUpdateStatus={handleUpdateStatus}
                    getStatusColor={getStatusColor}
                    getTopMatch={getTopMatch}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

interface CandidateCardProps {
  candidate: Candidate
  jobListings: JobListing[]
  onToggleFavorite: (id: string) => void
  onRemove: (id: string) => void
  onUpdateStatus: (id: string, status: Candidate["status"]) => void
  getStatusColor: (status: Candidate["status"]) => string
  getTopMatch: (candidate: Candidate) => { match: any; job: JobListing | undefined }
}

function CandidateCard({
  candidate,
  jobListings,
  onToggleFavorite,
  onRemove,
  onUpdateStatus,
  getStatusColor,
  getTopMatch,
}: CandidateCardProps) {
  const { match: topMatch, job: topJob } = getTopMatch(candidate)

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
            {topMatch?.matchScore}% Match
          </Badge>
        </div>

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
              <DropdownMenuItem onClick={() => onRemove(candidate.id)} className="text-red-600">
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
          {/* Name and Title */}
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-gray-900">{candidate.name}</h3>
              {candidate.isFavorite && <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />}
            </div>
            <p className="text-sm text-gray-600">{candidate.title}</p>
            <div className="flex items-center gap-4 text-xs text-gray-500 mt-1">
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {candidate.experience}
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {candidate.location}
              </span>
            </div>
          </div>

          {/* Top Job Match */}
          {topJob && (
            <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium text-blue-700">Best Match</span>
                <Badge variant="outline" className="bg-blue-100 text-blue-700 border-blue-300 text-xs">
                  {topMatch?.matchScore}%
                </Badge>
              </div>
              <p className="text-sm font-medium text-gray-900">{topJob.title}</p>
              <p className="text-xs text-gray-600">
                {topJob.department} • {topJob.location}
              </p>
            </div>
          )}

          {/* Skills */}
          <div className="flex flex-wrap gap-1">
            {candidate.skills.slice(0, 3).map((skill, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {skill}
              </Badge>
            ))}
            {candidate.skills.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{candidate.skills.length - 3}
              </Badge>
            )}
          </div>

          {/* Status and Date */}
          <div className="flex items-center justify-between">
            <Badge variant="outline" className={getStatusColor(candidate.status)}>
              {candidate.status}
            </Badge>
            <span className="text-xs text-gray-500">Saved {candidate.savedDate}</span>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-2">
            <Button variant="outline" size="sm" className="flex-1">
              <User className="h-4 w-4 mr-1" />
              View Profile
            </Button>
            <Button size="sm" className="flex-1 bg-blue-600 hover:bg-blue-700">
              <Send className="h-4 w-4 mr-1" />
              Send Invite
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function CandidateListItem({
  candidate,
  jobListings,
  onToggleFavorite,
  onRemove,
  onUpdateStatus,
  getStatusColor,
  getTopMatch,
}: CandidateCardProps) {
  const { match: topMatch, job: topJob } = getTopMatch(candidate)

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
              {topMatch && (
                <Badge className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs px-1 py-0">
                  {topMatch.matchScore}%
                </Badge>
              )}
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-gray-900">{candidate.name}</h3>
                {candidate.isFavorite && <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />}
                <Badge variant="outline" className={getStatusColor(candidate.status)}>
                  {candidate.status}
                </Badge>
              </div>

              <p className="text-sm text-gray-600 mb-1">{candidate.title}</p>

              {topJob && (
                <div className="bg-blue-50 rounded px-2 py-1 mb-2 inline-block">
                  <span className="text-xs font-medium text-blue-700">
                    {topMatch?.matchScore}% match for {topJob.title}
                  </span>
                </div>
              )}

              <div className="flex items-center gap-6 text-xs text-gray-500 mb-2">
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {candidate.experience}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {candidate.location}
                </span>
                <span>Saved {candidate.savedDate}</span>
              </div>

              <div className="flex flex-wrap gap-1">
                {candidate.skills.slice(0, 4).map((skill, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {skill}
                  </Badge>
                ))}
                {candidate.skills.length > 4 && (
                  <Badge variant="outline" className="text-xs">
                    +{candidate.skills.length - 4}
                  </Badge>
                )}
              </div>
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

            <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
              <Send className="h-4 w-4 mr-1" />
              Send Invite
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onRemove(candidate.id)} className="text-red-600">
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
