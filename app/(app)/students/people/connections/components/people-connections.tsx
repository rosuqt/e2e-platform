"use client"

import { useState, useEffect } from "react"
import { List, Star,  ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar} from "@mui/material"
import { Badge } from "./ui/badge"
import Image from "next/image"
import SearchSection from "../../components/search-section"
import { LuLayoutGrid } from "react-icons/lu"
import { TbUserHeart } from "react-icons/tb"
import { GridStudents } from "../../components/grid view cards/grid-students"
import { ListStudents } from "../../components/list view items/list-students"
import { Loader2 } from "lucide-react"
import { TbUserCheck } from "react-icons/tb"
import { useSession } from "next-auth/react"
import { UserPlus } from "lucide-react"
import { useRouter } from "next/navigation"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import dynamic from "next/dynamic"
import catLoader from "../../../../../../public/animations/cat_loader.json"

interface Student {
  id: string
  name: string
  title: string
  field: string
  avatar: string
  yearAndSection: string
}

interface FriendRequest {
  id: string
  name: string
  yearSection: string
  program: string
  avatar: string
  cover?: string
}

interface Friend {
  id: string
  name: string
  yearSection: string
  program: string
  avatar: string
  isFavorite: boolean
  requestId: string 
}

interface SuggestedPerson {
  id: string
  name: string
  yearSection: string
  program: string
  avatar: string
  cover?: string
}

type ApiFriendRequest = {
  id: string
  status: string | null
  created_at: string
  favorite: boolean | null
  sender: {
    id: string
    firstName: string
    lastName: string
    year: string | null
    section: string | null
    course: string | null
    email: string | null
    avatar?: string | null
    cover?: string | null
  } | null
}

type ApiConnection = {
  id: string
  status: string | null
  created_at: string
  favorite: boolean | null
  other: {
    id: string
    firstName: string
    lastName: string
    year: string | null
    section: string | null
    course: string | null
    email: string | null
    avatar?: string | null
    cover?: string | null
  } | null
}

type SuggestionStudentRow = {
  id: string
  first_name: string | null
  last_name: string | null
  course: string | null
  year: string | null
  section: string | null
  user_id: string | null
}

const Lottie = dynamic(() => import("lottie-react"), { ssr: false })

