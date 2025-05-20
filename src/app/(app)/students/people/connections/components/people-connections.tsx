"use client"

import { useState, useEffect } from "react"
import { ChevronDown, MoreHorizontal, Grid, List, Star, MessageSquare, X, Heart, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, Menu, MenuItem, Collapse } from "@mui/material"
import { Badge } from "./ui/badge"
import Image from "next/image"

interface FriendRequest {
  id: string
  name: string
  school: string
  program: string
  avatar: string
}

interface Friend {
  id: string
  name: string
  school: string
  program: string
  avatar: string
  isFavorite: boolean
}

interface SuggestedPerson {
  id: string
  name: string
  school: string
  program: string
  avatar: string
}

export default function ConnectionsPage() {
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([
    {
      id: "fr1",
      name: "Kemly Rose",
      school: "STI Alabang",
      program: "BSIT",
      avatar: "/placeholder.svg?height=100&width=100",
    },
    {
      id: "fr2",
      name: "Kemlerin Kemeli",
      school: "STI Alabang",
      program: "BSIT",
      avatar: "/placeholder.svg?height=100&width=100",
    },
    {
      id: "fr3",
      name: "Edrian Sevilla",
      school: "STI Alabang",
      program: "BSIT",
      avatar: "/placeholder.svg?height=100&width=100",
    },
  ])

  const [friends, setFriends] = useState<Friend[]>([
    {
      id: "f1",
      name: "Suzeyn Zeyn",
      school: "STI Alabang",
      program: "BSIT",
      avatar: "/placeholder.svg?height=100&width=100",
      isFavorite: false,
    },
    {
      id: "f2",
      name: "Zeyn Delevwa",
      school: "STI Alabang",
      program: "BSIT",
      avatar: "/placeholder.svg?height=100&width=100",
      isFavorite: false,
    },
    {
      id: "f3",
      name: "Reri Wu",
      school: "STI Alabang",
      program: "BSIT",
      avatar: "/placeholder.svg?height=100&width=100",
      isFavorite: true,
    },
    {
      id: "f4",
      name: "Jamal Janrei",
      school: "STI Alabang",
      program: "BSIT",
      avatar: "/placeholder.svg?height=100&width=100",
      isFavorite: false,
    },
    {
      id: "f5",
      name: "Valentina Valentines",
      school: "STI Alabang",
      program: "BSIT",
      avatar: "/placeholder.svg?height=100&width=100",
      isFavorite: false,
    },
  ])

  const suggestedPeople: SuggestedPerson[] = [
    {
      id: "s1",
      name: "Kemly Rose",
      school: "STI College Alabang",
      program: "BS - Information Technology",
      avatar: "/placeholder.svg?height=100&width=100",
    },
    {
      id: "s2",
      name: "Kemlerin Kemeli",
      school: "STI College Alabang",
      program: "BS - Information Technology",
      avatar: "/placeholder.svg?height=100&width=100",  
    },
    {
      id: "s3",
      name: "Edrian Sevilla",
      school: "STI College Alabang",
      program: "BS - Information Technology",
      avatar: "/placeholder.svg?height=100&width=100",
    },
    {
      id: "s4",
      name: "Suzeyn Zeyn",
      school: "STI College Alabang",
      program: "BS - Information Technology",
      avatar: "/placeholder.svg?height=100&width=100",
    },
  ]

  const [isGridView, setIsGridView] = useState(false)
  const [isFavoritesExpanded, setIsFavoritesExpanded] = useState(true)

  const handleAcceptRequest = (requestId: string) => {
    const request = friendRequests.find((req) => req.id === requestId)
    if (request) {
      setFriends((prev) => [
        ...prev,
        {
          id: `f${prev.length + 1}`,
          name: request.name,
          school: request.school,
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

  const favoritesFriends = friends.filter((friend) => friend.isFavorite)

  useEffect(() => {
    // Placeholder for any future logic
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-sky-100 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Page Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 shadow-lg mb-6 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:20px_20px]"></div>
          </div>
          <h1 className="text-2xl font-bold text-white mb-1">My Connections</h1>
          <p className="text-blue-100">Manage your network of friends and connections</p>
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
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  Sort by
                  <button className="flex items-center ml-1 text-gray-800 bg-gray-100 px-2 py-1 rounded-md">
                    newest <ChevronDown size={16} className="ml-1" />
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                {friendRequests.map((request) => (
                  <div key={request.id} className="flex items-center justify-between border-b border-gray-100 pb-4">
                    <div className="flex items-center">
                      <Avatar className="h-12 w-12 mr-3">
                        <Image src={request.avatar || "/placeholder.svg"} alt={request.name} width={48} height={48} />
                      </Avatar>
                      <div>
                        <h3 className="font-medium text-gray-900">{request.name}</h3>
                        <div className="text-sm text-gray-500">
                          {request.school}
                          <br />
                          {request.program}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        className="text-gray-600 border-gray-200 hover:bg-gray-50"
                        onClick={() => handleIgnoreRequest(request.id)}
                      >
                        Ignore
                      </Button>
                      <Button
                        className="bg-blue-500 hover:bg-blue-600 text-white"
                        onClick={() => handleAcceptRequest(request.id)}
                      >
                        Accept
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Friends Section */}
        <div className="space-y-6">
          {/* Favorites Section */}
          {favoritesFriends.length > 0 && (
            <div className="bg-white rounded-xl shadow-md overflow-hidden border border-blue-200">
              <div className="flex justify-between items-center p-4 border-b border-blue-100">
                <h3 className="text-blue-700 font-medium flex items-center">
                  <Star className="h-4 w-4 mr-1 text-yellow-500" />
                  Favorites
                </h3>
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full"
                  onClick={() => setIsFavoritesExpanded(!isFavoritesExpanded)}
                >
                  <ChevronDown
                    size={16}
                    className={`transform transition-transform ${
                      isFavoritesExpanded ? "rotate-180" : ""
                    }`}
                  />
                </Button>
              </div>
              <Collapse in={isFavoritesExpanded}>
                <div className="p-4">
                  {isGridView ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {favoritesFriends.map((friend) => (
                        <FriendCard
                          key={friend.id}
                          friend={friend}
                          onToggleFavorite={handleToggleFavorite}
                          onUnfriend={handleUnfriend}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {favoritesFriends.map((friend) => (
                        <FriendListItem
                          key={friend.id}
                          friend={friend}
                          onToggleFavorite={handleToggleFavorite}
                          onUnfriend={handleUnfriend}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </Collapse>
            </div>
          )}

          {/* All Friends Section */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden border border-blue-200">
            <div className="flex justify-between items-center p-4 border-b border-blue-100">
              <h3 className="text-blue-700 font-medium">All Friends</h3>
              <Button
                variant="outline"
                size="icon"
                className="rounded-full"
                onClick={() => setIsGridView(!isGridView)}
              >
                {isGridView ? <List className="h-4 w-4" /> : <Grid className="h-4 w-4" />}
                <span className="sr-only">{isGridView ? "List view" : "Grid view"}</span>
              </Button>
            </div>
            <div className="p-4">
              {isGridView ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {friends.map((friend) => (
                    <FriendCard
                      key={friend.id}
                      friend={friend}
                      onToggleFavorite={handleToggleFavorite}
                      onUnfriend={handleUnfriend}
                    />
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {friends.map((friend) => (
                    <FriendListItem
                      key={friend.id}
                      friend={friend}
                      onToggleFavorite={handleToggleFavorite}
                      onUnfriend={handleUnfriend}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Suggested People Section */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-blue-200">
          <div className="flex justify-between items-center p-4 border-b border-blue-100">
            <h2 className="text-blue-700 font-medium">Suggested People for you</h2>
            <button className="text-blue-600 font-medium hover:underline">View All</button>
          </div>

          <div className="p-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {suggestedPeople.map((person) => (
                <SuggestedPersonCard key={person.id} person={person} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

interface FriendCardProps {
  friend: Friend
  onToggleFavorite: (id: string) => void
  onUnfriend: (id: string) => void
}

function FriendCard({ friend, onToggleFavorite, onUnfriend }: FriendCardProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

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
          <MenuItem onClick={() => { onToggleFavorite(friend.id); handleMenuClose(); }}>
            <Heart className="h-4 w-4 mr-2 text-red-500" />
            {friend.isFavorite ? "Unfavorite" : "Favorite"}
          </MenuItem>
          <MenuItem onClick={() => { onUnfriend(friend.id); handleMenuClose(); }}>
            <Trash2 className="h-4 w-4 mr-2 text-gray-500" />
            Unfriend
          </MenuItem>
        </Menu>
      </div>
      <div className="px-4 pt-10 pb-4 relative">
        <Avatar className="absolute -top-8 left-1/2 transform -translate-x-1/2 w-16 h-16 border-4 border-white rounded-full">
          <Image src={friend.avatar || "/placeholder.svg"} alt={friend.name} width={64} height={64} className="object-cover" />
        </Avatar>

        <div className="text-center mb-3">
          <h3 className="font-medium text-gray-900 flex items-center justify-center">
            {friend.name}
            {friend.isFavorite && <Star className="h-3 w-3 ml-1 text-yellow-500 fill-yellow-500" />}
          </h3>
          <p className="text-sm text-gray-500">
            {friend.school}
            <br />
            {friend.program}
          </p>
        </div>

        <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white">
          <MessageSquare className="h-4 w-4 mr-2" />
          Message
        </Button>
      </div>
    </div>
  );
}

function FriendListItem({ friend, onToggleFavorite, onUnfriend }: FriendCardProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <div className="flex items-center justify-between border-b border-gray-100 pb-4">
      <div className="flex items-center">
        <Avatar className="h-12 w-12 mr-3">
          <Image src={friend.avatar || "/placeholder.svg"} alt={friend.name} width={48} height={48} />
        </Avatar>
        <div>
          <h3 className="font-medium text-gray-900 flex items-center">
            {friend.name}
            {friend.isFavorite && <Star className="h-3 w-3 ml-1 text-yellow-500 fill-yellow-500" />}
          </h3>
          <div className="text-sm text-gray-500">
            {friend.school}
            <br />
            {friend.program}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button className="bg-blue-500 hover:bg-blue-600 text-white">
          <MessageSquare className="h-4 w-4 mr-2" />
          Message
        </Button>
        <button
          className="text-gray-600 hover:bg-gray-100 rounded-full p-1"
          onClick={handleMenuOpen}
        >
          <MoreHorizontal size={16} />
        </button>
        <Menu anchorEl={anchorEl} open={open} onClose={handleMenuClose}>
          <MenuItem onClick={() => { onToggleFavorite(friend.id); handleMenuClose(); }}>
            <Heart className="h-4 w-4 mr-2 text-red-500" />
            {friend.isFavorite ? "Unfavorite" : "Favorite"}
          </MenuItem>
          <MenuItem onClick={() => { onUnfriend(friend.id); handleMenuClose(); }}>
            <Trash2 className="h-4 w-4 mr-2 text-gray-500" />
            Unfriend
          </MenuItem>
        </Menu>
      </div>
    </div>
  );
}

interface SuggestedPersonCardProps {
  person: SuggestedPerson
}

function SuggestedPersonCard({ person }: SuggestedPersonCardProps) {
  return (
    <div className="bg-white border border-blue-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-16 relative">
        <button className="absolute top-2 right-2 text-white hover:bg-white/20 rounded-full p-1">
          <X size={16} />
        </button>
      </div>
      <div className="px-4 pt-10 pb-4 relative">
        <Avatar className="absolute -top-8 left-1/2 transform -translate-x-1/2 w-16 h-16 border-4 border-white rounded-full">
          <Image src={person.avatar || "/placeholder.svg"} alt={person.name} width={64} height={64} className="object-cover" />
        </Avatar>

        <div className="text-center mb-2">
          <h3 className="font-medium text-gray-900">{person.name}</h3>
          <p className="text-sm text-gray-500 line-clamp-1">{person.school}</p>
        </div>

        <div className="flex items-center justify-center mb-3">
          <div className="bg-yellow-400 text-black text-xs font-bold px-1 py-0.5 rounded mr-1 flex items-center justify-center">
            STI
          </div>
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200 text-xs">
            {person.program}
          </Badge>
        </div>

        <Button variant="outline" size="sm" className="w-full border-blue-300 text-blue-600 hover:bg-blue-50">
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
          Connect
        </Button>
      </div>
    </div>
  )
}
