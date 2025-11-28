/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import { useEffect, useState } from "react"
import { List, Star, ChevronDown } from "lucide-react"
import { LuLayoutGrid } from "react-icons/lu"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import SearchSection from "../../components/search-section"
import { TbUserCheck } from "react-icons/tb"
import { GridCompanies } from "../../components/grid view cards/grid-companies"
import { ListCompanies } from "../../components/list view items/list-companies"
import { useSession } from "next-auth/react"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { Loader2 } from "lucide-react"
import Lottie from "lottie-react"
import catLoader from "../../../../../../public/animations/cat_loader.json"

interface Company {
  id: string
  name: string
  industry: string
  logo: string
  favorite: boolean
  location: string
}

export default function CompaniesFollowingPage() {
  const [companies, setCompanies] = useState<Company[]>([])
  const [isGridView, setIsGridView] = useState(false)
  const [sortBy, setSortBy] = useState<"relevant" | "alphabetical" | "industry" | "location">("relevant")
  const [isFavoritesExpanded, setIsFavoritesExpanded] = useState(true)
  const [searchResults, setSearchResults] = useState<Company[] | null>(null)
  const [loadingCompanies, setLoadingCompanies] = useState(true)
  const [suggestedCompanies, setSuggestedCompanies] = useState<Company[]>([])
  const [loadingSuggestions, setLoadingSuggestions] = useState(true)
  const { data: session } = useSession()
  const studentId = session?.user?.studentId
  const [suggestedConnectionStates, setSuggestedConnectionStates] = useState<Record<string, string>>({})

  const fetchCompanies = async () => {
    setLoadingCompanies(true)
    const res = await fetch("/api/students/people/fetchCompanies")
    const data = await res.json()
    setCompanies(
      (data.companies || []).map((c: any) => ({
        id: c.id,
        name: c.name,
        industry: c.industry,
        logo: c.logo,
        favorite: c.favorite,
        location: c.location ?? "",
      }))
    )
    setLoadingCompanies(false)
  }

  useEffect(() => {
    fetchCompanies()
  }, [])

  useEffect(() => {
    setLoadingSuggestions(true)
    fetch("/api/students/people/suggestions/companies")
      .then(res => res.json())
      .then(async data => {
        if (Array.isArray(data.companies)) {
          const mapped = data.companies.map((c: any) => ({
            id: c.id,
            name: c.company_name || c.name || "",
            industry: c.company_industry || c.industry || "",
            logo: c.logoUrl || c.logo || "/placeholder.svg?height=100&width=100",
            favorite: false,
            location: c.location ?? "",
          }))
          setSuggestedCompanies(mapped)
          const states: Record<string, string> = {}
          await Promise.all(
            mapped.map(async (company: Company) => {
              try {
                const statusRes = await fetch(`/api/students/people/sendFollow/companies?companyId=${company.id}`)
                const statusData = await statusRes.json()
                if (statusData.status === "Following") {
                  states[company.id] = "Following"
                } else {
                  states[company.id] = "Follow"
                }
              } catch {
                states[company.id] = "Follow"
              }
            })
          )
          setSuggestedConnectionStates(states)
        }
        setLoadingSuggestions(false)
      })
  }, [])

  const handleToggleFavorite = async (companyId: string) => {
    setCompanies(prev =>
      prev.map(company =>
        company.id === companyId ? { ...company, favorite: !company.favorite } : company
      )
    )
    if (!studentId) return
    const company = companies.find(c => c.id === companyId)
    const action = company?.favorite ? "unfavorite" : "favorite"
    await fetch("/api/students/people/actionCompanies", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, studentId, companyId }),
    })
  }

  const handleUnfollow = async (companyId: string) => {
    if (!studentId) return
    await fetch("/api/students/people/actionCompanies", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "unfollow", studentId, companyId }),
    })
    setCompanies(prev => prev.filter(company => company.id !== companyId))
  }

  const handleSearch = (params: { firstName: string; lastName: string }) => {
    const { firstName, lastName } = params
    const filterByNameOrIndustry = (company: Company) =>
      (!firstName && !lastName) ||
      (firstName && (
        company.name.toLowerCase().includes(firstName.toLowerCase()) ||
        company.industry.toLowerCase().includes(firstName.toLowerCase())
      )) ||
      (lastName && (
        company.name.toLowerCase().includes(lastName.toLowerCase()) ||
        company.industry.toLowerCase().includes(lastName.toLowerCase())
      ))
    const results = companies.filter(filterByNameOrIndustry)
    setSearchResults(results)
  }

  const handleCloseSearchResults = () => setSearchResults(null)

  const favoriteCompanies = companies.filter(company => company.favorite)
  const followedCompanyIds = new Set(companies.map(c => c.id))

  function sortCompanies(arr: Company[]) {
    if (sortBy === "alphabetical") {
      return [...arr].sort((a, b) => a.name.localeCompare(b.name))
    }
    if (sortBy === "industry") {
      return [...arr].sort((a, b) => a.industry.localeCompare(b.industry))
    }
    return arr
  }

  const connectionStates = Object.fromEntries(companies.map(c => [c.id, "Followed"]))
  const favoriteIds = companies.filter(c => c.favorite).map(c => c.id)

  const handleConnectSuggestedCompany = async (companyId: string) => {
    if (!studentId) return
    const currentState = suggestedConnectionStates[companyId]
    if (currentState === "Following") {
      await fetch("/api/students/people/sendFollow/companies", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ companyId }),
      })
      setSuggestedConnectionStates(prev => ({ ...prev, [companyId]: "Follow" }))
    } else {
      await fetch("/api/students/people/sendFollow/companies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ companyId }),
      })
      setSuggestedConnectionStates(prev => ({ ...prev, [companyId]: "Following" }))
    }
    await fetchCompanies()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-sky-100 p-4">
      <div className="max-w-6xl mx-auto space-y-6 mt-4">
        <div className="pt-2 pb-1">
          <SearchSection
            title="Find companies you follow"
            description="Manage and connect with companies you are following."
            placeholder="Search companies"
            icon={<TbUserCheck className="h-6 w-6 text-blue-300" />}
            onSearch={handleSearch}
          />
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
                        avatar: c.logo,
                        location: c.location ?? "",
                      }))}
                      connectionStates={Object.fromEntries(searchResults.map(c => [c.id, "Followed"]))}
                      onConnect={() => {}}
                      onUnfollow={handleUnfollow}
                      onToggleFavorite={handleToggleFavorite}
                      favoriteIds={searchResults.filter(c => c.favorite).map(c => c.id)}
                    />
                  ) : (
                    <ListCompanies
                      companies={searchResults.map(c => ({
                        id: c.id,
                        name: c.name,
                        industry: c.industry,
                        avatar: c.logo,
                        isFavorite: c.favorite,
                        location: c.location ?? "",
                      }))}
                      onToggleFavorite={handleToggleFavorite}
                      onUnfollow={handleUnfollow}
                      favoriteIds={searchResults.filter(c => c.favorite).map(c => c.id)}
                    />
                  )
                ) : (
                  <div className="text-center py-8 text-gray-500">No companies found</div>
                )}
              </div>
            </div>
          )}
          <div className="flex items-center gap-4 mt-2">
            <div className="flex items-center">
              <span className="mr-2 text-sm text-gray-600">Sort by</span>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="min-w-[140px] bg-white px-3 py-1 text-left font-normal">
                    {sortBy === "relevant" && "Relevant"}
                    {sortBy === "alphabetical" && "Alphabetical"}
                    {sortBy === "industry" && "Industry"}
                    {sortBy === "location" && "Location"}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="min-w-[140px]">
                  <DropdownMenuItem onClick={() => setSortBy("relevant")}>Relevant</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortBy("alphabetical")}>Alphabetical</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortBy("industry")}>Industry</DropdownMenuItem>
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
                        avatar: c.logo,
                        location: c.location ?? "",
                      }))}
                      connectionStates={Object.fromEntries(favoriteCompanies.map(c => [c.id, "Followed"]))}
                      onConnect={() => {}}
                      onUnfollow={handleUnfollow}
                      onToggleFavorite={handleToggleFavorite}
                      favoriteIds={favoriteCompanies.filter(c => c.favorite).map(c => c.id)}
                    />
                  ) : (
                    <ListCompanies
                      companies={sortCompanies(favoriteCompanies).map(c => ({
                        id: c.id,
                        name: c.name,
                        industry: c.industry,
                        avatar: c.logo,
                        isFavorite: c.favorite,
                        location: c.location ?? "",
                      }))}
                      onToggleFavorite={handleToggleFavorite}
                      onUnfollow={handleUnfollow}
                      favoriteIds={favoriteCompanies.filter(c => c.favorite).map(c => c.id)}
                    />
                  )}
                </div>
              )}
            </div>
          )}
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
              {loadingCompanies ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="w-48 h-36 mb-4">
                    <Lottie animationData={catLoader} loop={true} />
                  </div>
                  <div className="text-lg font-semibold text-blue-700 mb-2">Loading companies...</div>
                </div>
              ) : companies.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="w-48 h-36 mb-4">
                    <Lottie animationData={catLoader} loop={true} />
                  </div>
                  <div className="text-lg font-semibold text-blue-700 mb-2">No companies followed yet 🏢</div>
                  <div className="text-gray-500 text-base text-center max-w-md">
                    Start following companies to keep up with their latest updates and opportunities!
                  </div>
                </div>
              ) : isGridView ? (
                <GridCompanies
                  companies={sortCompanies(companies).map(c => ({
                    id: c.id,
                    name: c.name,
                    industry: c.industry,
                    avatar: c.logo,
                    location: c.location ?? "",
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
                    avatar: c.logo,
                    isFavorite: c.favorite,
                    location: c.location ?? "",
                  }))}
                  onToggleFavorite={handleToggleFavorite}
                  onUnfollow={handleUnfollow}
                  favoriteIds={favoriteIds}
                />
              )}
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-md overflow-hidden border border-blue-200">
            <div className="flex justify-between items-center p-4 border-b border-blue-100">
              <h2 className="text-blue-700 font-medium text-base">Suggested Companies for You</h2>
              <button className="text-blue-600 font-medium hover:underline text-base">View All</button>
            </div>
            <div className="p-4">
              {loadingSuggestions ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <Loader2 className="animate-spin h-10 w-10 text-blue-400 mb-4" />
                  <div className="text-lg font-semibold text-blue-700 mb-2">Loading suggestions...</div>
                </div>
              ) : (
                <GridCompanies
                  companies={suggestedCompanies
                    .filter(c => !followedCompanyIds.has(c.id))
                    .slice(0, 4)
                    .map(c => ({
                      id: c.id,
                      name: c.name,
                      industry: c.industry,
                      avatar: c.logo,
                      location: c.location ?? "",
                    }))}
                  connectionStates={Object.fromEntries(
                    suggestedCompanies
                      .filter(c => !followedCompanyIds.has(c.id))
                      .slice(0, 4)
                      .map(c => [c.id, suggestedConnectionStates[c.id] || "Follow"])
                  )}
                  onConnect={handleConnectSuggestedCompany}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