export default function ConnectionsPage() {
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([])
  const [friendRequestsLoading, setFriendRequestsLoading] = useState(true)

  const [friends, setFriends] = useState<Friend[]>([])
  const [friendsLoading, setFriendsLoading] = useState(true)

  const [isGridView, setIsGridView] = useState(false)
  const [sortBy, setSortBy] = useState<"relevant" | "alphabetical" | "date">("relevant")
  const [isFavoritesExpanded, setIsFavoritesExpanded] = useState(true)
  const [searchResults, setSearchResults] = useState<{
    friends: Student[]
    requests: FriendRequest[]
  } | null>(null)
  const [suggestedPeople, setSuggestedPeople] = useState<SuggestedPerson[]>([])
  const [suggestedLoading, setSuggestedLoading] = useState(true)
  const { data: session } = useSession()
  const currentStudentId = session?.user?.studentId ?? ""
  const router = useRouter()

  const [suggestedConnectionStates, setSuggestedConnectionStates] = useState<Record<string, string>>({})

  useEffect(() => {
    async function fetchRequests() {
      setFriendRequestsLoading(true)
      const res = await fetch("/api/students/people/fetchRequest")
      if (res.ok) {
        const data: ApiFriendRequest[] = await res.json()
        setFriendRequests(
          data.map(r => ({
            id: r.id,                                                     
            name: r.sender ? `${r.sender.firstName} ${r.sender.lastName}` : "Unknown",
            yearSection: r.sender ? `${r.sender.year || ""} yr${r.sender.section ? " - " + r.sender.section : ""}` : "",
            program: r.sender?.course || "",
            avatar: r.sender?.avatar || "/placeholder.svg?height=100&width=100",
            cover: r.sender?.cover || undefined,
          }))
        )
      }
      setFriendRequestsLoading(false)
    }
    fetchRequests()
  }, [])

  useEffect(() => {
    async function fetchConnections() {
      setFriendsLoading(true)
      const res = await fetch("/api/students/people/fetchConnections")
      if (res.ok) {
        const data: ApiConnection[] = await res.json()
        setFriends(
          (data ?? []).map((conn) => ({
            id: conn.other?.id || "",
            name: conn.other ? `${conn.other.firstName} ${conn.other.lastName}` : "Unknown",
            yearSection: conn.other ? `${conn.other.year || ""} yr${conn.other.section ? " - " + conn.other.section : ""}` : "",
            program: conn.other?.course || "",
            avatar: conn.other?.avatar || "/placeholder.svg?height=100&width=100",
            isFavorite: !!conn.favorite,
            cover: conn.other?.cover || undefined,
            requestId: conn.id 
          }))
        )
      }
      setFriendsLoading(false)
    }
    fetchConnections()
  }, [])

  useEffect(() => {
    async function fetchSuggestions() {
      setSuggestedLoading(true)
      if (!currentStudentId) {
        setSuggestedPeople([])
        setSuggestedLoading(false)
        return
      }
      const res = await fetch("/api/students/people/suggestions/students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: currentStudentId }),
      })
      if (res.ok) {
        const result = await res.json()
        const students: SuggestionStudentRow[] = result.students ?? []
        const friendIds = new Set(friends.map(f => f.id))
        const filtered = students.filter(s => !friendIds.has(s.id)).slice(0, 4)
        const mapped = await Promise.all(
          filtered.map(async s => {
            let avatar = ""
            let cover = ""
            try {
              const avatarRes = await fetch(`/api/students/people/suggestions/students?id=${s.id}&type=avatar`)
              const avatarData = await avatarRes.json()
              if (avatarData.signedUrl) avatar = avatarData.signedUrl
            } catch {}
            try {
              const coverRes = await fetch(`/api/students/people/suggestions/students?id=${s.id}&type=cover`)
              const coverData = await coverRes.json()
              if (coverData.signedUrl) cover = coverData.signedUrl
            } catch {}
            return {
              id: s.id,
              name: `${s.first_name ?? ""} ${s.last_name ?? ""}`.trim(),
              yearSection: `${s.year || ""} yr${s.section ? " - " + s.section : ""}`,
              program: s.course || "",
              avatar,
              cover,
            }
          })
        )
        setSuggestedPeople(mapped)
      }
      setSuggestedLoading(false)
    }
    fetchSuggestions()
  }, [currentStudentId, friends])

  useEffect(() => {
    async function fetchSuggestedConnectionStates() {
      if (!currentStudentId) return
      const states: Record<string, string> = {}
      await Promise.all(
        suggestedPeople.map(async person => {
          if (person.id === currentStudentId) return
          try {
            const statusRes = await fetch(`/api/students/people/suggestions/students?senderId=${currentStudentId}&receiverId=${person.id}`)
            const statusData = await statusRes.json()
            if (statusData.status === "Requested") {
              states[person.id] = "Requested"
            } else {
              states[person.id] = "Connect"
            }
          } catch {
            states[person.id] = "Connect"
          }
        })
      )
      setSuggestedConnectionStates(states)
    }
    fetchSuggestedConnectionStates()
  }, [currentStudentId, suggestedPeople])

  const handleAcceptRequest = async (requestId: string) => {
    await fetch("/api/students/people/actionRequest", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "accept", requestId }),
    })
    const request = friendRequests.find((req) => req.id === requestId)
    if (request) {
      setFriends((prev) => [
        ...prev,
        {
          id: `f${prev.length + 1}`,
          name: request.name,
          yearSection: request.yearSection,
          program: request.program,
          avatar: request.avatar,
          isFavorite: false,
          requestId: requestId
        },
      ])
      setFriendRequests((prev) => prev.filter((req) => req.id !== requestId))
    }
  }

  const handleIgnoreRequest = async (requestId: string) => {
    setTimeout(async () => {
      await fetch("/api/students/people/actionRequest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "ignore", requestId }),
      })
      setFriendRequests((prev) => prev.filter((req) => req.id !== requestId))
    }, 400)
  }

  const handleToggleFavorite = async (friendId: string) => {
    const friend = friends.find(f => f.id === friendId)
    if (!friend) return
    const action = friend.isFavorite ? "unfavorite" : "favorite"
    await fetch("/api/students/people/actionRequest", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, requestId: friend.requestId }),
    })
    setFriends((prev) =>
      prev.map((f) =>
        f.id === friendId ? { ...f, isFavorite: !f.isFavorite } : f
      )
    )
  }

  const handleUnfriend = async (friendId: string) => {
    const friend = friends.find(f => f.id === friendId)
    if (!friend) return
    await fetch("/api/students/people/actionRequest", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "unfriend", requestId: friend.requestId }),
    })
    setFriends((prev) => prev.filter((f) => f.id !== friendId))
  }

  const handleSearch = (params: { firstName: string; lastName: string }) => {
    const { firstName, lastName } = params
    const filterByName = (name: string) =>
      (!firstName && !lastName) ||
      (firstName && name.toLowerCase().includes(firstName.toLowerCase())) ||
      (lastName && name.toLowerCase().includes(lastName.toLowerCase()))
    const students = friends
      .map(mapFriendToStudent)
      .filter(s => filterByName(s.name))
    const requests = friendRequests.filter(r => filterByName(r.name))
    setSearchResults({ friends: students, requests })
  }

  const handleCloseSearchResults = () => setSearchResults(null)

  const favoritesFriends = friends.filter((friend) => friend.isFavorite)

  function sortFriends<T extends { name: string }>(arr: T[]) {
    if (sortBy === "alphabetical") {
      return [...arr].sort((a, b) => a.name.localeCompare(b.name))
    }
    return arr
  }

  function mapFriendToStudent(friend: Friend): Student {
    return {
      id: friend.id,
      name: friend.name,
      title: friend.program,
      field: friend.program.replace(/^BS\s*-\s*/i, ""),
      avatar: friend.avatar,
      yearAndSection: friend.yearSection,
    }
  }

  const friendsConnectionStates = Object.fromEntries(friends.map(f => [f.id, "Connected"]))
  const favoritesConnectionStates = Object.fromEntries(favoritesFriends.map(f => [f.id, "Connected"]))

  const favoriteIds = friends.filter(f => f.isFavorite).map(f => f.id)

  function getInitials(name: string) {
    const parts = name.trim().split(" ")
    if (parts.length === 1) return parts[0][0]?.toUpperCase() ?? ""
    return (parts[0][0] ?? "") + (parts[parts.length - 1][0] ?? "")
  }

  const showNoFriendsFallback = !friendsLoading && friends.length === 0 && !friendRequestsLoading && friendRequests.length === 0

  const handleSuggestedConnect = async (id: string) => {
    const currentState = suggestedConnectionStates[id]
    if (currentState === "Requested") {
      await fetch("/api/students/people/sendRequest", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ senderId: currentStudentId, receiverId: id }),
      })
      setSuggestedConnectionStates(prev => ({ ...prev, [id]: "Connect" }))
    } else {
      await fetch("/api/students/people/sendRequest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ senderId: currentStudentId, receiverId: id }),
      })
      setSuggestedConnectionStates(prev => ({ ...prev, [id]: "Requested" }))
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-sky-100 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="pt-2 pb-1">
          <SearchSection
            title="Find your connection"
            description="View and connect with your friends and classmates across your network."
            placeholder="Search connections"
            icon={<TbUserHeart className="h-6 w-6 text-blue-300" />}
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
                {(searchResults.friends.length > 0 || searchResults.requests.length > 0) ? (
                  <>
                    {searchResults.friends.length > 0 && (
                      <div className="mb-6">
                        <div className="font-semibold text-blue-700 mb-2">Friends</div>
                        <GridStudents
                          students={searchResults.friends}
                          connectionStates={friendsConnectionStates}
                          onConnect={() => {}}
                          showMessageForConnected
                          onToggleFavorite={handleToggleFavorite}
                          onUnfriend={handleUnfriend}
                          favoriteIds={favoriteIds}
                        />
                      </div>
                    )}
                    {searchResults.requests.length > 0 && (
                      <div>
                        <div className="font-semibold text-blue-700 mb-2">Requests</div>
                        <div className="space-y-4">
                          {searchResults.requests.map((request) => (
                            <FriendRequestListItem
                              key={request.id}
                              request={request}
                              onAccept={handleAcceptRequest}
                              onIgnore={handleIgnoreRequest}
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center py-8 text-gray-500">No connections found</div>
                )}
              </div>
            </div>
          )}
          <div className="flex items-center gap-4 mt-2">
            <div className="flex items-center whitespace-nowrap">
              <span className="mr-2 text-sm text-gray-600">Sort by</span>
              <Select
                value={sortBy}
                onValueChange={(v: "relevant" | "alphabetical" | "date") => setSortBy(v)}
              >
                <SelectTrigger className="min-w-[140px] bg-white border border-gray-200 rounded-md text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="relevant">Relevant</SelectItem>
                  <SelectItem value="alphabetical">Alphabetical</SelectItem>
                  <SelectItem value="date">Date</SelectItem>
                </SelectContent>
              </Select>
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

        {showNoFriendsFallback && (
          <div className="bg-white rounded-xl shadow-md overflow-hidden border border-blue-200 flex flex-col items-center justify-center py-12">
            <div className="mb-6">
              <Lottie
                loop
                animationData={catLoader}
                style={{ width: 220, height: 220 }}
              />
            </div>
            <h2 className="text-blue-700 font-bold text-2xl mb-2 text-center">No Friends… Yet </h2>
            <p className="text-gray-500 text-lg text-center max-w-md">Looks like it’s just you for now — go say hi and make some new buddies!</p>
          </div>
        )}

        {!showNoFriendsFallback && (
          <>
            {/* Friend Requests Section */}
            {(friendRequestsLoading || friendRequests.length > 0) && (
              <div className="bg-white rounded-xl shadow-md overflow-hidden border border-blue-200">
                <div className="flex justify-between items-center p-4 border-b border-blue-100">
                  <h2 className="text-blue-700 font-medium">Requests</h2>
                  <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200">
                    {friendRequestsLoading ? <Loader2 className="animate-spin h-4 w-4" /> : `${friendRequests.length} new`}
                  </Badge>
                </div>
                <div className="p-4">
                  {friendRequestsLoading ? (
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
                  ) : isGridView ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {sortFriends(friendRequests).map((request) => (
                        <FriendRequestCard
                          key={request.id}
                          request={request}
                          onAccept={handleAcceptRequest}
                          onIgnore={handleIgnoreRequest}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {sortFriends(friendRequests).map((request) => (
                        <FriendRequestListItem
                          key={request.id}
                          request={request}
                          onAccept={handleAcceptRequest}
                          onIgnore={handleIgnoreRequest}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Friends Section */}
            <div className="space-y-6">
              {/* Favorites Section */}
              {friendsLoading ? (
                <div className="bg-white rounded-xl shadow-md overflow-hidden border border-blue-200">
                  <div className="flex justify-between items-center p-4 border-b border-blue-100">
                    <span className="text-blue-700 font-medium flex items-center">
                      <Star className="h-4 w-4 mr-1 text-yellow-500" />
                      Favorites
                      <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200 ml-2 text-xs">
                        <Loader2 className="animate-spin h-4 w-4" />
                      </Badge>
                    </span>
                  </div>
                  <div className="p-4">
                    <div className="space-y-2">
                      {Array.from({ length: 2 }).map((_, i) => (
                        <div key={i} className="h-16 bg-blue-100 rounded animate-pulse" />
                      ))}
                    </div>
                  </div>
                </div>
              ) : favoritesFriends.length > 0 && (
                <div className="bg-white rounded-xl shadow-md overflow-hidden border border-blue-200">
                  <div className="flex justify-between items-center p-4 border-b border-blue-100">
                    <span className="text-blue-700 font-medium flex items-center">
                      <Star className="h-4 w-4 mr-1 text-yellow-500" />
                      Favorites
                      <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200 ml-2 text-xs">
                        {favoritesFriends.length}
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
                        <GridStudents
                          students={sortFriends(favoritesFriends).map(mapFriendToStudent)}
                          connectionStates={favoritesConnectionStates}
                          onConnect={() => {}}
                          showMessageForConnected
                          onToggleFavorite={handleToggleFavorite}
                          onUnfriend={handleUnfriend}
                          favoriteIds={favoriteIds}
                        />
                      ) : (
                        <ListStudents
                          students={sortFriends(favoritesFriends).map(mapFriendToStudent)}
                          connectionStates={favoritesConnectionStates}
                          onToggleFavorite={handleToggleFavorite}
                          onUnfriend={handleUnfriend}
                          favoriteIds={favoriteIds}
                          showMessageForConnected
                        />
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* All Friends Section */}
              <div className="bg-white rounded-xl shadow-md overflow-hidden border border-blue-200">
                <div className="flex justify-between items-center p-4 border-b border-blue-100">
                  <h3 className="text-blue-700 font-medium flex items-center">
                    All Friends
                    <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200 ml-2 text-xs">
                      {friendsLoading ? <Loader2 className="animate-spin h-4 w-4" /> : friends.length}
                    </Badge>
                  </h3>
                </div>
                <div className="p-4">
                  {friendsLoading ? (
                    <div className="space-y-2">
                      {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="h-16 bg-blue-100 rounded animate-pulse" />
                      ))}
                    </div>
                  ) : isGridView ? (
                    <GridStudents
                      students={sortFriends(friends).map(mapFriendToStudent)}
                      connectionStates={friendsConnectionStates}
                      onConnect={() => {}}
                      showMessageForConnected
                      onToggleFavorite={handleToggleFavorite}
                      onUnfriend={handleUnfriend}
                      favoriteIds={favoriteIds}
                    />
                  ) : (
                    <ListStudents
                      students={sortFriends(friends).map(mapFriendToStudent)}
                      connectionStates={friendsConnectionStates}
                      onToggleFavorite={handleToggleFavorite}
                      onUnfriend={handleUnfriend}
                      favoriteIds={favoriteIds}
                      showMessageForConnected
                    />
                  )}
                </div>
              </div>
            </div>
          </>
        )}

        {/* Suggested People Section - always shown at the bottom */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-blue-200">
          <div className="flex justify-between items-center p-4 border-b border-blue-100">
            <h2 className="text-blue-700 font-medium flex items-center">
              Suggested People for you
              <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200 ml-2 text-xs">
                {suggestedLoading ? <Loader2 className="animate-spin h-4 w-4" /> : suggestedPeople.length}
              </Badge>
            </h2>
            <button
              className="text-blue-600 font-medium hover:underline"
              onClick={() => router.push("/students/people/suggestions")}
            >
              View All
            </button>
          </div>
          <div className="p-4">
            {suggestedLoading ? (
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
            ) : suggestedPeople.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12">
                <UserPlus className="w-12 h-12 text-gray-300 mb-4" />
                <div className="text-gray-400 text-base font-base">No new people to suggest right now.<br />Check back soon for more classmates!</div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {suggestedPeople.map(person => (
                  <div key={person.id} className="bg-white border border-blue-200 rounded-xl overflow-hidden shadow-sm flex flex-col">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-purple-500 h-16 relative"
                      style={person.cover ? { backgroundImage: `url(${person.cover})`, backgroundSize: "cover", backgroundPosition: "center" } : undefined}
                    />
                    <div className="px-4 pt-10 pb-4 relative flex-1 flex flex-col">
                      <Avatar
                        className="absolute left-1/2 transform -translate-x-1/2 -mb-11"
                        style={{
                          width: 80,
                          height: 80,
                          top: -64,
                          border: "4px solid white",
                          boxSizing: "border-box",
                          background: "#fff",
                        }}
                      >
                        {person.avatar ? (
                          <Image
                            src={person.avatar}
                            alt={person.name}
                            fill
                            className="object-cover w-full h-full absolute inset-0 rounded-full"
                            style={{ width: "100%", height: "100%" }}
                            sizes="80px"
                          />
                        ) : (
                          <span style={{
                            width: "100%",
                            height: "100%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: 32,
                            fontWeight: 600,
                            color: "#888",
                            backgroundColor: "#e6e7eaff",
                          }}>
                            {getInitials(person.name)}
                          </span>
                        )}
                      </Avatar>
                      <div className="text-center mb-2 mt-2">
                        <h3 className="font-medium text-gray-900">{person.name}</h3>
                        <p className="text-sm text-gray-500 line-clamp-1">{person.yearSection}</p>
                      </div>
                      <div className="flex items-center justify-center mb-3">
                        <div className="bg-yellow-400 text-blue-800 text-xs font-bold px-1 py-0.5 rounded mr-1 flex items-center justify-center">
                          STI
                        </div>
                        <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200 text-xs">
                          {person.program}
                        </Badge>
                      </div>
                      <div className="flex mt-auto">
                        <Button
                          className={`flex-1 rounded-full px-4 py-2 font-medium transition-colors duration-150 ${
                            suggestedConnectionStates[person.id] === "Requested"
                              ? "bg-gray-100 text-gray-500 border border-gray-200 cursor-default"
                              : "bg-blue-600 hover:bg-blue-700 text-white"
                          }`}
                          onClick={() => handleSuggestedConnect(person.id)}
                          disabled={suggestedConnectionStates[person.id] === "Requested"}
                        >
                          {suggestedConnectionStates[person.id] === "Requested" ? "Requested" : "Connect"}
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// Friend Request Card (Grid)
function FriendRequestCard({
  request,
  onAccept,
  onIgnore,
}: {
  request: FriendRequest
  onAccept: (id: string) => void
  onIgnore: (id: string) => void
}) {
  const [accepted, setAccepted] = useState(false)
  const [fading, setFading] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleAccept = async () => {
    setAccepted(true)
    setLoading(true)
    const res = await fetch("/api/students/people/actionRequest", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "accept", requestId: request.id }),
    })
    setLoading(false)
    if (res.ok) {
      setTimeout(() => {
        setFading(true)
        setTimeout(() => onAccept(request.id), 400)
      }, 400)
    }
  }

  const handleIgnore = async () => {
    setLoading(true)
    const res = await fetch("/api/students/people/actionRequest", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "ignore", requestId: request.id }),
    })
    setLoading(false)
    if (res.ok) {
      setTimeout(() => {
        setFading(true)
        setTimeout(() => onIgnore(request.id), 400)
      }, 400)
    }
  }

  return (
    <div
      className={`bg-white border border-blue-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md flex flex-col transition-opacity duration-400 ${
        fading ? "opacity-0" : "opacity-100"
      }`}
    >
      <div
        className="bg-gradient-to-r from-blue-500 to-purple-500 h-16 relative"
        style={request.cover ? { backgroundImage: `url(${request.cover})`, backgroundSize: "cover", backgroundPosition: "center" } : undefined}
      />
      <div className="px-4 pt-10 pb-4 relative flex-1 flex flex-col">
        <Avatar
          className="absolute left-1/2 transform -translate-x-1/2 -mb-11"
          style={{
            width: 80,
            height: 80,
            top: -64,
            border: "4px solid white",
            boxSizing: "border-box",
            background: "#fff",
          }}
        >
          <Image
            src={request.avatar || "/placeholder.svg"}
            alt={request.name}
            fill
            className="object-cover w-full h-full absolute inset-0 rounded-full"
            style={{ width: "100%", height: "100%" }}
            sizes="80px"
          />
        </Avatar>
        <div className="text-center mb-2 mt-2">
          <h3 className="font-medium text-gray-900">{request.name}</h3>
          <p className="text-sm text-gray-500 line-clamp-1">{request.yearSection}</p>
        </div>
        <div className="flex items-center justify-center mb-3">
          <div className="bg-yellow-400 text-blue-800 text-xs font-bold px-1 py-0.5 rounded mr-1 flex items-center justify-center">
            STI
          </div>
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200 text-xs">
            {request.program}
          </Badge>
        </div>
        <div className="flex gap-2 mt-auto">
          <Button
            variant="outline"
            className="flex-1 text-gray-600 border-gray-200 hover:bg-gray-50"
            onClick={handleIgnore}
            disabled={accepted || fading || loading}
          >
            Ignore
          </Button>
          {accepted ? (
            <Button
              variant="outline"
              className="flex-1 bg-white border border-blue-500 text-blue-600 flex items-center justify-center cursor-default"
              disabled
            >
              <TbUserCheck className="mr-2 text-blue-500" />
              Accepted
            </Button>
          ) : (
            <Button
              className="flex-1 bg-blue-500 hover:bg-blue-600 text-white flex items-center justify-center"
              onClick={handleAccept}
              disabled={fading || loading}
            >
              Accept
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

// Friend Request List Item (List)
function FriendRequestListItem({
  request,
  onAccept,
  onIgnore,
}: {
  request: FriendRequest
  onAccept: (id: string) => void
  onIgnore: (id: string) => void
}) {
  const [accepted, setAccepted] = useState(false)
  const [fading, setFading] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleAccept = async () => {
    setAccepted(true)
    setLoading(true)
    const res = await fetch("/api/students/people/actionRequest", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "accept", requestId: request.id }),
    })
    setLoading(false)
    if (res.ok) {
      setTimeout(() => {
        setFading(true)
        setTimeout(() => onAccept(request.id), 400)
      }, 400)
    }
  }

  const handleIgnore = async () => {
    setLoading(true)
    const res = await fetch("/api/students/people/actionRequest", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "ignore", requestId: request.id }),
    })
    setLoading(false)
    if (res.ok) {
      setTimeout(() => {
        setFading(true)
        setTimeout(() => onIgnore(request.id), 400)
      }, 400)
    }
  }

  return (
    <div
      className={`flex items-center justify-between border-b border-gray-100 pb-4 transition-opacity duration-400 ${
        fading ? "opacity-0" : "opacity-100"
      }`}
    >
      <div className="flex items-center">
        <Avatar
          className="h-12 w-12 mr-3"
          style={{
            border: "4px solid white", 
            boxSizing: "border-box",
            background: "#fff",
          }}
        >
          <Image
            src={request.avatar || "/placeholder.svg"}
            alt={request.name}
            fill
            className="object-cover w-full h-full absolute inset-0 rounded-full"
            style={{ width: "100%", height: "100%" }}
            sizes="48px"
          />
        </Avatar>
        <div>
          <h3 className="font-medium text-gray-900">{request.name}</h3>
          <div className="text-sm text-gray-500">
            {request.yearSection}
            <br />
            {request.program}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          className="text-gray-600 border-gray-200 hover:bg-gray-50"
          onClick={handleIgnore}
          disabled={accepted || fading || loading}
        >
          Ignore
        </Button>
        {accepted ? (
          <Button
            variant="outline"
            className="bg-white border border-blue-500 text-blue-600 flex items-center justify-center cursor-default"
            disabled
          >
            <TbUserCheck className="mr-2 text-blue-500" />
            Accepted
          </Button>
        ) : (
          <Button
            className="bg-blue-500 hover:bg-blue-600 text-white"
            onClick={handleAccept}
            disabled={fading || loading}
          >
            Accept
          </Button>
        )}
      </div>
    </div>
  )
}
