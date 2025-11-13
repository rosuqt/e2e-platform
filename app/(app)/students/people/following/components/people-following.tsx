"use client"

import { useState } from "react"
import { List, Star,  ChevronDown } from "lucide-react"
import { LuLayoutGrid } from "react-icons/lu"
import { Button } from "@/components/ui/button"
import { MenuItem, FormControl, Select } from "@mui/material"
import { Badge } from "@/components/ui/badge"
import SearchSection from "../../components/search-section"
import { TbUserCheck } from "react-icons/tb"
import { GridEmployer } from "../../components/grid view cards/grid-employer"
import { ListEmployers } from "../../components/list view items/list-employers"

interface Employer {
  id: string
  name: string
  company: string
  position: string
  avatar: string
  isFavorite: boolean
}

export default function FollowingPage() {
  const [employers, setEmployers] = useState<Employer[]>([
    {
      id: "e1",
      name: "John Doe",
      company: "TechCorp",
      position: "Software Engineer",
      avatar: "/placeholder.svg?height=100&width=100",
      isFavorite: false,
    },
    {
      id: "e2",
      name: "Jane Smith",
      company: "Innovatech",
      position: "Product Manager",
      avatar: "/placeholder.svg?height=100&width=100",
      isFavorite: true,
    },
    {
      id: "e3",
      name: "Alice Johnson",
      company: "DevWorks",
      position: "UI/UX Designer",
      avatar: "/placeholder.svg?height=100&width=100",
      isFavorite: false,
    },
    {
      id: "e4",
      name: "Robert Brown",
      company: "CodeWorks",
      position: "Backend Developer",
      avatar: "/placeholder.svg?height=100&width=100",
      isFavorite: false,
    },
  ])

  const [isGridView, setIsGridView] = useState(false)
  const [sortBy, setSortBy] = useState<"relevant" | "alphabetical" | "company" | "position">("relevant")
  const [isFavoritesExpanded, setIsFavoritesExpanded] = useState(true)
  const [searchResults, setSearchResults] = useState<Employer[] | null>(null)

  const handleToggleFavorite = (employerId: string) => {
    setEmployers((prev) =>
      prev.map((employer) => (employer.id === employerId ? { ...employer, isFavorite: !employer.isFavorite } : employer)),
    )
  }

  const handleUnfollow = (employerId: string) => {
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

  const favoriteEmployers = employers.filter((employer) => employer.isFavorite)

  const suggestedEmployers: Employer[] = [
    {
      id: "se1",
      name: "Michael Scott",
      company: "Dunder Mifflin",
      position: "Regional Manager",
      avatar: "/placeholder.svg?height=100&width=100",
      isFavorite: false,
    },
    {
      id: "se2",
      name: "Pam Beesly",
      company: "Dunder Mifflin",
      position: "Receptionist",
      avatar: "/placeholder.svg?height=100&width=100",
      isFavorite: false,
    },
    {
      id: "se3",
      name: "Jim Halpert",
      company: "Dunder Mifflin",
      position: "Sales Representative",
      avatar: "/placeholder.svg?height=100&width=100",
      isFavorite: false,
    },
  ]

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

  const connectionStates = Object.fromEntries(employers.map(e => [e.id, "Followed"]))
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
            {/* Sort By Dropdown */}
            <div className="flex items-center">
              <span className="mr-2 text-sm text-gray-600">Sort by</span>
              <FormControl size="small" variant="outlined">
                <Select
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value as typeof sortBy)}
                  sx={{ minWidth: 140, backgroundColor: "white" }}
                >
                  <MenuItem value="relevant">Relevant</MenuItem>
                  <MenuItem value="alphabetical">Alphabetical</MenuItem>
                  <MenuItem value="company">Company</MenuItem>
                  <MenuItem value="position">Position</MenuItem>
                </Select>
              </FormControl>
            </div>
            {/* Grid/List Toggle */}
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
                  {isGridView ? (
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
              {isGridView ? (
                <GridEmployer
                  employers={sortEmployers(employers).map(e => ({
                    id: e.id,
                    name: e.name,
                    company: e.company,
                    job_title: e.position,
                    avatar: e.avatar,
                  }))}
                  connectionStates={connectionStates}
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
              <button className="text-blue-600 font-medium hover:underline text-base">View All</button>
            </div>
            <div className="p-4">
              <GridEmployer
                employers={suggestedEmployers.map(e => ({
                  id: e.id,
                  name: e.name,
                  company: e.company,
                  job_title: e.position,
                  avatar: e.avatar,
                }))}
                connectionStates={Object.fromEntries(suggestedEmployers.map(e => [e.id, "Follow"]))}
                onConnect={() => {}}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
