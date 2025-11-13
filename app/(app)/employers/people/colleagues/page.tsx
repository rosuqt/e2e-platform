"use client"

import React from "react"

import { useState } from "react"
import {
  MoreHorizontal,
  List,
  Star,
  Heart,
  Mail,
  Briefcase,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, Menu, MenuItem, Select, FormControl } from "@mui/material"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import SearchSection from "../../../students/jobs/job-listings/components/search-section"
import { LuLayoutGrid } from "react-icons/lu";
import { MdManageAccounts } from "react-icons/md";
import { TbHierarchy } from "react-icons/tb"

interface Colleague {
  id: string
  name: string
  department: string
  position: string
  avatar: string
  isFavorite: boolean
}

interface NewEmployee {
  id: string
  name: string
  department: string
  position: string
  avatar: string
  startDate: string
}

export default function ColleaguesPage() {
  const [newEmployees, setNewEmployees] = useState<NewEmployee[]>([
    {
      id: "ne1",
      name: "Alex Morgan",
      department: "Engineering",
      position: "Frontend Developer",
      avatar: "/placeholder.svg?height=100&width=100",
      startDate: "May 10, 2025",
    },
    {
      id: "ne2",
      name: "Jamie Chen",
      department: "Marketing",
      position: "Content Strategist",
      avatar: "/placeholder.svg?height=100&width=100",
      startDate: "May 12, 2025",
    },
    {
      id: "ne3",
      name: "Taylor Wilson",
      department: "Product",
      position: "UX Designer",
      avatar: "/placeholder.svg?height=100&width=100",
      startDate: "May 15, 2025",
    },
  ])

  const [colleagues, setColleagues] = useState<Colleague[]>([
    {
      id: "c1",
      name: "Jordan Smith",
      department: "Engineering",
      position: "Senior Developer",
      avatar: "/placeholder.svg?height=100&width=100",
      isFavorite: true,
    },
    {
      id: "c2",
      name: "Casey Johnson",
      department: "Engineering",
      position: "DevOps Engineer",
      avatar: "/placeholder.svg?height=100&width=100",
      isFavorite: false,
    },
    {
      id: "c3",
      name: "Riley Brown",
      department: "Product",
      position: "Product Manager",
      avatar: "/placeholder.svg?height=100&width=100",
      isFavorite: true,
    },
    {
      id: "c4",
      name: "Morgan Lee",
      department: "Design",
      position: "UI Designer",
      avatar: "/placeholder.svg?height=100&width=100",
      isFavorite: false,
    },
    {
      id: "c5",
      name: "Quinn Taylor",
      department: "Marketing",
      position: "Marketing Manager",
      avatar: "/placeholder.svg?height=100&width=100",
      isFavorite: false,
    },
  ])

  const [isGridView, setIsGridView] = useState(false)
  const [sortBy, setSortBy] = useState<"relevant" | "alphabetical" | "date" | "role"| "branch">("relevant")

  const handleWelcomeEmployee = (employeeId: string) => {
    const employee = newEmployees.find((emp) => emp.id === employeeId)
    if (employee) {
      setColleagues((prev) => [
        ...prev,
        {
          id: `c${prev.length + 1}`,
          name: employee.name,
          department: employee.department,
          position: employee.position,
          avatar: employee.avatar,
          isFavorite: false,
        },
      ])
      setNewEmployees((prev) => prev.filter((emp) => emp.id !== employeeId))
    }
  }

  const handleDismissEmployee = (employeeId: string) => {
    setNewEmployees((prev) => prev.filter((emp) => emp.id !== employeeId))
  }

  const handleToggleFavorite = (colleagueId: string) => {
    setColleagues((prev) =>
      prev.map((colleague) =>
        colleague.id === colleagueId ? { ...colleague, isFavorite: !colleague.isFavorite } : colleague,
      ),
    )
  }

  function isMainAdmin(colleague: Colleague) {
    return colleague.id === "c1"
  }
  function isAdmin(colleague: Colleague) {
    return colleague.id === "c2"
  }

  const branchColleagues = colleagues.filter(
    (colleague) => !isMainAdmin(colleague) && !isAdmin(colleague)
  )
  const adminColleagues = colleagues.filter(
    (colleague) => isMainAdmin(colleague) || isAdmin(colleague)
  )
  const favoriteColleagues = colleagues.filter(
    (colleague) => colleague.isFavorite
  )

  function sortColleagues<T extends { name: string; department: string; position: string; startDate?: string }>(arr: T[]) {
    if (sortBy === "alphabetical") {
      return [...arr].sort((a, b) => a.name.localeCompare(b.name))
    }
    if (sortBy === "date") {
      return [...arr].sort((a, b) => {
        if (a.startDate && b.startDate) {
          return new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
        }
        return a.name.localeCompare(b.name)
      })
    }
    return arr
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-sky-100 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* SearchSection */}
        <div className="pt-2 pb-1">
          <SearchSection
            title="Find your colleague"
            description="View and connect with your colleagues across departments and teams."
  
            icon={<TbHierarchy className="h-6 w-6 text-blue-300" />}
          />
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
                  <MenuItem value="date">Date</MenuItem>
                  <MenuItem value="role">Role</MenuItem>
                  <MenuItem value="branch">Date</MenuItem>
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

        {/* Employees Section */}
        {newEmployees.length > 0 && (
          <div className="bg-white rounded-xl shadow-md overflow-hidden border border-blue-200">
            <div className="flex justify-between items-center p-4 border-b border-blue-100">
              <h2 className="text-blue-700 font-medium flex items-center gap-2">
                New Team Members
                <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200">
                  {newEmployees.length} new
                </Badge>
              </h2>
            </div>
            <div className="p-4">
              {isGridView ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {sortColleagues(newEmployees).map((employee) => (
                    <ColleagueCard
                      key={employee.id}
                      colleague={{
                        id: employee.id,
                        name: employee.name,
                        department: employee.department,
                        position: employee.position,
                        avatar: employee.avatar,
                        isFavorite: false,
                      }}
                      onToggleFavorite={() => {}}
                    />
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {sortColleagues(newEmployees).map((employee) => (
                    <div key={employee.id} className="flex items-center justify-between border-b border-gray-100 pb-4">
                      <div className="flex items-center">
                        <Avatar className="h-12 w-12 mr-3">
                          <Image src={employee.avatar || "/placeholder.svg"} alt={employee.name} width={48} height={48} />
                        </Avatar>
                        <div>
                          <h3 className="font-medium text-gray-900">{employee.name}</h3>
                          <div className="text-sm text-gray-500">
                            {employee.department}
                            <br />
                            {employee.position} • Starting {employee.startDate}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          className="text-gray-600 border-gray-200 hover:bg-gray-50"
                          onClick={() => handleDismissEmployee(employee.id)}
                        >
                          Dismiss
                        </Button>
                        <Button
                          className="bg-blue-500 hover:bg-blue-600 text-white"
                          onClick={() => handleWelcomeEmployee(employee.id)}
                        >
                          Welcome
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Admins Section */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-blue-200">
          <div className="flex justify-between items-center p-4 border-b border-blue-100">
            <h3 className="text-blue-700 font-medium flex items-center gap-2">
              Admins
              <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200">
                {adminColleagues.length}
              </Badge>
            </h3>
          </div>
          <div className="p-4">
            {isGridView ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {sortColleagues(adminColleagues).map((colleague) => (
                  <ColleagueCard
                    key={colleague.id}
                    colleague={colleague}
                    onToggleFavorite={handleToggleFavorite}
                  />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {sortColleagues(adminColleagues).map((colleague) => (
                  <ColleagueListItem
                    key={colleague.id}
                    colleague={colleague}
                    onToggleFavorite={handleToggleFavorite}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Branch Colleagues Section */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-blue-200">
          <div className="flex justify-between items-center p-4 border-b border-blue-100">
            <h3 className="text-blue-700 font-medium flex items-center gap-2">
              Your Branch Colleagues
              <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200">
                {branchColleagues.length}
              </Badge>
            </h3>
          </div>
          <div className="p-4">
            {isGridView ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {sortColleagues(branchColleagues).map((colleague) => (
                  <ColleagueCard
                    key={colleague.id}
                    colleague={colleague}
                    onToggleFavorite={handleToggleFavorite}
                  />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {sortColleagues(branchColleagues).map((colleague) => (
                  <ColleagueListItem
                    key={colleague.id}
                    colleague={colleague}
                    onToggleFavorite={handleToggleFavorite}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Favorites Section */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-blue-200">
          <div className="flex justify-between items-center p-4 border-b border-blue-100">
            <h3 className="text-blue-700 font-medium flex items-center gap-2">
              <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
              Favorites
              <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200">
                {favoriteColleagues.length}
              </Badge>
            </h3>
          </div>
          <div className="p-4">
            {isGridView ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {sortColleagues(favoriteColleagues).map((colleague) => (
                  <ColleagueCard
                    key={colleague.id}
                    colleague={colleague}
                    onToggleFavorite={handleToggleFavorite}
                  />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {sortColleagues(favoriteColleagues).map((colleague) => (
                  <ColleagueListItem
                    key={colleague.id}
                    colleague={colleague}
                    onToggleFavorite={handleToggleFavorite}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* All Colleagues Section */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-blue-200">
          <div className="flex justify-between items-center p-4 border-b border-blue-100">
            <h3 className="text-blue-700 font-medium flex items-center gap-2">
              All Colleagues
              <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200">
                {colleagues.length}
              </Badge>
            </h3>
          </div>
          <div className="p-4">
            {isGridView ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {sortColleagues(colleagues).map((colleague) => (
                  <ColleagueCard
                    key={colleague.id}
                    colleague={colleague}
                    onToggleFavorite={handleToggleFavorite}
                  />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {sortColleagues(colleagues).map((colleague) => (
                  <ColleagueListItem
                    key={colleague.id}
                    colleague={colleague}
                    onToggleFavorite={handleToggleFavorite}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

interface ColleagueCardProps {
  colleague: Colleague
  onToggleFavorite: (id: string) => void
}

function ColleagueCard({ colleague, onToggleFavorite }: ColleagueCardProps) {
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
          className="absolute t op-2 right-2 text-white hover:bg-white/20 rounded-full p-1"
          onClick={handleMenuOpen}
        >
          <MoreHorizontal size={16} />
        </button>
        <Menu anchorEl={anchorEl} open={open} onClose={handleMenuClose}>
          <MenuItem
            onClick={() => {
              onToggleFavorite(colleague.id)
              handleMenuClose()
            }}
          >
            <Heart className="h-4 w-4 mr-2 text-red-500" />
            {colleague.isFavorite ? "Remove from Favorites" : "Add to Favorites"}
          </MenuItem>
          <MenuItem
            onClick={() => {
              handleMenuClose()
            }}
          >
            <Mail className="h-4 w-4 mr-2 text-blue-500" />
            Message
          </MenuItem>
        </Menu>
      </div>
      <div className="px-4 pt-10 pb-4 relative">
        <Avatar className="absolute -top-8 left-1/2 transform -translate-x-1/2 w-96 h-96 border-4 border-white rounded-full text-2xl">
          <Image
            src={colleague.avatar || "/placeholder.svg"}
            alt={colleague.name}
            width={64}
            height={64}
            className="object-cover"
          />
        </Avatar>

        <div className="text-center mb-2">
          <h3 className="font-medium text-gray-900 flex items-center justify-center">
            {colleague.name}
            {colleague.isFavorite && <Star className="h-3 w-3 ml-1 text-yellow-500 fill-yellow-500" />}
          </h3>
          <p className="text-sm text-gray-500 line-clamp-1">
            TechCorp Inc. (Branch Name)
          </p>
        </div>

        <div className="flex items-center justify-center mb-3">
          <div className="bg-blue-400 text-white text-xs font-bold px-1 py-0.5 rounded mr-1 flex items-center justify-center">
            <Briefcase className="h-3 w-3 mr-1" />
          </div>
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 text-xs">
            {colleague.position}
          </Badge>
        </div>

        <div className="text-xs text-center text-gray-500 mb-3">
          {colleague.id === "c1"
            ? "Main Admin"
            : colleague.id === "c2"
            ? "Admin"
            : "Employee"}
        </div>

        <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white ">
          <MdManageAccounts  className="h-4 w-4" />
          Member Settings
        </Button>
      </div>
    </div>
  )
}

function ColleagueListItem({ colleague, onToggleFavorite }: ColleagueCardProps) {
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
          <Image src={colleague.avatar || "/placeholder.svg"} alt={colleague.name} width={48} height={48} />
        </Avatar>
        <div>
          <h3 className="font-medium text-gray-900 flex items-center">
            {colleague.name}
            {colleague.isFavorite && <Star className="h-3 w-3 ml-1 text-yellow-500 fill-yellow-500" />}
          </h3>
          <div className="text-sm text-gray-500">
            {colleague.position}
            <br />
            TechCorp Inc. (Branch Name)
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button className="bg-blue-500 hover:bg-blue-600 text-white ">
          <MdManageAccounts  className="h-4 w-4" />
          Member Settings
        </Button>
        <button className="text-gray-600 hover:bg-gray-100 rounded-full p-1" onClick={handleMenuOpen}>
          <MoreHorizontal size={16} />
        </button>
        <Menu anchorEl={anchorEl} open={open} onClose={handleMenuClose}>
          <MenuItem
            onClick={() => {
              onToggleFavorite(colleague.id)
              handleMenuClose()
            }}
          >
            <Heart className="h-4 w-4 mr-2 text-red-500" />
            {colleague.isFavorite ? "Remove from Favorites" : "Add to Favorites"}
          </MenuItem>
          <MenuItem
            onClick={() => {
              handleMenuClose()
            }}
          >
            <Mail className="h-4 w-4 mr-2 text-blue-500" />
            Message
          </MenuItem>
        </Menu>
      </div>
    </div>
  )
}
