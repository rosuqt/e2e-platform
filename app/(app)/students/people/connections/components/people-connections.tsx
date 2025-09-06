"use client"

import { useState } from "react"
import { List, Star,  ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, FormControl, Select } from "@mui/material"
import { Badge } from "./ui/badge"
import Image from "next/image"
import SearchSection from "../../components/search-section"
import { LuLayoutGrid } from "react-icons/lu"
import { TbUserHeart } from "react-icons/tb"
import { GridStudents } from "../../components/grid view cards/grid-students"
import { ListStudents } from "../../components/list view items/list-students"

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
}

interface Friend {
  id: string
  name: string
  yearSection: string
  program: string
  avatar: string
  isFavorite: boolean
}

interface SuggestedPerson {
  id: string
  name: string
  yearSection: string
  program: string
  avatar: string
}

export default function ConnectionsPage() {
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([
    {
      id: "fr1",
      name: "Kemly Rose",
      yearSection: "3rd yr - 611",
      program: "BS - Information Technology",
      avatar: "/placeholder.svg?height=100&width=100",
    },
    {
      id: "fr2",
      name: "Kemlerin Kemeli",
      yearSection: "3rd yr - 611",
      program: "BS - Information Technology",
      avatar: "/placeholder.svg?height=100&width=100",
    },
    {
      id: "fr3",
      name: "Edrian Sevilla",
      yearSection: "3rd yr - 611",
      program: "BS - Information Technology",
      avatar: "/placeholder.svg?height=100&width=100",
    },
  ])

  const [friends, setFriends] = useState<Friend[]>([
    {
      id: "f1",
      name: "Suzeyn Zeyn",
      yearSection: "3rd yr - 611",
      program: "BS - Information Technology",
      avatar: "/placeholder.svg?height=100&width=100",
      isFavorite: true, 
    },
    {
      id: "f2",
      name: "Zeyn Delevwa",
      yearSection: "3rd yr - 611",
      program: "BS - Information Technology",
      avatar: "/placeholder.svg?height=100&width=100",
      isFavorite: false,
    },
    {
      id: "f3",
      name: "Reri Wu",
      yearSection: "3rd yr - 611",
      program: "BS - Information Technology",
      avatar: "/placeholder.svg?height=100&width=100",
      isFavorite: true, 
    },
    {
      id: "f4",
      name: "Jamal Janrei",
      yearSection: "3rd yr - 611",
      program: "BS - Information Technology",
      avatar: "/placeholder.svg?height=100&width=100",
      isFavorite: false,
    },
    {
      id: "f5",
      name: "Valentina Valentines",
      yearSection: "3rd yr - 611",
      program: "BS - Information Technology",
      avatar: "/placeholder.svg?height=100&width=100",
      isFavorite: false,
    },
  ])

  const suggestedPeople: SuggestedPerson[] = [
    {
      id: "s1",
      name: "Kemly Rose",
      yearSection: "3rd yr - 611",
      program: "BS - Information Technology",
      avatar: "/placeholder.svg?height=100&width=100",
    },
    {
      id: "s2",
      name: "Kemlerin Kemeli",
      yearSection: "3rd yr - 611",
      program: "BS - Information Technology",
      avatar: "/placeholder.svg?height=100&width=100",
    },
    {
      id: "s3",
      name: "Edrian Sevilla",
      yearSection: "3rd yr - 611",
      program: "BS - Information Technology",
      avatar: "/placeholder.svg?height=100&width=100",
    },
    {
      id: "s4",
      name: "Suzeyn Zeyn",
      yearSection: "3rd yr - 611",
      program: "BS - Information Technology",
      avatar: "/placeholder.svg?height=100&width=100",
    },
  ]

  const [isGridView, setIsGridView] = useState(false)
  const [sortBy, setSortBy] = useState<"relevant" | "alphabetical" | "date">("relevant")
  const [isFavoritesExpanded, setIsFavoritesExpanded] = useState(true)
  const [searchResults, setSearchResults] = useState<Student[] | null>(null)

  const handleAcceptRequest = (requestId: string) => {
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
        },
      ])
      setFriendRequests((prev) => prev.filter((req) => req.id !== requestId))
    }
  }

  const handleIgnoreRequest = (requestId: string) => {
    setFriendRequests((prev) => prev.filter((req) => req.id !== requestId))
  }

  const handleToggleFavorite = (friendId: string) => {
    setFriends((prev) =>
      prev.map((friend) => (friend.id === friendId ? { ...friend, isFavorite: !friend.isFavorite } : friend)),
    )
  }

  const handleUnfriend = (friendId: string) => {
    setFriends((prev) => prev.filter((friend) => friend.id !== friendId))
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
    setSearchResults(students)
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

  function mapSuggestedToStudent(person: SuggestedPerson): Student {
    return {
      id: person.id,
      name: person.name,
      title: person.program,
      field: person.program.replace(/^BS\s*-\s*/i, ""),
      avatar: person.avatar,
      yearAndSection: person.yearSection,
    }
  }

  const friendsConnectionStates = Object.fromEntries(friends.map(f => [f.id, "Connected"]))
  const favoritesConnectionStates = Object.fromEntries(favoritesFriends.map(f => [f.id, "Connected"]))

  const favoriteIds = friends.filter(f => f.isFavorite).map(f => f.id)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-sky-100 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* SearchSection */}
        <div className="pt-2 pb-1">
          <SearchSection
            title="Find your connection"
            description="View and connect with your friends and classmates across your network."
            placeholder="Search connections"
            icon={<TbUserHeart className="h-6 w-6 text-blue-300" />}
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
                  <GridStudents
                    students={searchResults}
                    connectionStates={friendsConnectionStates}
                    onConnect={() => {}}
                    showMessageForConnected
                    onToggleFavorite={handleToggleFavorite}
                    onUnfriend={handleUnfriend}
                    favoriteIds={favoriteIds}
                  />
                ) : (
                  <div className="text-center py-8 text-gray-500">No connections found</div>
                )}
              </div>
            </div>
          )}
          {/* Controls row below SearchSection */}
          <div className="flex items-center gap-4 mt-2">
            {/* Sort By Dropdown (MUI Select) */}
            <div className="flex items-center">
              <span className="mr-2 text-sm text-gray-600">Sort by</span>
              <FormControl size="small" variant="outlined">
                <Select
                  native
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value as typeof sortBy)}
                  sx={{ minWidth: 140, backgroundColor: "white" }}
                  inputProps={{ "aria-label": "Sort by" }}
                >
                  <option value="relevant">Relevant</option>
                  <option value="alphabetical">Alphabetical</option>
                  <option value="date">Date</option>
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

        {/* Friend Requests Section */}
        {friendRequests.length > 0 && (
          <div className="bg-white rounded-xl shadow-md overflow-hidden border border-blue-200">
            <div className="flex justify-between items-center p-4 border-b border-blue-100">
              <h2 className="text-blue-700 font-medium">Requests</h2>
              <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200">
                {friendRequests.length} new
              </Badge>
            </div>
            <div className="p-4">
              {isGridView ? (
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
          {favoritesFriends.length > 0 && (
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
                  {friends.length}
                </Badge>
              </h3>
            </div>
            <div className="p-4">
              {isGridView ? (
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

        {/* Suggested People Section */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-blue-200">
          <div className="flex justify-between items-center p-4 border-b border-blue-100">
            <h2 className="text-blue-700 font-medium flex items-center">
              Suggested People for you
              <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200 ml-2 text-xs">
                {suggestedPeople.length}
              </Badge>
            </h2>
            <button className="text-blue-600 font-medium hover:underline">View All</button>
          </div>
          <div className="p-4">
            <GridStudents
              students={suggestedPeople.map(mapSuggestedToStudent)}
              connectionStates={{}}
              onConnect={() => {}}
            />
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
  return (
    <div className="bg-white border border-blue-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col">
      <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-16 relative" />
      <div className="px-4 pt-10 pb-4 relative flex-1 flex flex-col">
        <Avatar className="absolute -top-8 left-1/2 transform -translate-x-1/2 w-16 h-16 border-4 border-white rounded-full">
          <Image src={request.avatar || "/placeholder.svg"} alt={request.name} width={64} height={64} className="object-cover" />
        </Avatar>
        <div className="text-center mb-2 mt-2">
          <h3 className="font-medium text-gray-900">{request.name}</h3>
          <p className="text-sm text-gray-500 line-clamp-1">{request.yearSection}</p>
        </div>
        <div className="flex items-center justify-center mb-3">
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200 text-xs">
            {request.program}
          </Badge>
        </div>
        <div className="flex gap-2 mt-auto">
          <Button
            variant="outline"
            className="flex-1 text-gray-600 border-gray-200 hover:bg-gray-50"
            onClick={() => onIgnore(request.id)}
          >
            Ignore
          </Button>
          <Button
            className="flex-1 bg-blue-500 hover:bg-blue-600 text-white"
            onClick={() => onAccept(request.id)}
          >
            Accept
          </Button>
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
  return (
    <div className="flex items-center justify-between border-b border-gray-100 pb-4">
      <div className="flex items-center">
        <Avatar className="h-12 w-12 mr-3">
          <Image src={request.avatar || "/placeholder.svg"} alt={request.name} width={48} height={48} />
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
          onClick={() => onIgnore(request.id)}
        >
          Ignore
        </Button>
        <Button
          className="bg-blue-500 hover:bg-blue-600 text-white"
          onClick={() => onAccept(request.id)}
        >
          Accept
        </Button>
      </div>
    </div>
  )
}
