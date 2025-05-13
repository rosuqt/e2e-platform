"use client"

import { useState } from "react"
import { ChevronDown, MoreHorizontal, List, Star, Heart, Trash2 } from "lucide-react"
import { LuMessageCircleMore, LuLayoutGrid } from "react-icons/lu"
import { Button } from "@/components/ui/button"
import { Avatar, Menu, MenuItem, Collapse } from "@mui/material"
import Image from "next/image"

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
  const [isFavoritesExpanded, setIsFavoritesExpanded] = useState(true)

  const handleToggleFavorite = (employerId: string) => {
    setEmployers((prev) =>
      prev.map((employer) => (employer.id === employerId ? { ...employer, isFavorite: !employer.isFavorite } : employer)),
    )
  }

  const handleUnfollow = (employerId: string) => {
    setEmployers((prev) => prev.filter((employer) => employer.id !== employerId))
  }

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-sky-100 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Page Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 shadow-lg mb-6 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:20px_20px]"></div>
          </div>
          <h1 className="text-2xl font-bold text-white mb-1">Employers You Follow</h1>
          <p className="text-blue-100">Manage the employers you are following</p>
        </div>

        {/* Employers Section */}
        <div className="space-y-6">
          {/* Favorites Section */}
          {favoriteEmployers.length > 0 && (
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
                      {favoriteEmployers.map((employer) => (
                        <EmployerCard
                          key={employer.id}
                          employer={employer}
                          onToggleFavorite={handleToggleFavorite}
                          onUnfollow={handleUnfollow}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {favoriteEmployers.map((employer) => (
                        <EmployerListItem
                          key={employer.id}
                          employer={employer}
                          onToggleFavorite={handleToggleFavorite}
                          onUnfollow={handleUnfollow}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </Collapse>
            </div>
          )}

          {/* All Employers Section */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden border border-blue-200">
            <div className="flex justify-between items-center p-4 border-b border-blue-100">
              <h3 className="text-blue-700 font-medium">All Employers</h3>
              <Button
                variant="outline"
                size="icon"
                className="rounded-full"
                onClick={() => setIsGridView(!isGridView)}
              >
                {isGridView ? <List className="h-4 w-4" /> : <LuLayoutGrid className="h-4 w-4" />}
                <span className="sr-only">{isGridView ? "List view" : "Grid view"}</span>
              </Button>
            </div>
            <div className="p-4">
              {isGridView ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {employers.map((employer) => (
                    <EmployerCard
                      key={employer.id}
                      employer={employer}
                      onToggleFavorite={handleToggleFavorite}
                      onUnfollow={handleUnfollow}
                    />
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {employers.map((employer) => (
                    <EmployerListItem
                      key={employer.id}
                      employer={employer}
                      onToggleFavorite={handleToggleFavorite}
                      onUnfollow={handleUnfollow}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Suggested Employers Section */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden border border-blue-200">
            <div className="flex justify-between items-center p-4 border-b border-blue-100">
              <h2 className="text-blue-700 font-medium">Suggested Employers for You</h2>
              <button className="text-blue-600 font-medium hover:underline">View All</button>
            </div>

            <div className="p-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {suggestedEmployers.map((employer) => (
                  <EmployerCard
                    key={employer.id}
                    employer={employer}
                    onToggleFavorite={handleToggleFavorite}
                    onUnfollow={handleUnfollow}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

interface EmployerCardProps {
  employer: Employer
  onToggleFavorite: (id: string) => void
  onUnfollow: (id: string) => void
}

function EmployerCard({ employer, onToggleFavorite, onUnfollow }: EmployerCardProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
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
          <MenuItem onClick={() => { onToggleFavorite(employer.id); handleMenuClose(); }}>
            <Heart className="h-4 w-4 mr-2 text-red-500" />
            {employer.isFavorite ? "Unfavorite" : "Favorite"}
          </MenuItem>
          <MenuItem onClick={() => { onUnfollow(employer.id); handleMenuClose(); }}>
            <Trash2 className="h-4 w-4 mr-2 text-gray-500" />
            Unfollow
          </MenuItem>
        </Menu>
      </div>
      <div className="px-4 pt-10 pb-4 relative">
        <Avatar className="absolute -top-8 left-1/2 transform -translate-x-1/2 w-16 h-16 border-4 border-white rounded-full">
          <Image src={employer.avatar || "/placeholder.svg"} alt={employer.name} width={64} height={64} className="object-cover" />
        </Avatar>

        <div className="text-center mb-3">
          <h3 className="font-medium text-gray-900 flex items-center justify-center">
            {employer.name}
            {employer.isFavorite && <Star className="h-3 w-3 ml-1 text-yellow-500 fill-yellow-500" />}
          </h3>
          <p className="text-sm text-gray-500">
            {employer.company}
            <br />
            {employer.position}
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          className="w-full border-blue-300 text-blue-600 hover:bg-blue-50"
        >
          <LuMessageCircleMore className="h-4 w-4 mr-2" />
          Message
        </Button>
      </div>
    </div>
  )
}

function EmployerListItem({ employer, onToggleFavorite, onUnfollow }: EmployerCardProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  return (
    <div className="flex items-center justify-between border-b border-gray-100 pb-4">
      <div className="flex items-center">
        <Avatar className="h-12 w-12 mr-3">
          <Image src={employer.avatar || "/placeholder.svg"} alt={employer.name} width={48} height={48} />
        </Avatar>
        <div>
          <h3 className="font-medium text-gray-900 flex items-center">
            {employer.name}
            {employer.isFavorite && <Star className="h-3 w-3 ml-1 text-yellow-500 fill-yellow-500" />}
          </h3>
          <div className="text-sm text-gray-500">
            {employer.company}
            <br />
            {employer.position}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          className="border-blue-300 text-blue-600 hover:bg-blue-50"
        >
          <LuMessageCircleMore className="h-4 w-4 mr-2" />
          Message
        </Button>
        <button
          className="text-gray-600 hover:bg-gray-100 rounded-full p-1"
          onClick={handleMenuOpen}
        >
          <MoreHorizontal size={16} />
        </button>
        <Menu anchorEl={anchorEl} open={open} onClose={handleMenuClose}>
          <MenuItem onClick={() => { onToggleFavorite(employer.id); handleMenuClose(); }}>
            <Heart className="h-4 w-4 mr-2 text-red-500" />
            {employer.isFavorite ? "Unfavorite" : "Favorite"}
          </MenuItem>
          <MenuItem onClick={() => { onUnfollow(employer.id); handleMenuClose(); }}>
            <Trash2 className="h-4 w-4 mr-2 text-gray-500" />
            Unfollow
          </MenuItem>
        </Menu>
      </div>
    </div>
  )
}
