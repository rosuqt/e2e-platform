"use client"

import { useState } from "react"
import { List, Star,  ChevronDown } from "lucide-react"
import { LuLayoutGrid } from "react-icons/lu"
import { Button } from "@/components/ui/button"
import { MenuItem, FormControl, Select } from "@mui/material"
import { Badge } from "@/components/ui/badge"
import SearchSection from "../../components/search-section"
import { TbUserCheck } from "react-icons/tb"
import { GridCompanies } from "../../components/grid view cards/grid-companies"
import { ListCompanies } from "../../components/list view items/list-companies"

interface Company {
  id: string
  name: string
  industry: string
  location: string
  avatar: string
  isFavorite: boolean
}

export default function CompaniesFollowingPage() {
  const [companies, setCompanies] = useState<Company[]>([
    {
      id: "c1",
      name: "TechCorp",
      industry: "Software",
      location: "San Francisco, CA",
      avatar: "/placeholder.svg?height=100&width=100",
      isFavorite: false,
    },
    {
      id: "c2",
      name: "Innovatech",
      industry: "Product Design",
      location: "New York, NY",
      avatar: "/placeholder.svg?height=100&width=100",
      isFavorite: true,
    },
    {
      id: "c3",
      name: "DevWorks",
      industry: "Consulting",
      location: "Austin, TX",
      avatar: "/placeholder.svg?height=100&width=100",
      isFavorite: false,
    },
    {
      id: "c4",
      name: "CodeWorks",
      industry: "Backend Services",
      location: "Seattle, WA",
      avatar: "/placeholder.svg?height=100&width=100",
      isFavorite: false,
    },
  ])

  const [isGridView, setIsGridView] = useState(false)
  const [sortBy, setSortBy] = useState<"relevant" | "alphabetical" | "industry" | "location">("relevant")
  const [isFavoritesExpanded, setIsFavoritesExpanded] = useState(true)
  const [searchResults, setSearchResults] = useState<Company[] | null>(null)

  const handleToggleFavorite = (companyId: string) => {
    setCompanies((prev) =>
      prev.map((company) => (company.id === companyId ? { ...company, isFavorite: !company.isFavorite } : company)),
    )
  }

  const handleUnfollow = (companyId: string) => {
    setCompanies((prev) => prev.filter((company) => company.id !== companyId))
  }

  const handleSearch = (params: { firstName: string; lastName: string }) => {
    const { firstName, lastName } = params
    const filterByName = (name: string) =>
      (!firstName && !lastName) ||
      (firstName && name.toLowerCase().includes(firstName.toLowerCase())) ||
      (lastName && name.toLowerCase().includes(lastName.toLowerCase()))
    const results = companies.filter(c => filterByName(c.name))
    setSearchResults(results)
  }

  const handleCloseSearchResults = () => setSearchResults(null)

  const favoriteCompanies = companies.filter((company) => company.isFavorite)

  const suggestedCompanies: Company[] = [
    {
      id: "sc1",
      name: "Dunder Mifflin",
      industry: "Paper",
      location: "Scranton, PA",
      avatar: "/placeholder.svg?height=100&width=100",
      isFavorite: false,
    },
    {
      id: "sc2",
      name: "Acme Corp",
      industry: "Manufacturing",
      location: "Los Angeles, CA",
      avatar: "/placeholder.svg?height=100&width=100",
      isFavorite: false,
    },
    {
      id: "sc3",
      name: "Globex",
      industry: "Technology",
      location: "Chicago, IL",
      avatar: "/placeholder.svg?height=100&width=100",
      isFavorite: false,
    },
  ]

  function sortCompanies(arr: Company[]) {
    if (sortBy === "alphabetical") {
      return [...arr].sort((a, b) => a.name.localeCompare(b.name))
    }
    if (sortBy === "industry") {
      return [...arr].sort((a, b) => a.industry.localeCompare(b.industry))
    }
    if (sortBy === "location") {
      return [...arr].sort((a, b) => a.location.localeCompare(b.location))
    }
    return arr
  }

  const connectionStates = Object.fromEntries(companies.map(c => [c.id, "Followed"]))
  const favoriteIds = companies.filter(c => c.isFavorite).map(c => c.id)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-sky-100 p-4">
      <div className="max-w-6xl mx-auto space-y-6 mt-4">
        {/* SearchSection */}
        <div className="pt-2 pb-1">
          <SearchSection
            title="Find companies you follow"
            description="Manage and connect with companies you are following."
            placeholder="Search companies"
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
                    <GridCompanies
                      companies={searchResults.map(c => ({
                        id: c.id,
                        name: c.name,
                        industry: c.industry,
                        location: c.location,
                        avatar: c.avatar,
                      }))}
                      connectionStates={Object.fromEntries(searchResults.map(c => [c.id, "Followed"]))}
                      onConnect={() => {}}
                      onUnfollow={handleUnfollow}
                      onToggleFavorite={handleToggleFavorite}
                      favoriteIds={searchResults.filter(c => c.isFavorite).map(c => c.id)}
                    />
                  ) : (
                    <ListCompanies
                      companies={searchResults.map(c => ({
                        id: c.id,
                        name: c.name,
                        industry: c.industry,
                        location: c.location,
                        avatar: c.avatar,
                        isFavorite: c.isFavorite,
                      }))}
                      onToggleFavorite={handleToggleFavorite}
                      onUnfollow={handleUnfollow}
                      favoriteIds={searchResults.filter(c => c.isFavorite).map(c => c.id)}
                    />
                  )
                ) : (
                  <div className="text-center py-8 text-gray-500">No companies found</div>
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
                  <MenuItem value="industry">Industry</MenuItem>
                  <MenuItem value="location">Location</MenuItem>
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

        {/* Companies Section */}
        <div className="space-y-6">
          {/* Favorites Section */}
          {favoriteCompanies.length > 0 && (
            <div className="bg-white rounded-xl shadow-md overflow-hidden border border-blue-200">
              <div className="flex justify-between items-center p-4 border-b border-blue-100">
                <span className="text-blue-700 font-medium flex items-center text-base">
                  <Star className="h-4 w-4 mr-1 text-yellow-500" />
                  Favorites
                  <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200 ml-2 text-xs">
                    {favoriteCompanies.length}
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
                    <GridCompanies
                      companies={sortCompanies(favoriteCompanies).map(c => ({
                        id: c.id,
                        name: c.name,
                        industry: c.industry,
                        location: c.location,
                        avatar: c.avatar,
                      }))}
                      connectionStates={Object.fromEntries(favoriteCompanies.map(c => [c.id, "Followed"]))}
                      onConnect={() => {}}
                      onUnfollow={handleUnfollow}
                      onToggleFavorite={handleToggleFavorite}
                      favoriteIds={favoriteCompanies.filter(c => c.isFavorite).map(c => c.id)}
                    />
                  ) : (
                    <ListCompanies
                      companies={sortCompanies(favoriteCompanies).map(c => ({
                        id: c.id,
                        name: c.name,
                        industry: c.industry,
                        location: c.location,
                        avatar: c.avatar,
                        isFavorite: c.isFavorite,
                      }))}
                      onToggleFavorite={handleToggleFavorite}
                      onUnfollow={handleUnfollow}
                      favoriteIds={favoriteCompanies.filter(c => c.isFavorite).map(c => c.id)}
                    />
                  )}
                </div>
              )}
            </div>
          )}

          {/* All Companies Section */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden border border-blue-200">
            <div className="flex justify-between items-center p-4 border-b border-blue-100">
              <h3 className="text-blue-700 font-medium flex items-center text-base">
                All Companies
                <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200 ml-2 text-xs">
                  {companies.length}
                </Badge>
              </h3>
            </div>
            <div className="p-4">
              {isGridView ? (
                <GridCompanies
                  companies={sortCompanies(companies).map(c => ({
                    id: c.id,
                    name: c.name,
                    industry: c.industry,
                    location: c.location,
                    avatar: c.avatar,
                  }))}
                  connectionStates={connectionStates}
                  onConnect={() => {}}
                  onUnfollow={handleUnfollow}
                  onToggleFavorite={handleToggleFavorite}
                  favoriteIds={favoriteIds}
                />
              ) : (
                <ListCompanies
                  companies={sortCompanies(companies).map(c => ({
                    id: c.id,
                    name: c.name,
                    industry: c.industry,
                    location: c.location,
                    avatar: c.avatar,
                    isFavorite: c.isFavorite,
                  }))}
                  onToggleFavorite={handleToggleFavorite}
                  onUnfollow={handleUnfollow}
                  favoriteIds={favoriteIds}
                />
              )}
            </div>
          </div>

          {/* Suggested Companies Section */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden border border-blue-200">
            <div className="flex justify-between items-center p-4 border-b border-blue-100">
              <h2 className="text-blue-700 font-medium text-base">Suggested Companies for You</h2>
              <button className="text-blue-600 font-medium hover:underline text-base">View All</button>
            </div>
            <div className="p-4">
              <GridCompanies
                companies={suggestedCompanies.map(c => ({
                  id: c.id,
                  name: c.name,
                  industry: c.industry,
                  location: c.location,
                  avatar: c.avatar,
                }))}
                connectionStates={Object.fromEntries(suggestedCompanies.map(c => [c.id, "Follow"]))}
                onConnect={() => {}}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
