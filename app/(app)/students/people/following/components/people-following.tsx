"use client"

import { useState, useEffect } from "react"
import { List, Star, ChevronDown } from "lucide-react"
import { LuLayoutGrid } from "react-icons/lu"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import SearchSection from "../../components/search-section"
import { TbUserCheck } from "react-icons/tb"
import { GridEmployer } from "../../components/grid view cards/grid-employer"
import { ListEmployers } from "../../components/list view items/list-employers"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import Lottie from "lottie-react"
import catLoader from "../../../../../../public/animations/cat_loader.json"

interface Employer {
  id: string
  name: string
  company: string
  position: string
  avatar: string
  isFavorite: boolean
  cover?: string
}

export default function FollowingPage() {
  const [employers, setEmployers] = useState<Employer[]>([])
  const [isGridView, setIsGridView] = useState(false)
  const [sortBy, setSortBy] = useState<"relevant" | "alphabetical" | "company" | "position">("relevant")
  const [isFavoritesExpanded, setIsFavoritesExpanded] = useState(true)
  const [searchResults, setSearchResults] = useState<Employer[] | null>(null)
  const [suggestedEmployers, setSuggestedEmployers] = useState<Employer[]>([])
  const [connectionStates, setConnectionStates] = useState<Record<string, string>>({})
  const [loadingEmployers, setLoadingEmployers] = useState(true)
  const [loadingSuggestions, setLoadingSuggestions] = useState(true)
  const router = useRouter()
  const { data: session } = useSession()
  const studentId = session?.user?.studentId

  useEffect(() => {
    setLoadingEmployers(true)
    fetch("/api/students/people/fetchFollowing")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data.employers)) {
          setEmployers(
            data.employers.map((e: {
              id: string
              first_name: string | null
              last_name: string | null
              company_name: string | null
              job_title: string | null
              avatar?: string | null
              cover?: string | null
              favorite?: boolean
            }) => ({
              id: e.id,
              name: [e.first_name, e.last_name].filter(Boolean).join(" ") || e.company_name || "",
              company: e.company_name || "",
              position: e.job_title || "",
              avatar: e.avatar || "/placeholder.svg?height=100&width=100",
              cover: e.cover && e.cover !== "" ? e.cover : "linear-gradient(90deg, #3b82f6 0%, #6366f1 50%, #8b5cf6 100%)",
              isFavorite: !!e.favorite,
            }))
          )
        }
        setLoadingEmployers(false)
      })
  }, [])

  useEffect(() => {
    setLoadingSuggestions(true)
    fetch("/api/students/people/suggestions/employers", { method: "POST" })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data.employers)) {
          const mapped = data.employers.map((e: {
            id: string
            first_name: string | null
            last_name: string | null
            company_name: string | null
            job_title: string | null
            avatar?: string | null
            cover?: string | null
          }) => ({
            id: e.id,
            name: [e.first_name, e.last_name].filter(Boolean).join(" ") || e.company_name || "",
            company: e.company_name || "",
            position: e.job_title || "",
            avatar: e.avatar || "/placeholder.svg?height=100&width=100",
            cover: e.cover && e.cover !== "" ? e.cover : "linear-gradient(90deg, #3b82f6 0%, #6366f1 50%, #8b5cf6 100%)",
            isFavorite: false,
          }))
          setSuggestedEmployers(mapped)
          mapped.forEach((employer: Employer) => {
            fetch(`/api/students/people/suggestions/employers?employerId=${employer.id}`)
              .then(res => res.json())
              .then(statusData => {
                setConnectionStates(prev => ({
                  ...prev,
                  [employer.id]: statusData.status === "Following" ? "Following" : "Follow"
                }))
              })
          })
        }
        setLoadingSuggestions(false)
      })
  }, [])

  const handleToggleFavorite = async (employerId: string) => {
    setEmployers((prev) =>
      prev.map((employer) =>
        employer.id === employerId
          ? { ...employer, isFavorite: !employer.isFavorite }
          : employer
      )
    )
    if (!studentId) return
    const employer = employers.find(e => e.id === employerId)
    const action = employer?.isFavorite ? "unfavorite" : "favorite"
    await fetch("/api/students/people/actionFollowing", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, studentId, employerId }),
    })
  }

  const handleUnfollow = async (employerId: string) => {
    if (!studentId) return
    await fetch("/api/students/people/actionFollowing", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "unfollow", studentId, employerId }),
    })
    setEmployers((prev) => prev.filter((employer) => employer.id !== employerId))
  }

  const handleSearch = (params: { firstName: string; lastName: string }) => {
    const { firstName, lastName } = params
    const filterByName = (name: string) =>
      (!firstName && !lastName) ||
      (firstName && name.toLowerCase().includes(firstName.toLowerCase())) ||
      (lastName && name.toLowerCase().includes(lastName.toLowerCase()))
    const results = employers.filter(e => filterByName(e.name))
    setSearchResults(results)
  }

  const handleCloseSearchResults = () => setSearchResults(null)

  const handleConnect = async (id: string) => {
    const currentState = connectionStates[id]
    if (currentState === "Following") {
      await fetch("/api/students/people/sendFollow", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ employerId: id }),
      })
      setConnectionStates(prev => ({ ...prev, [id]: "Follow" }))
    } else {
      await fetch("/api/students/people/sendFollow", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ employerId: id }),
      })
      setConnectionStates(prev => ({ ...prev, [id]: "Following" }))
    }
    setLoadingEmployers(true)
    fetch("/api/students/people/fetchFollowing")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data.employers)) {
          setEmployers(
            data.employers.map((e: {
              id: string
              first_name: string | null
              last_name: string | null
              company_name: string | null
              job_title: string | null
              avatar?: string | null
              cover?: string | null
              favorite?: boolean
            }) => ({
              id: e.id,
              name: [e.first_name, e.last_name].filter(Boolean).join(" ") || e.company_name || "",
              company: e.company_name || "",
              position: e.job_title || "",
              avatar: e.avatar || "/placeholder.svg?height=100&width=100",
              cover: e.cover && e.cover !== "" ? e.cover : "linear-gradient(90deg, #3b82f6 0%, #6366f1 50%, #8b5cf6 100%)",
              isFavorite: !!e.favorite,
            }))
          )
        }
        setLoadingEmployers(false)
      })
  }

  const favoriteEmployers = employers.filter((employer) => employer.isFavorite)

  function sortEmployers(arr: Employer[]) {
    if (sortBy === "alphabetical") {
      return [...arr].sort((a, b) => a.name.localeCompare(b.name))
    }
    if (sortBy === "company") {
      return [...arr].sort((a, b) => a.company.localeCompare(b.company))
    }
    if (sortBy === "position") {
      return [...arr].sort((a, b) => a.position.localeCompare(b.position))
    }
    return arr
  }

  const connectionStatesAll = Object.fromEntries(employers.map(e => [e.id, "Followed"]))
  const favoriteIds = employers.filter(e => e.isFavorite).map(e => e.id)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-sky-100 p-4">
      <div className="max-w-6xl mx-auto space-y-6 mt-4">
        {/* SearchSection */}
        <div className="pt-2 pb-1">
          <SearchSection
            title="Find employers you follow"
            description="Manage and connect with employers you are following."
            placeholder="Search employers"
            icon={<TbUserCheck className="h-6 w-6 text-blue-300" />}
            onSearch={handleSearch}
          />
          {/* Show search results if present */}
          {searchResults && (
            <div className="bg-white rounded-xl shadow-md mb-6 overflow-hidden border border-blue-200 mt-4">
              <div className="border-b border-blue-100 bg-gradient-to-r from-blue-50 to-blue-100 flex justify-between items-center">
                <div className="p-4">
                  <h2 className="text-blue-700 font-medium flex items-center">
                    Search Results
                  </h2>
                </div>
                <button
                  className="text-blue-600 font-medium hover:underline px-4"
                  onClick={handleCloseSearchResults}
                  aria-label="Close search results"
                >
                  Close
                </button>
              </div>
              <div className="p-4">
                {searchResults.length > 0 ? (
                  isGridView ? (
                    <GridEmployer
                      employers={searchResults.map(e => ({
                        id: e.id,
                        name: e.name,
                        company: e.company,
                        job_title: e.position,
                        avatar: e.avatar,
                      }))}
                      connectionStates={Object.fromEntries(searchResults.map(e => [e.id, "Followed"]))}
                      onConnect={() => {}}
                      onUnfollow={handleUnfollow}
                      onToggleFavorite={handleToggleFavorite}
                      favoriteIds={searchResults.filter(e => e.isFavorite).map(e => e.id)}
                    />
                  ) : (
                    <ListEmployers
                      employers={searchResults.map(e => ({
                        id: e.id,
                        name: e.name,
                        company: e.company,
                        job_title: e.position,
                        avatar: e.avatar,
                        isFavorite: e.isFavorite,
                      }))}
                      onToggleFavorite={handleToggleFavorite}
                      onUnfollow={handleUnfollow}
                      favoriteIds={searchResults.filter(e => e.isFavorite).map(e => e.id)}
                    />
                  )
                ) : (
                  <div className="text-center py-8 text-gray-500">No employers found</div>
                )}
              </div>
            </div>
          )}
          {/* Controls row below SearchSection */}
          <div className="flex items-center gap-4 mt-2">
            <div className="flex items-center whitespace-nowrap">
              <span className="mr-2 text-sm text-gray-600">Sort by</span>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="min-w-[140px] bg-white px-3 py-1 text-left font-normal">
                    {sortBy === "relevant" && "Relevant"}
                    {sortBy === "alphabetical" && "Alphabetical"}
                    {sortBy === "company" && "Company"}
                    {sortBy === "position" && "Position"}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="min-w-[140px]">
                  <DropdownMenuItem onClick={() => setSortBy("relevant")}>Relevant</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortBy("alphabetical")}>Alphabetical</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortBy("company")}>Company</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortBy("position")}>Position</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <Button
              variant="outline"
              size="icon"
              className="rounded-full"
              onClick={() => setIsGridView(v => !v)}
            >
              {isGridView ? <List className="h-4 w-4 text-gray-500" /> : <LuLayoutGrid className="h-4 w-4 text-gray-500" />}
              <span className="sr-only">{isGridView ? "List view" : "Grid view"}</span>
            </Button>
          </div>
        </div>

        {/* Employers Section */}
        <div className="space-y-6">
          {/* Favorites Section */}
          {favoriteEmployers.length > 0 && (
            <div className="bg-white rounded-xl shadow-md overflow-hidden border border-blue-200">
              <div className="flex justify-between items-center p-4 border-b border-blue-100">
                <span className="text-blue-700 font-medium flex items-center text-base">
                  <Star className="h-4 w-4 mr-1 text-yellow-500" />
                  Favorites
                  <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200 ml-2 text-xs">
                    {favoriteEmployers.length}
                  </Badge>
                </span>
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
              {isFavoritesExpanded && (
                <div className="p-4">
                  {loadingEmployers ? (
                    <div className="space-y-4">
                      {Array.from({ length: 2 }).map((_, i) => (
                        <div key={i} className="flex items-center justify-between border-b border-gray-100 pb-4 animate-pulse">
                          <div className="flex items-center">
                            <div className="h-12 w-12 mr-3 rounded-full bg-blue-100" />
                            <div>
                              <div className="h-4 bg-blue-100 rounded w-32 mb-2" />
                              <div className="h-3 bg-blue-50 rounded w-24 mb-1" />
                              <div className="h-3 bg-blue-50 rounded w-20" />
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="h-8 w-20 bg-blue-100 rounded" />
                            <div className="h-8 w-24 bg-blue-100 rounded" />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : isGridView ? (
                    <GridEmployer
                      employers={sortEmployers(favoriteEmployers).map(e => ({
                        id: e.id,
                        name: e.name,
                        company: e.company,
                        job_title: e.position,
                        avatar: e.avatar,
                      }))}
                      connectionStates={Object.fromEntries(favoriteEmployers.map(e => [e.id, "Followed"]))}
                      onConnect={() => {}}
                      onUnfollow={handleUnfollow}
                      onToggleFavorite={handleToggleFavorite}
                      favoriteIds={favoriteEmployers.filter(e => e.isFavorite).map(e => e.id)}
                    />
                  ) : (
                    <ListEmployers
                      employers={sortEmployers(favoriteEmployers).map(e => ({
                        id: e.id,
                        name: e.name,
                        company: e.company,
                        job_title: e.position,
                        avatar: e.avatar,
                        isFavorite: e.isFavorite,
                      }))}
                      onToggleFavorite={handleToggleFavorite}
                      onUnfollow={handleUnfollow}
                      favoriteIds={favoriteEmployers.filter(e => e.isFavorite).map(e => e.id)}
                    />
                  )}
                </div>
              )}
            </div>
          )}

          {/* All Employers Section */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden border border-blue-200">
            <div className="flex justify-between items-center p-4 border-b border-blue-100">
              <h3 className="text-blue-700 font-medium flex items-center text-base">
                All Employers
                <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200 ml-2 text-xs">
                  {employers.length}
                </Badge>
              </h3>
            </div>
            <div className="p-4">
              {loadingEmployers ? (
                <div className="space-y-4">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="flex items-center justify-between border-b border-gray-100 pb-4 animate-pulse">
                      <div className="flex items-center">
                        <div className="h-12 w-12 mr-3 rounded-full bg-blue-100" />
                        <div>
                          <div className="h-4 bg-blue-100 rounded w-32 mb-2" />
                          <div className="h-3 bg-blue-50 rounded w-24 mb-1" />
                          <div className="h-3 bg-blue-50 rounded w-20" />
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-20 bg-blue-100 rounded" />
                        <div className="h-8 w-24 bg-blue-100 rounded" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : employers.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="w-48 h-36 mb-4">
                    <Lottie animationData={catLoader} loop={true} />
                  </div>
                  <div className="text-lg font-semibold text-blue-700 mb-2">No follows on the board 🎯</div>
                  <div className="text-gray-500 text-base text-center max-w-md">
                    Discover awesome employers and hit that follow button to stay in the loop!
                  </div>
                </div>
              ) : isGridView ? (
                <GridEmployer
                  employers={sortEmployers(employers).map(e => ({
                    id: e.id,
                    name: e.name,
                    company: e.company,
                    job_title: e.position,
                    avatar: e.avatar,
                  }))}
                  connectionStates={connectionStatesAll}
                  onConnect={() => {}}
                  onUnfollow={handleUnfollow}
                  onToggleFavorite={handleToggleFavorite}
                  favoriteIds={favoriteIds}
                />
              ) : (
                <ListEmployers
                  employers={sortEmployers(employers).map(e => ({
                    id: e.id,
                    name: e.name,
                    company: e.company,
                    job_title: e.position,
                    avatar: e.avatar,
                    isFavorite: e.isFavorite,
                  }))}
                  onToggleFavorite={handleToggleFavorite}
                  onUnfollow={handleUnfollow}
                  favoriteIds={favoriteIds}
                />
              )}
            </div>
          </div>

          {/* Suggested Employers Section */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden border border-blue-200">
            <div className="flex justify-between items-center p-4 border-b border-blue-100">
              <h2 className="text-blue-700 font-medium text-base">Suggested Employers for You</h2>
              <button
                className="text-blue-600 font-medium hover:underline text-base"
                onClick={() => router.push("/students/people/suggestions")}
              >
                View All
              </button>
            </div>
            <div className="p-4">
              {loadingSuggestions ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="bg-white border border-blue-200 rounded-xl overflow-hidden shadow-sm flex flex-col animate-pulse">
                      <div className="bg-blue-100 h-16 w-full" />
                      <div className="px-4 pt-10 pb-4 flex-1 flex flex-col">
                        <div className="absolute left-1/2 transform -translate-x-1/2 -mb-11" style={{ width: 80, height: 80, top: -64 }}>
                          <div className="rounded-full bg-blue-100 w-20 h-20 mx-auto" />
                        </div>
                        <div className="text-center mb-2 mt-2">
                          <div className="h-4 bg-blue-100 rounded w-32 mx-auto mb-2" />
                          <div className="h-3 bg-blue-50 rounded w-24 mx-auto mb-1" />
                          <div className="h-3 bg-blue-50 rounded w-20 mx-auto" />
                        </div>
                        <div className="flex items-center justify-center mb-3">
                          <div className="bg-yellow-100 text-yellow-700 text-xs font-bold px-2 py-1 rounded mr-1 w-10 h-4" />
                          <div className="bg-yellow-50 text-yellow-700 border-yellow-200 text-xs w-24 h-4 rounded" />
                        </div>
                        <div className="flex gap-2 mt-auto">
                          <div className="flex-1 h-8 bg-blue-100 rounded" />
                          <div className="flex-1 h-8 bg-blue-100 rounded" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <GridEmployer
                  employers={suggestedEmployers.slice(0, 4).map(e => ({
                    id: e.id,
                    name: e.name,
                    company: e.company,
                    job_title: e.position,
                    avatar: e.avatar,
                    cover: e.cover,
                  }))}
                  connectionStates={connectionStates}
                  onConnect={handleConnect}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
