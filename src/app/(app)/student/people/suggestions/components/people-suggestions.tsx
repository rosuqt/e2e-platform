"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Search, ChevronDown, X, Info, Users, Building2, GraduationCap } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "./ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar } from "@mui/material"
import { BsPersonAdd } from "react-icons/bs"

export default function PeopleSuggestions() {
  const [openModal, setOpenModal] = useState<string | null>(null)
  const [connectionStates, setConnectionStates] = useState<Record<string, string>>({})
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<{
    students: Student[]
    employers: Employer[]
    companies: Company[]
  } | null>(null)
  const [searchTab, setSearchTab] = useState("students")

  const handleConnect = (id: string) => {
    setConnectionStates((prev) => ({
      ...prev,
      [id]: prev[id] === "Connected" ? "Connect" : prev[id] === "Requested" ? "Connect" : "Requested",
    }))
  }

  const handleFollow = (id: string) => {
    setConnectionStates((prev) => ({
      ...prev,
      [id]: prev[id] === "Following" ? "Follow" : "Following",
    }))
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()

    if (!searchQuery.trim()) {
      setSearchResults(null)
      return
    }

    // Mock search results
    const query = searchQuery.toLowerCase()

    const filteredStudents = getStudents(20).filter(
      (student) => student.name.toLowerCase().includes(query) || student.title.toLowerCase().includes(query),
    )

    const filteredEmployers = getEmployers(20).filter(
      (employer) => employer.name.toLowerCase().includes(query) || employer.position.toLowerCase().includes(query),
    )

    const filteredCompanies = getCompanies(20).filter(
      (company) => company.name.toLowerCase().includes(query) || company.industry.toLowerCase().includes(query),
    )

    setSearchResults({
      students: filteredStudents,
      employers: filteredEmployers,
      companies: filteredCompanies,
    })
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Search Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 shadow-lg mb-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:20px_20px]"></div>
        </div>

        <h1 className="text-2xl font-bold text-white mb-4">Find People & Companies</h1>

        <form onSubmit={handleSearch} className="relative z-10">
          <div className="relative flex">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <Input
                className="pl-10 bg-white/90 border-0 shadow-md h-12 text-base focus-visible:ring-blue-400"
                placeholder="Search for people, companies, or jobs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button type="submit" className="ml-2 bg-blue-500 hover:bg-blue-600 h-12 px-6">
              Search
            </Button>
          </div>
        </form>
      </div>

      {/* Search Results */}
      {searchResults && (
        <div className="bg-white rounded-xl shadow-md mb-6 overflow-hidden border border-blue-200">
          <div className="border-b border-blue-100 bg-gradient-to-r from-blue-50 to-blue-100">
            <div className="p-4">
              <h2 className="text-blue-700 font-medium flex items-center">
                <Search size={16} className="mr-2" />
                Search Results for {searchQuery}
              </h2>
            </div>

            <Tabs value={searchTab} onValueChange={setSearchTab} className="px-4">
              <TabsList className="bg-white/60 p-1">
                <TabsTrigger
                  value="students"
                  className="flex items-center gap-1 data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700"
                >
                  <GraduationCap size={14} />
                  Students ({searchResults.students.length})
                </TabsTrigger>
                <TabsTrigger
                  value="employers"
                  className="flex items-center gap-1 data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700"
                >
                  <Users size={14} />
                  Employers ({searchResults.employers.length})
                </TabsTrigger>
                <TabsTrigger
                  value="companies"
                  className="flex items-center gap-1 data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700"
                >
                  <Building2 size={14} />
                  Companies ({searchResults.companies.length})
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <div className="p-4">
            <TabsContent value="students" className="mt-0">
              {searchResults.students.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {searchResults.students.slice(0, 4).map((student) => (
                    <StudentCard
                      key={student.id}
                      student={student}
                      connectionState={connectionStates[student.id] || "Connect"}
                      onConnect={() => handleConnect(student.id)}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">No students found matching {searchQuery}</div>
              )}

              {searchResults.students.length > 4 && (
                <div className="text-center mt-4">
                  <Button
                    variant="outline"
                    className="text-blue-600 border-blue-200 hover:bg-blue-50"
                    onClick={() => setOpenModal("search-students")}
                  >
                    View All {searchResults.students.length} Results
                  </Button>
                </div>
              )}
            </TabsContent>

            <TabsContent value="employers" className="mt-0">
              {searchResults.employers.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {searchResults.employers.slice(0, 4).map((employer) => (
                    <EmployerCard
                      key={employer.id}
                      employer={employer}
                      connectionState={connectionStates[employer.id] || "Follow"}
                      onFollow={() => handleFollow(employer.id)}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">No employers found matching {searchQuery}</div>
              )}

              {searchResults.employers.length > 4 && (
                <div className="text-center mt-4">
                  <Button
                    variant="outline"
                    className="text-blue-600 border-blue-200 hover:bg-blue-50"
                    onClick={() => setOpenModal("search-employers")}
                  >
                    View All {searchResults.employers.length} Results
                  </Button>
                </div>
              )}
            </TabsContent>

            <TabsContent value="companies" className="mt-0">
              {searchResults.companies.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {searchResults.companies.slice(0, 4).map((company) => (
                    <CompanyCard
                      key={company.id}
                      company={company}
                      connectionState={connectionStates[company.id] || "Follow"}
                      onFollow={() => handleFollow(company.id)}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">No companies found matching {searchQuery}</div>
              )}

              {searchResults.companies.length > 4 && (
                <div className="text-center mt-4">
                  <Button
                    variant="outline"
                    className="text-blue-600 border-blue-200 hover:bg-blue-50"
                    onClick={() => setOpenModal("search-companies")}
                  >
                    View All {searchResults.companies.length} Results
                  </Button>
                </div>
              )}
            </TabsContent>
          </div>
        </div>
      )}

      {/* Students Section */}
      <SuggestionSection
        title="Students You May Recognize in Information Technology"
        type="students"
        connectionStates={connectionStates}
        onConnect={handleConnect}
        onViewAll={() => setOpenModal("students")}
      />

      {/* Employers Section */}
      <SuggestionSection
        title="Employers You May Recognize"
        type="employers"
        connectionStates={connectionStates}
        onFollow={handleFollow}
        onViewAll={() => setOpenModal("employers")}
      />

      {/* Companies Section */}
      <SuggestionSection
        title="Companies you may be interested in"
        type="companies"
        connectionStates={connectionStates}
        onFollow={handleFollow}
        onViewAll={() => setOpenModal("companies")}
      />

      {/* View All Modals */}
      <ViewAllModal
        open={openModal === "students" || openModal === "search-students"}
        onClose={() => setOpenModal(null)}
        title="Students You May Recognize in Information Technology"
        type="students"
        connectionStates={connectionStates}
        onConnect={handleConnect}
        data={openModal === "search-students" ? searchResults?.students : undefined}
        searchQuery={openModal === "search-students" ? searchQuery : undefined}
      />

      <ViewAllModal
        open={openModal === "employers" || openModal === "search-employers"}
        onClose={() => setOpenModal(null)}
        title="Employers You May Recognize"
        type="employers"
        connectionStates={connectionStates}
        onFollow={handleFollow}
        data={openModal === "search-employers" ? searchResults?.employers : undefined}
        searchQuery={openModal === "search-employers" ? searchQuery : undefined}
      />

      <ViewAllModal
        open={openModal === "companies" || openModal === "search-companies"}
        onClose={() => setOpenModal(null)}
        title="Companies you may be interested in"
        type="companies"
        connectionStates={connectionStates}
        onFollow={handleFollow}
        data={openModal === "search-companies" ? searchResults?.companies : undefined}
        searchQuery={openModal === "search-companies" ? searchQuery : undefined}
      />
    </div>
  )
}

interface SuggestionSectionProps {
  title: string
  type: "students" | "employers" | "companies"
  connectionStates: Record<string, string>
  onConnect?: (id: string) => void
  onFollow?: (id: string) => void
  onViewAll: () => void
}

function SuggestionSection({ title, type, connectionStates, onConnect, onFollow, onViewAll }: SuggestionSectionProps) {
  return (
    <div className="bg-white rounded-xl shadow-md mb-6 overflow-hidden border border-blue-200">
      <div className="flex justify-between items-center p-4 border-b border-blue-100 bg-gradient-to-r from-blue-50 to-blue-100">
        <h2 className="text-blue-700 font-medium flex items-center">
          {type === "students" && <GraduationCap size={16} className="mr-2" />}
          {type === "employers" && <Users size={16} className="mr-2" />}
          {type === "companies" && <Building2 size={16} className="mr-2" />}
          {title}
        </h2>
        <button onClick={onViewAll} className="text-blue-600 font-medium hover:underline flex items-center">
          View All
          <ChevronDown size={16} className="ml-1 transform rotate-270" />
        </button>
      </div>

      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center text-sm text-gray-600">
            Sort by
            <button className="flex items-center ml-1 text-gray-800 bg-gray-100 px-2 py-1 rounded-md">
              relevance <ChevronDown size={16} className="ml-1" />
            </button>
          </div>

          <div className="flex items-center text-sm text-blue-600">
            <Info size={14} className="mr-1" />
            {type === "students" && "People you might know from your school"}
            {type === "employers" && "People you might want to follow"}
            {type === "companies" && "Based on your interests"}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {type === "students" &&
            getStudents(4).map((student) => (
              <StudentCard
                key={student.id}
                student={student}
                connectionState={connectionStates[student.id] || "Connect"}
                onConnect={() => onConnect?.(student.id)}
              />
            ))}

          {type === "employers" &&
            getEmployers(4).map((employer) => (
              <EmployerCard
                key={employer.id}
                employer={employer}
                connectionState={connectionStates[employer.id] || "Follow"}
                onFollow={() => onFollow?.(employer.id)}
              />
            ))}

          {type === "companies" &&
            getCompanies(4).map((company) => (
              <CompanyCard
                key={company.id}
                company={company}
                connectionState={connectionStates[company.id] || "Follow"}
                onFollow={() => onFollow?.(company.id)}
              />
            ))}
        </div>
      </div>
    </div>
  )
}

interface ViewAllModalProps {
  open: boolean
  onClose: () => void
  title: string
  type: "students" | "employers" | "companies"
  connectionStates: Record<string, string>
  onConnect?: (id: string) => void
  onFollow?: (id: string) => void
  data?: Student[] | Employer[] | Company[]
  searchQuery?: string
}

function ViewAllModal({
  open,
  onClose,
  title,
  type,
  connectionStates,
  onConnect,
  onFollow,
  data,
  searchQuery,
}: ViewAllModalProps) {
  const [hasScrolled, setHasScrolled] = useState(false)
  const [localSearchQuery, setLocalSearchQuery] = useState("")
  const [filteredData, setFilteredData] = useState<Student[] | Employer[] | Company[] | null>(null)

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const bottom = e.currentTarget.scrollHeight - e.currentTarget.scrollTop === e.currentTarget.clientHeight
    if (bottom && !hasScrolled) {
      setHasScrolled(true)
    }
  }

  const handleLocalSearch = (e: React.FormEvent) => {
    e.preventDefault()

    if (!localSearchQuery.trim()) {
      setFilteredData(null)
      return
    }

    const query = localSearchQuery.toLowerCase()

    if (type === "students") {
      const filtered = getStudents(20).filter(
        (student) => student.name.toLowerCase().includes(query) || student.title.toLowerCase().includes(query),
      )
      setFilteredData(filtered)
    } else if (type === "employers") {
      const filtered = getEmployers(20).filter(
        (employer) => employer.name.toLowerCase().includes(query) || employer.position.toLowerCase().includes(query),
      )
      setFilteredData(filtered)
    } else if (type === "companies") {
      const filtered = getCompanies(20).filter(
        (company) => company.name.toLowerCase().includes(query) || company.industry.toLowerCase().includes(query),
      )
      setFilteredData(filtered)
    }
  }

  useEffect(() => {
    if (open) {
      setHasScrolled(false)
      setLocalSearchQuery(searchQuery || "")
      setFilteredData(null)
    }
  }, [open, searchQuery])

  const displayData = (): Student[] | Employer[] | Company[] => {
    if (data) return data

    if (type === "students") return getStudents(12)
    if (type === "employers") return getEmployers(12)
    if (type === "companies") return getCompanies(12)

    return []
  }

  const renderItems = () => {
    const items = displayData()

    if (items.length === 0) {
      return (
        <div className="col-span-full text-center py-10 text-gray-500">
          No results found
          {searchQuery && ` for "${searchQuery}"`}
          {localSearchQuery && filteredData && ` for "${localSearchQuery}"`}
        </div>
      )
    }

    return (
      <>
        {type === "students" &&
          (items as Student[]).map((student) => (
            <StudentCard
              key={student.id}
              student={student}
              connectionState={connectionStates[student.id] || "Connect"}
              onConnect={() => onConnect?.(student.id)}
            />
          ))}

        {type === "employers" &&
          (items as Employer[]).map((employer) => (
            <EmployerCard
              key={employer.id}
              employer={employer}
              connectionState={connectionStates[employer.id] || "Follow"}
              onFollow={() => onFollow?.(employer.id)}
            />
          ))}

        {type === "companies" &&
          (items as Company[]).map((company) => (
            <CompanyCard
              key={company.id}
              company={company}
              connectionState={connectionStates[company.id] || "Follow"}
              onFollow={() => onFollow?.(company.id)}
            />
          ))}

        {hasScrolled && <div className="col-span-full text-center py-6 text-gray-500">No more suggestions</div>}
      </>
    )
  }

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            {type === "students" && <GraduationCap size={18} className="mr-2" />}
            {type === "employers" && <Users size={18} className="mr-2" />}
            {type === "companies" && <Building2 size={18} className="mr-2" />}
            {searchQuery ? `Search Results: ${title}` : title}
            {searchQuery && <span className="ml-2 text-sm font-normal text-gray-500">for {searchQuery}</span>}
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="all" className="data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700">
              All
            </TabsTrigger>
            <TabsTrigger value="recent" className="data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700">
              Recent
            </TabsTrigger>
            <TabsTrigger value="mutual" className="data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700">
              Mutual Connections
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-0">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center text-sm text-gray-600">
                Sort by
                <button className="flex items-center ml-1 text-gray-800 bg-gray-100 px-2 py-1 rounded-md">
                  relevance <ChevronDown size={16} className="ml-1" />
                </button>
              </div>

              <form onSubmit={handleLocalSearch} className="relative flex">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                  <Input
                    className="pl-10 w-[250px] bg-gray-50 border-gray-200 text-sm"
                    placeholder={`Search ${type}...`}
                    value={localSearchQuery}
                    onChange={(e) => setLocalSearchQuery(e.target.value)}
                  />
                </div>
                <Button type="submit" size="sm" className="ml-2">
                  Search
                </Button>
              </form>
            </div>

            <div className="overflow-y-auto max-h-[50vh] pr-2" onScroll={handleScroll}>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">{renderItems()}</div>
            </div>
          </TabsContent>

          <TabsContent value="recent" className="mt-0">
            <div className="text-center py-10 text-gray-500">No recent suggestions</div>
          </TabsContent>

          <TabsContent value="mutual" className="mt-0">
            <div className="text-center py-10 text-gray-500">No mutual connections</div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}

// Card Components
interface StudentCardProps {
  student: Student
  connectionState: string
  onConnect: () => void
}

function StudentCard({ student, connectionState, onConnect }: StudentCardProps) {
  return (
    <div className="bg-white border border-blue-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-16 relative">
        <button className="absolute top-2 right-2 text-white hover:bg-white/20 rounded-full p-1">
          <X size={16} />
        </button>
      </div>
      <div className="px-4 pt-10 pb-4 relative">
        <Avatar
          src={student.avatar || "/placeholder.svg"}
          alt={student.name}
          className="absolute -top-8 left-1/2 transform -translate-x-1/2 w-16 h-16 border-4 border-white"
        >
          {student.name.charAt(0)}
        </Avatar>

        <div className="text-center mb-2">
          <h3 className="font-medium text-gray-900">{student.name}</h3>
          <p className="text-sm text-gray-500 line-clamp-1">{student.title}</p>
          <p className="text-sm text-gray-400">{student.yearAndSection}</p>
        </div>

        <div className="flex items-center justify-center mb-3">
          <div className="bg-yellow-400 text-black text-xs font-bold px-1 py-0.5 rounded mr-1 flex items-center justify-center">
            STI
          </div>
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200 text-xs">
            BS - {student.field}
          </Badge>
        </div>

        <Button
          variant={connectionState === "Connect" ? "outline" : "secondary"}
          size="sm"
          className={`w-full ${
            connectionState === "Connect"
              ? "border-blue-300 text-blue-600 hover:bg-blue-50"
              : "bg-blue-100 text-blue-700 hover:bg-blue-200 border-0"
          }`}
          onClick={onConnect}
        >
          <BsPersonAdd className="mr-1" />
          {connectionState}
        </Button>
      </div>
    </div>
  )
}

interface EmployerCardProps {
  employer: Employer
  connectionState: string
  onFollow: () => void
}

function EmployerCard({ employer, connectionState, onFollow }: EmployerCardProps) {
  return (
    <div className="bg-white border border-blue-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-16 relative">
        <button className="absolute top-2 right-2 text-white hover:bg-white/20 rounded-full p-1">
          <X size={16} />
        </button>
      </div>
      <div className="px-4 pt-10 pb-4 relative">
        <Avatar
          src={employer.avatar || "/placeholder.svg"}
          alt={employer.name}
          className="absolute -top-8 left-1/2 transform -translate-x-1/2 w-16 h-16 border-4 border-white"
        >
          {employer.name.charAt(0)}
        </Avatar>

        <div className="text-center mb-3">
          <h3 className="font-medium text-gray-900">{employer.name}</h3>
          <div className="flex items-center justify-center text-sm text-gray-600 mt-1">
            <span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-1.5"></span>
            {employer.position}
          </div>
        </div>

        <Button
          variant={connectionState === "Follow" ? "outline" : "secondary"}
          size="sm"
          className={`w-full ${
            connectionState === "Follow"
              ? "border-blue-300 text-blue-600 hover:bg-blue-50"
              : "bg-blue-100 text-blue-700 hover:bg-blue-200 border-0"
          }`}
          onClick={onFollow}
        >
          <BsPersonAdd className="mr-1" />
          {connectionState}
        </Button>
      </div>
    </div>
  )
}

interface CompanyCardProps {
  company: Company
  connectionState: string
  onFollow: () => void
}

function CompanyCard({ company, connectionState, onFollow }: CompanyCardProps) {
  return (
    <div className="bg-white border border-blue-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-16 relative">
        <button className="absolute top-2 right-2 text-white hover:bg-white/20 rounded-full p-1">
          <X size={16} />
        </button>
      </div>
      <div className="px-4 pt-10 pb-4 relative">
        <Avatar
          src={company.logo || "/placeholder.svg"}
          alt={company.name}
          className="absolute -top-8 left-1/2 transform -translate-x-1/2 w-16 h-16 border-4 border-white"
        >
          {company.name.charAt(0)}
        </Avatar>

        <div className="text-center mb-3">
          <h3 className="font-medium text-gray-900">{company.name}</h3>
          <p className="text-sm text-gray-600">{company.industry}</p>
        </div>

        <Button
          variant={connectionState === "Follow" ? "outline" : "secondary"}
          size="sm"
          className={`w-full ${
            connectionState === "Follow"
              ? "border-blue-300 text-blue-600 hover:bg-blue-50"
              : "bg-blue-100 text-blue-700 hover:bg-blue-200 border-0"
          }`}
          onClick={onFollow}
        >
          {connectionState}
        </Button>
      </div>
    </div>
  )
}

// Types and Mock Data
interface Student {
  id: string
  name: string
  title: string
  field: string
  avatar: string
  yearAndSection: string
}

interface Employer {
  id: string
  name: string
  position: string
  avatar: string
}

interface Company {
  id: string
  name: string
  industry: string
  logo: string
}

function getStudents(count: number): Student[] {
  const students = [
    {
      id: "s1",
      name: "Mark Toniel Seva",
      title: "BS - Information Technology",
      field: "Information Technology",
      avatar: "/placeholder.svg?height=100&width=100",
      yearAndSection: "4th yr - 611",
    },
    {
      id: "s2",
      name: "Vivi Anya",
      title: "BS - Computer Science",
      field: "Information Technology",
      avatar: "/placeholder.svg?height=100&width=100",
      yearAndSection: "3rd yr - 512",
    },
    {
      id: "s3",
      name: "Sigma Zeyn",
      title: "BS - Information Technology",
      field: "Information Technology",
      avatar: "/placeholder.svg?height=100&width=100",
      yearAndSection: "2nd yr - 411",
    },
    {
      id: "s4",
      name: "Ally na Minor",
      title: "BS - Data Science",
      field: "Information Technology",
      avatar: "/placeholder.svg?height=500&width=500",
      yearAndSection: "1st yr - 311",
    },
    {
      id: "s5",
      name: "Lona Brooks",
      title: "BS - Cybersecurity",
      field: "Information Technology",
      avatar: "/placeholder.svg?height=100&width=100",
      yearAndSection: "4th yr - 611",
    },
    {
      id: "s6",
      name: "Ethan Carter",
      title: "BS - Mobile Development",
      field: "Information Technology",
      avatar: "/placeholder.svg?height=100&width=100",
      yearAndSection: "3rd yr - 512",
    },
    {
      id: "s7",
      name: "Wer bangs",
      title: "BS - Network Engineering",
      field: "Information Technology",
      avatar: "/placeholder.svg?height=100&width=100",
      yearAndSection: "2nd yr - 411",
    },
    {
      id: "s8",
      name: "Kemly Rogers",
      title: "BS - Artificial Intelligence",
      field: "Computer Science",
      avatar: "/placeholder.svg?height=100&width=100",
      yearAndSection: "1st yr - 311",
    },
  ]

  const result = [...students]
  while (result.length < count) {
    const duplicates = students.map((student, index) => ({
      ...student,
      id: `s${students.length + index + 1 + result.length}`,
    }))
    result.push(...duplicates.slice(0, count - result.length))
  }

  return result.slice(0, count)
}

function getEmployers(count: number): Employer[] {
  const employers = [
    {
      id: "e1",
      name: "Mark Toniel Seva",
      position: "Cybersecurity Specialist",
      avatar: "/placeholder.svg?height=100&width=100",
    },
    {
      id: "e2",
      name: "Vivi Anya",
      position: "Cybersecurity Specialist",
      avatar: "/placeholder.svg?height=100&width=100",
    },
    {
      id: "e3",
      name: "Sigma Zeyn",
      position: "Cybersecurity Specialist",
      avatar: "/placeholder.svg?height=100&width=100",
    },
    {
      id: "e4",
      name: "Ally na Minor",
      position: "Software Test Engineer",
      avatar: "/placeholder.svg?height=100&width=100",
    },
    {
      id: "e5",
      name: "Lena Brooks",
      position: "Cybersecurity Specialist",
      avatar: "/placeholder.svg?height=100&width=100",
    },
    {
      id: "e6",
      name: "Ethan Carter",
      position: "Human Resources Manager",
      avatar: "/placeholder.svg?height=100&width=100",
    },
    {
      id: "e7",
      name: "Wer bangs",
      position: "Cybersecurity Specialist",
      avatar: "/placeholder.svg?height=100&width=100",
    },
    {
      id: "e8",
      name: "Kemly Rogers",
      position: "Cybersecurity Specialist",
      avatar: "/placeholder.svg?height=100&width=100",
    },
  ]

  const result = [...employers]
  while (result.length < count) {
    const duplicates = employers.map((employer, index) => ({
      ...employer,
      id: `e${employers.length + index + 1 + result.length}`,
    }))
    result.push(...duplicates.slice(0, count - result.length))
  }

  return result.slice(0, count)
}

function getCompanies(count: number): Company[] {
  const companies = [
    {
      id: "c1",
      name: "Nexora Technologies",
      industry: "Tech & IT",
      logo: "/placeholder.svg?height=100&width=100",
    },
    {
      id: "c2",
      name: "Visionary Ventures",
      industry: "Business & Finance",
      logo: "/placeholder.svg?height=100&width=100",
    },
    {
      id: "c3",
      name: "LuxeVoyage Travel",
      industry: "Hospitality & Tourism",
      logo: "/placeholder.svg?height=100&width=100",
    },
    {
      id: "c4",
      name: "Golden Spoon Catering",
      industry: "Food & Beverage",
      logo: "/placeholder.svg?height=100&width=100",
    },
    {
      id: "c5",
      name: "Nexora Technologies",
      industry: "Tech & IT",
      logo: "/placeholder.svg?height=100&width=100",
    },
    {
      id: "c6",
      name: "Visionary Ventures",
      industry: "Business & Finance",
      logo: "/placeholder.svg?height=100&width=100",
    },
    {
      id: "c7",
      name: "LuxeVoyage Travel",
      industry: "Hospitality & Tourism",
      logo: "/placeholder.svg?height=100&width=100",
    },
    {
      id: "c8",
      name: "Golden Spoon Catering",
      industry: "Food & Beverage",
      logo: "/placeholder.svg?height=100&width=100",
    },
  ]

  const result = [...companies]
  while (result.length < count) {
    const duplicates = companies.map((company, index) => ({
      ...company,
      id: `c${companies.length + index + 1 + result.length}`,
    }))
    result.push(...duplicates.slice(0, count - result.length))
  }

  return result.slice(0, count)
}
