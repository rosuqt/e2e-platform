"use client"

import React, { useState } from "react"
import { Avatar, FormControl, MenuItem, Select, Menu, IconButton } from "@mui/material"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Star, Search, User, MoreHorizontal, MessageSquare, UserPlus, Trash2, FilePlus, Eye } from "lucide-react"

const FOLLOWERS = [
  {
    id: "f1",
    name: "Kemly Rose",
    avatar: "/placeholder.svg?height=100&width=100",
    program: "BS - Information Technology",
    yearSection: "4th yr - 611",
    isFavorite: true,
    matchScore: 92,
  },
  {
    id: "f2",
    name: "Edrian Sevilla",
    avatar: "/placeholder.svg?height=100&width=100",
    program: "BS - Computer Science",
    yearSection: "3rd yr - 512",
    isFavorite: false,
    matchScore: 85,
  },
  {
    id: "f3",
    name: "Suzeyn Zeyn",
    avatar: "/placeholder.svg?height=100&width=100",
    program: "BS - Data Science",
    yearSection: "2nd yr - 411",
    isFavorite: false,
    matchScore: 78,
  },
  {
    id: "f4",
    name: "Reri Wu",
    avatar: "/placeholder.svg?height=100&width=100",
    program: "BS - Cybersecurity",
    yearSection: "1st yr - 311",
    isFavorite: true,
    matchScore: 88,
  },
]

export default function FollowersPage() {
  const [search, setSearch] = useState("")
  const [sortBy, setSortBy] = useState<"relevant" | "alphabetical">("relevant")
  const [followers, setFollowers] = useState(FOLLOWERS)
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null)
  const [menuFollowerId, setMenuFollowerId] = useState<string | null>(null)

  const filtered = followers
    .filter(f =>
      f.name.toLowerCase().includes(search.toLowerCase()) ||
      f.program.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === "alphabetical") return a.name.localeCompare(b.name)
      return 0
    })

  const handleToggleFavorite = (id: string) => {
    setFollowers(prev =>
      prev.map(f =>
        f.id === id ? { ...f, isFavorite: !f.isFavorite } : f
      )
    )
  }

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, id: string) => {
    setMenuAnchor(event.currentTarget)
    setMenuFollowerId(id)
  }

  const handleMenuClose = () => {
    setMenuAnchor(null)
    setMenuFollowerId(null)
  }

  const handleRemoveFollower = (id: string) => {
    setFollowers(prev => prev.filter(f => f.id !== id))
    handleMenuClose()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-sky-100 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 shadow-lg mb-6 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:20px_20px]"></div>
          </div>
          <h1 className="text-2xl font-bold text-white mb-1 flex items-center gap-2">
            <User className="h-6 w-6" /> Followers
          </h1>
          <p className="text-blue-100">View and manage your followers</p>
        </div>
        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-blue-200 p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-3 flex-1">
            <div className="relative w-full max-w-xs">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search followers..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-8 pr-2 py-2 border border-gray-200 rounded-md w-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
              />
            </div>
            <FormControl size="small" variant="outlined">
              <Select
                value={sortBy}
                onChange={e => setSortBy(e.target.value as typeof sortBy)}
                sx={{ minWidth: 140, backgroundColor: "white" }}
              >
                <MenuItem value="relevant">Relevant</MenuItem>
                <MenuItem value="alphabetical">Alphabetical</MenuItem>
              </Select>
            </FormControl>
          </div>
          <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200">
            {filtered.length} followers
          </Badge>
        </div>
        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-blue-200">
          <div className="divide-y">
            {filtered.length === 0 && (
              <div className="text-center text-gray-400 py-12">No followers found</div>
            )}
            {filtered.map(f => (
              <div key={f.id} className="flex items-center justify-between px-6 py-4 hover:bg-blue-50 transition relative">
                <div className="flex items-center gap-4">
                  <Avatar src={f.avatar} sx={{ width: 48, height: 48 }} />
                  <div>
                    <div className="font-medium text-gray-900 flex items-center">
                      {f.name}
                      {f.isFavorite && <Star className="h-4 w-4 ml-1 text-yellow-500 fill-yellow-500" />}
                    </div>
                    <div className="text-sm text-gray-500">{f.program}</div>
                    <div className="text-xs text-gray-400">{f.yearSection}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className="bg-green-100 text-green-700 font-semibold text-xs px-2 py-0.5 rounded">
                    {f.matchScore}% Match
                  </Badge>
                  <Button
                    variant="outline"
                    size="icon"
                    className={`rounded-full border-gray-200 ${f.isFavorite ? "bg-yellow-50" : ""}`}
                    onClick={() => handleToggleFavorite(f.id)}
                  >
                    <Star className={`h-4 w-4 ${f.isFavorite ? "text-yellow-500 fill-yellow-500" : "text-gray-400"}`} />
                  </Button>
                  <IconButton
                    size="small"
                    onClick={e => handleMenuOpen(e, f.id)}
                    className="ml-1"
                  >
                    <MoreHorizontal className="h-5 w-5 text-gray-500" />
                  </IconButton>
                  <Menu
                    anchorEl={menuAnchor}
                    open={menuFollowerId === f.id}
                    onClose={handleMenuClose}
                    anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                    transformOrigin={{ vertical: "top", horizontal: "right" }}
                  >
                    <MenuItem onClick={handleMenuClose}>
                      <FilePlus className="h-4 w-4 mr-2 text-blue-500" />
                      Save Candidate
                    </MenuItem>
                    <MenuItem onClick={handleMenuClose}>
                      <UserPlus className="h-4 w-4 mr-2 text-green-500" />
                      Invite Candidate
                    </MenuItem>
                    <MenuItem onClick={handleMenuClose}>
                      <MessageSquare className="h-4 w-4 mr-2 text-blue-500" />
                      Message Candidate
                    </MenuItem>
                    <MenuItem onClick={() => handleRemoveFollower(f.id)}>
                      <Trash2 className="h-4 w-4 mr-2 text-red-500" />
                      Remove Follower
                    </MenuItem>
                    <MenuItem onClick={handleMenuClose}>
                      <Eye className="h-4 w-4 mr-2 text-gray-600" />
                      View Profile
                    </MenuItem>
                  </Menu>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
