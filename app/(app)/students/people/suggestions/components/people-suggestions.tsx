"use client"

import type React from "react"

import { useState } from "react"
import { Search, ChevronDown, Info, Users, Building2, GraduationCap } from "lucide-react"
import { TbUserStar } from "react-icons/tb"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import SearchSection from "../../components/search-section"
import { GridStudents } from "../../components/grid view cards/grid-students"
import { GridEmployer } from "../../components/grid view cards/grid-employer"
import { GridCompanies } from "../../components/grid view cards/grid-companies"

export default function PeopleSuggestions() {
  const [openModal, setOpenModal] = useState<string | null>(null)
  const [connectionStates, setConnectionStates] = useState<Record<string, string>>({})
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

  const handleSearch = (params: { firstName: string; lastName: string }) => {
    const { firstName, lastName } = params
    const filterByName = (name: string) =>
      (!firstName && !lastName) ||
      (firstName && name.toLowerCase().includes(firstName.toLowerCase())) ||
      (lastName && name.toLowerCase().includes(lastName.toLowerCase()))

    const students = getStudents(100).filter(s => filterByName(s.name))
    const employers = getEmployers(100).filter(e => filterByName(e.name))
    const companies = getCompanies(100).filter(c => filterByName(c.name))

    setSearchResults({
      students,
      employers,
      companies,
    })
    setSearchTab("students")
  }

  const handleCloseSearchResults = () => setSearchResults(null)

  return (
    <div className="max-w-6xl mx-auto">
      {/* Search Header */}
      <SearchSection
        icon={<TbUserStar className="h-6 w-6 text-blue-300"/>}
        title="Find People & Companies"
        description="Explore students, employers, and companies. Find people you may know or want to connect with!"
        placeholder="Search by name"
        onSearch={handleSearch}
      />

      {/* Search Results Section */}
      {searchResults && (
        <div className="bg-white rounded-xl shadow-md mb-6 overflow-hidden border border-blue-200">
          <div className="border-b border-blue-100 bg-gradient-to-r from-blue-50 to-blue-100 flex justify-between items-center">
            <div className="p-4">
              <h2 className="text-blue-700 font-medium flex items-center">
                <Search size={16} className="mr-2" />
                Search Results
              </h2>
            </div>
            {/* Close button */}
            <button
              className="text-blue-600 font-medium hover:underline px-4"
              onClick={handleCloseSearchResults}
              aria-label="Close search results"
            >
              Close
            </button>
          </div>
          <div className="p-4">
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
              <div className="p-4">
                <TabsContent value="students" className="mt-0">
                  {searchResults.students.length > 0 ? (
                    <GridStudents
                      students={searchResults.students.slice(0, 4)}
                      connectionStates={connectionStates}
                      onConnect={handleConnect}
                    />
                  ) : (
                    <div className="text-center py-8 text-gray-500">No students found</div>
                  )}
                  {searchResults.students.length > 4 && (
                    <div className="text-center mt-4">
                      <Button
                        variant="outline"
                        className="text-blue-600 border-blue-200 hover:bg-blue-50 rounded-full"
                        onClick={() => setOpenModal("search-students")}
                      >
                        View All {searchResults.students.length} Results
                      </Button>
                    </div>
                  )}
                </TabsContent>
                <TabsContent value="employers" className="mt-0">
                  {searchResults.employers.length > 0 ? (
                    <GridEmployer
                      employers={searchResults.employers.slice(0, 4)}
                      connectionStates={connectionStates}
                      onConnect={handleFollow}
                    />
                  ) : (
                    <div className="text-center py-8 text-gray-500">No employers found</div>
                  )}
                  {searchResults.employers.length > 4 && (
                    <div className="text-center mt-4">
                      <Button
                        variant="outline"
                        className="text-blue-600 border-blue-200 hover:bg-blue-50 rounded-full"
                        onClick={() => setOpenModal("search-employers")}
                      >
                        View All {searchResults.employers.length} Results
                      </Button>
                    </div>
                  )}
                </TabsContent>
                <TabsContent value="companies" className="mt-0">
                  {searchResults.companies.length > 0 ? (
                    <GridCompanies
                      companies={searchResults.companies.slice(0, 4).map(c => ({
                        id: c.id,
                        name: c.name,
                        industry: c.industry,
                        location: c.location,
                        avatar: c.logo,
                      }))}
                      connectionStates={connectionStates}
                      onConnect={handleFollow}
                    />
                  ) : (
                    <div className="text-center py-8 text-gray-500">No companies found</div>
                  )}
                  {searchResults.companies.length > 4 && (
                    <div className="text-center mt-4">
                      <Button
                        variant="outline"
                        className="text-blue-600 border-blue-200 hover:bg-blue-50 rounded-full"
                        onClick={() => setOpenModal("search-companies")}
                      >
                        View All {searchResults.companies.length} Results
                      </Button>
                    </div>
                  )}
                </TabsContent>
              </div>
            </Tabs>
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
      />

      <ViewAllModal
        open={openModal === "employers" || openModal === "search-employers"}
        onClose={() => setOpenModal(null)}
        title="Employers You May Recognize"
        type="employers"
        connectionStates={connectionStates}
        onFollow={handleFollow}
        data={openModal === "search-employers" ? searchResults?.employers : undefined}
      />

      <ViewAllModal
        open={openModal === "companies" || openModal === "search-companies"}
        onClose={() => setOpenModal(null)}
        title="Companies you may be interested in"
        type="companies"
        connectionStates={connectionStates}
        onFollow={handleFollow}
        data={openModal === "search-companies" ? searchResults?.companies : undefined}
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

        {type === "students" && (
          <GridStudents
            students={getStudents(4)}
            connectionStates={connectionStates}
            onConnect={onConnect!}
          />
        )}

        {type === "employers" && (
          <GridEmployer
            employers={getEmployers(4)}
            connectionStates={connectionStates}
            onConnect={onFollow!}
          />
        )}

        {type === "companies" && (
          <GridCompanies
            companies={getCompanies(4).map(c => ({
              id: c.id,
              name: c.name,
              industry: c.industry,
              location: c.location, 
              avatar: c.logo,     
            }))}
            connectionStates={connectionStates}
            onConnect={onFollow!}
          />
        )}
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
}: ViewAllModalProps) {
  const [hasScrolled, setHasScrolled] = useState(false)

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const bottom = e.currentTarget.scrollHeight - e.currentTarget.scrollTop === e.currentTarget.clientHeight
    if (bottom && !hasScrolled) {
      setHasScrolled(true)
    }
  }

  const displayData = (): Student[] | Employer[] | Company[] => {
    if (data) return data

    if (type === "students") return getStudents(12)
    if (type === "employers") return getEmployers(12)
    if (type === "companies") return getCompanies(12)

    return []
  }

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            {type === "students" && <GraduationCap size={18} className="mr-2" />}
            {type === "employers" && <Users size={18} className="mr-2" />}
            {type === "companies" && <Building2 size={18} className="mr-2" />}
            {title}
          </DialogTitle>
        </DialogHeader>

        {/* Removed Tabs and show only the main content */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center text-sm text-gray-600">
            Sort by
            <button className="flex items-center ml-1 text-gray-800 bg-gray-100 px-2 py-1 rounded-md">
              relevance <ChevronDown size={16} className="ml-1" />
            </button>
          </div>
        </div>

        <div className="overflow-y-auto max-h-[50vh] pr-2" onScroll={handleScroll}>
          {/* Responsive grid with min-w for cards */}
          <div
            className="grid gap-4"
            style={{
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))"
            }}
          >
            {/* Use grid components for each type */}
            {(() => {
              const items = displayData()
              if (items.length === 0) {
                return (
                  <div className="col-span-full text-center py-10 text-gray-500">
                    No results found
                  </div>
                )
              }
              if (type === "students") {
                return (
                  <GridStudents
                    students={items as Student[]}
                    connectionStates={connectionStates}
                    onConnect={onConnect!}
                  />
                )
              }
              if (type === "employers") {
                return (
                  <GridEmployer
                    employers={items as Employer[]}
                    connectionStates={connectionStates}
                    onConnect={onFollow!}
                  />
                )
              }
              // companies
              return (
                <GridCompanies
                  companies={(items as Company[]).map(c => ({
                    id: c.id,
                    name: c.name,
                    industry: c.industry,
                    location: c.location,
                    avatar: c.logo,
                  }))}
                  connectionStates={connectionStates}
                  onConnect={onFollow!}
                />
              )
            })()}
            {hasScrolled && (
              <div className="col-span-full text-center py-6 text-gray-500">No more suggestions</div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
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
  company: string
  job_title: string
  avatar: string
}

interface Company {
  id: string
  name: string
  industry: string
  logo: string
  location: string
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
      company: "Nexora Technologies",
      job_title: "Cybersecurity Specialist",
      avatar: "/placeholder.svg?height=100&width=100",
    },
    {
      id: "e2",
      name: "Vivi Anya",
      company: "Visionary Ventures",
      job_title: "Cybersecurity Specialist",
      avatar: "/placeholder.svg?height=100&width=100",
    },
    {
      id: "e3",
      name: "Sigma Zeyn",
      company: "LuxeVoyage Travel",
      job_title: "Cybersecurity Specialist",
      avatar: "/placeholder.svg?height=100&width=100",
    },
    {
      id: "e4",
      name: "Ally na Minor",
      company: "Golden Spoon Catering",
      job_title: "Software Test Engineer",
      avatar: "/placeholder.svg?height=100&width=100",
    },
    {
      id: "e5",
      name: "Lena Brooks",
      company: "Nexora Technologies",
      job_title: "Cybersecurity Specialist",
      avatar: "/placeholder.svg?height=100&width=100",
    },
    {
      id: "e6",
      name: "Ethan Carter",
      company: "Visionary Ventures",
      job_title: "Human Resources Manager",
      avatar: "/placeholder.svg?height=100&width=100",
    },
    {
      id: "e7",
      name: "Wer bangs",
      company: "LuxeVoyage Travel",
      job_title: "Cybersecurity Specialist",
      avatar: "/placeholder.svg?height=100&width=100",
    },
    {
      id: "e8",
      name: "Kemly Rogers",
      company: "Golden Spoon Catering",
      job_title: "Cybersecurity Specialist",
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
      location: "Alabang",
      logo: "/placeholder.svg?height=100&width=100",
    },
    {
      id: "c2",
      name: "Visionary Ventures",
      industry: "Business & Finance",
      location: "Makati",
      logo: "/placeholder.svg?height=100&width=100",
    },
    {
      id: "c3",
      name: "LuxeVoyage Travel",
      industry: "Hospitality & Tourism",
      location: "Pasay",
      logo: "/placeholder.svg?height=100&width=100",
    },
    {
      id: "c4",
      name: "Golden Spoon Catering",
      location: "San Juan",
      industry: "Food & Beverage",
      logo: "/placeholder.svg?height=100&width=100",
    },
    {
      id: "c5",
      name: "Nexora Technologies",
      location: "Alabang",
      industry: "Tech & IT",
      logo: "/placeholder.svg?height=100&width=100",
    },
    {
      id: "c6",
      name: "Visionary Ventures",
      industry: "Business & Finance",
      location: "Makati",
      logo: "/placeholder.svg?height=100&width=100",
    },
    {
      id: "c7",
      name: "LuxeVoyage Travel",
      industry: "Hospitality & Tourism",
      location: "Pasay",
      logo: "/placeholder.svg?height=100&width=100",
    },
    {
      id: "c8",
      name: "Golden Spoon Catering",
      industry: "Food & Beverage",
      location: "San Juan",
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
