"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Search, ChevronDown, Info, Users, Building2, GraduationCap } from "lucide-react"
import { TbUserStar } from "react-icons/tb"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useSession } from "next-auth/react"
import { Tooltip } from "@mui/material"

import SearchSection from "../../components/search-section"
import { GridStudents } from "../../components/grid view cards/grid-students"
import { GridEmployer } from "../../components/grid view cards/grid-employer"
import { GridCompanies } from "../../components/grid view cards/grid-companies"

type ApiCompany = {
  id: string
  company_name: string
  company_industry: string
  address?: string
  logoUrl?: string
}

export default function PeopleSuggestions() {
  const [openModal, setOpenModal] = useState<string | null>(null)
  const [connectionStates, setConnectionStates] = useState<Record<string, string>>({})
  const [searchResults, setSearchResults] = useState<{
    students: Student[]
    employers: Employer[]
    companies: Company[]
  } | null>(null)
  const [searchTab, setSearchTab] = useState("students")
  const [suggestedStudents, setSuggestedStudents] = useState<Student[]>([])
  const [loadingSuggestions, setLoadingSuggestions] = useState(false)
  const [suggestedEmployers, setSuggestedEmployers] = useState<Employer[]>([])
  const [loadingEmployerSuggestions, setLoadingEmployerSuggestions] = useState(false)
  const [suggestedCompanies, setSuggestedCompanies] = useState<Company[]>([])
  const [loadingCompanySuggestions, setLoadingCompanySuggestions] = useState(false)
  const { data: session } = useSession()
  const currentStudentId = session?.user?.studentId ?? ""

  useEffect(() => {
    async function fetchSuggestions() {
      if (!currentStudentId) return
      setLoadingSuggestions(true)
      const res = await fetch("/api/students/people/suggestions/students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: currentStudentId }),
      })
      const { students } = await res.json()
      const mapped = await Promise.all(
        (students as StudentApiRow[]).map(async s => {
          let avatar = "/placeholder.svg?height=100&width=100"
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
            title: s.course?.replace(/^BS\s*-\s*/i, "") ?? "",
            field: s.course?.replace(/^BS\s*-\s*/i, "") ?? "",
            avatar,
            cover,
            yearAndSection: `${s.year ?? ""} - ${s.section ?? ""}`,
          }
        })
      )
      setSuggestedStudents(mapped)

      const states: Record<string, string> = {}
      await Promise.all(
        mapped.map(async student => {
          if (student.id === currentStudentId) return
          try {
            const statusRes = await fetch(`/api/students/people/suggestions/students?senderId=${currentStudentId}&receiverId=${student.id}`)
            const statusData = await statusRes.json()
            if (statusData.status === "Requested") {
              states[student.id] = "Requested"
            } else {
              states[student.id] = "Connect"
            }
          } catch {
            states[student.id] = "Connect"
          }
        })
      )
      setConnectionStates(prev => ({ ...prev, ...states }))
      setLoadingSuggestions(false)
    }
    fetchSuggestions()
  }, [currentStudentId])

  useEffect(() => {
    async function fetchEmployerSuggestions() {
      setLoadingEmployerSuggestions(true)
      const res = await fetch("/api/students/people/suggestions/employers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      })
      const { employers } = await res.json()
      const mapped = (employers as {
        id: string
        first_name: string | null
        last_name: string | null
        company_name: string | null
        job_title: string | null
        user_id: string | null
        avatar: string
        cover?: string
      }[]).map(e => ({
        id: e.id,
        name: `${e.first_name ?? ""} ${e.last_name ?? ""}`.trim(),
        company: e.company_name ?? "",
        job_title: e.job_title ?? "",
        avatar: e.avatar || "/placeholder.svg?height=100&width=100",
        cover: e.cover ?? "",
      }))
      setSuggestedEmployers(mapped)

      const states: Record<string, string> = {}
      await Promise.all(
        mapped.map(async employer => {
          try {
            const statusRes = await fetch(`/api/students/people/suggestions/employers?employerId=${employer.id}`)
            const statusData = await statusRes.json()
            if (statusData.status === "Following") {
              states[employer.id] = "Following"
            } else {
              states[employer.id] = "Follow"
            }
          } catch {
            states[employer.id] = "Follow"
          }
        })
      )
      setConnectionStates(prev => ({ ...prev, ...states }))
      setLoadingEmployerSuggestions(false)
    }
    fetchEmployerSuggestions()
  }, [currentStudentId])

  useEffect(() => {
    async function fetchCompanySuggestions() {
      setLoadingCompanySuggestions(true)
      const res = await fetch("/api/students/people/suggestions/companies")
      const { companies } = await res.json()
      const safeCompanies = Array.isArray(companies) ? companies : []
      const mapped = (safeCompanies as ApiCompany[]).map(c => ({
        id: c.id,
        name: c.company_name,
        industry: c.company_industry,
        location: c.address ?? "",
        avatar: c.logoUrl ?? "/placeholder.svg?height=100&width=100",
      }))
      setSuggestedCompanies(mapped)

      const states: Record<string, string> = {}
      await Promise.all(
        mapped.map(async company => {
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
      setConnectionStates(prev => ({ ...prev, ...states }))
      setLoadingCompanySuggestions(false)
    }
    fetchCompanySuggestions()
  }, [currentStudentId])

  const handleConnect = async (id: string) => {
    const currentState = connectionStates[id]
    if (currentState === "Requested") {
      await fetch("/api/students/people/sendRequest", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ senderId: currentStudentId, receiverId: id }),
      })
      setConnectionStates(prev => ({ ...prev, [id]: "Connect" }))
    } else {
      await fetch("/api/students/people/sendRequest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ senderId: currentStudentId, receiverId: id }),
      })
      setConnectionStates(prev => ({ ...prev, [id]: "Requested" }))
    }
  }

  const handleFollow = async (id: string) => {
    const currentState = connectionStates[id]
    if (!currentStudentId) return
    if (currentState === "Following") {
      await fetch("/api/students/people/sendFollow", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ employerId: id }),
      })
      setConnectionStates(prev => ({ ...prev, [id]: "Follow" }))
    } else {
      await fetch("/api/students/people/sendFollow", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ employerId: id }),
      })
      setConnectionStates(prev => ({ ...prev, [id]: "Following" }))
    }
  }

  const handleFollowCompany = async (id: string) => {
    const currentState = connectionStates[id]
    if (!currentStudentId) return
    if (currentState === "Following") {
      await fetch("/api/students/people/sendFollow/companies", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ companyId: id }),
      })
      setConnectionStates(prev => ({ ...prev, [id]: "Follow" }))
    } else {
      await fetch("/api/students/people/sendFollow/companies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ companyId: id }),
      })
      setConnectionStates(prev => ({ ...prev, [id]: "Following" }))
    }
  }

  const handleSearch = (params: { firstName: string; lastName: string }) => {
    const { firstName, lastName } = params
    const filterByName = (name: string) =>
      (!firstName && !lastName) ||
      (firstName && name.toLowerCase().includes(firstName.toLowerCase())) ||
      (lastName && name.toLowerCase().includes(lastName.toLowerCase()))

    const students = suggestedStudents.filter(s => filterByName(s.name))
    const employers = suggestedEmployers.filter(e => filterByName(e.name))
    const companies = suggestedCompanies.filter(c => filterByName(c.name))

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
                    <div className="text-center py-8 text-gray-500">No Results found</div>
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
                        avatar: c.avatar,
                      }))}
                      connectionStates={connectionStates}
                      onConnect={handleFollowCompany}
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
        students={suggestedStudents.slice(0, 4)}
        loading={loadingSuggestions}
      />

      {/* Employers Section */}
      <SuggestionSection
        title="Employers You May Recognize"
        type="employers"
        connectionStates={connectionStates}
        onFollow={handleFollow}
        onViewAll={() => setOpenModal("employers")}
        employers={suggestedEmployers.slice(0, 4)}
        loading={loadingEmployerSuggestions}
      />

      {/* Companies Section */}
      <SuggestionSection
        title="Companies you may be interested in"
        type="companies"
        connectionStates={connectionStates}
        onFollow={handleFollowCompany}
        onViewAll={() => setOpenModal("companies")}
        companies={suggestedCompanies.slice(0, 4)}
        loading={loadingCompanySuggestions}
      />

      {/* View All Modals */}
      <ViewAllModal
        open={openModal === "students" || openModal === "search-students"}
        onClose={() => setOpenModal(null)}
        title="Students You May Recognize in Information Technology"
        type="students"
        connectionStates={connectionStates}
        onConnect={handleConnect}
        data={openModal === "students" ? suggestedStudents : openModal === "search-students" ? searchResults?.students : undefined}
      />

      <ViewAllModal
        open={openModal === "employers" || openModal === "search-employers"}
        onClose={() => setOpenModal(null)}
        title="Employers You May Recognize"
        type="employers"
        connectionStates={connectionStates}
        onFollow={handleFollow}
        data={openModal === "employers" ? suggestedEmployers : openModal === "search-employers" ? searchResults?.employers : undefined}
        loading={loadingEmployerSuggestions}
      />

      <ViewAllModal
        open={openModal === "companies" || openModal === "search-companies"}
        onClose={() => setOpenModal(null)}
        title="Companies you may be interested in"
        type="companies"
        connectionStates={connectionStates}
        onFollow={handleFollowCompany}
        data={openModal === "companies" ? suggestedCompanies : openModal === "search-companies" ? searchResults?.companies : undefined}
        loading={loadingCompanySuggestions}
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
  students?: Student[]
  employers?: Employer[]
  companies?: Company[]
  loading?: boolean
}

function SuggestionSection({ title, type, connectionStates, onConnect, onFollow, onViewAll, students, employers, companies, loading }: SuggestionSectionProps) {
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
            {type === "students" ? (
              <>
                <Tooltip title="Suggestions are based on matching your course, year, and section. Find classmates and friends easily!">
                  <span>
                    <Info size={14} className="mr-1" />
                  </span>
                </Tooltip>
                People you might know from your school
              </>
            ) : type === "employers" ? (
              <>
                <Tooltip title="Suggestions are based on employers registered in your school network.">
                  <span>
                    <Info size={14} className="mr-1" />
                  </span>
                </Tooltip>
                Based on your school network
              </>
            ) : (
              <>
                <Tooltip title="Company suggestions are based on your course and interests.">
                  <span>
                    <Info size={14} className="mr-1" />
                  </span>
                </Tooltip>
                Companies based on your course
              </>
            )}
          </div>
        </div>

        {type === "students" && (
          <GridStudents
            students={students ?? getStudents(4)}
            connectionStates={connectionStates}
            onConnect={onConnect!}
            loading={loading}
          />
        )}

        {type === "employers" && (
          <GridEmployer
            employers={employers ?? getEmployers(4)}
            connectionStates={connectionStates}
            onConnect={onFollow!}
            loading={loading}
          />
        )}

        {type === "companies" && (
          <GridCompanies
            companies={companies ?? getCompanies(4)}
            connectionStates={connectionStates}
            onConnect={onFollow!}
            loading={loading}
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
  loading?: boolean
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
  loading,
}: ViewAllModalProps) {
  const [hasScrolled] = useState(false)

  const displayData = (): Student[] | Employer[] | Company[] => {
    if (data) return data
    if (type === "students") return getStudents(12)
    if (type === "employers") return getEmployers(12)
    if (type === "companies") return getCompanies(12)
    return []
  }

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-6xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            {type === "students" && <GraduationCap size={18} className="mr-2" />}
            {type === "employers" && <Users size={18} className="mr-2" />}
            {type === "companies" && <Building2 size={18} className="mr-2" />}
            {title}
          </DialogTitle>
        </DialogHeader>
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center text-sm text-gray-600">
            Sort by
            <button className="flex items-center ml-1 text-gray-800 bg-gray-100 px-2 py-1 rounded-md">
              relevance <ChevronDown size={16} className="ml-1" />
            </button>
          </div>
        </div>
        <div className="overflow-y-auto max-h-[60vh] pr-2">
          <div
            className="grid gap-6"
            style={{
              gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))"
            }}
          >
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
                    loading={loading}
                  />
                )
              }
              if (type === "companies") {
                return (
                  <GridCompanies
                    companies={items as Company[]}
                    connectionStates={connectionStates}
                    onConnect={onFollow!}
                    loading={loading}
                  />
                )
              }
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

interface Student {
  id: string
  name: string
  title: string
  field: string
  avatar: string
  cover?: string
  yearAndSection: string
}

interface Employer {
  id: string
  name: string
  company: string
  job_title: string
  avatar: string
  cover?: string
}

interface Company {
  id: string
  name: string
  industry: string
  avatar: string
  location: string
}

interface StudentApiRow {
  id: string
  first_name: string | null
  last_name: string | null
  course: string | null
  year: string | null
  section: string | null
  user_id: string | null
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
      avatar: "/placeholder.svg?height=100&width=100",
    },
    {
      id: "c2",
      name: "Visionary Ventures",
      industry: "Business & Finance",
      location: "Makati",
      avatar: "/placeholder.svg?height=100&width=100",
    },
    {
      id: "c3",
      name: "LuxeVoyage Travel",
      industry: "Hospitality & Tourism",
      location: "Pasay",
      avatar: "/placeholder.svg?height=100&width=100",
    },
    {
      id: "c4",
      name: "Golden Spoon Catering",
      location: "San Juan",
      industry: "Food & Beverage",
      avatar: "/placeholder.svg?height=100&width=100",
    },
    {
      id: "c5",
      name: "Nexora Technologies",
      location: "Alabang",
      industry: "Tech & IT",
      avatar: "/placeholder.svg?height=100&width=100",
    },
    {
      id: "c6",
      name: "Visionary Ventures",
      industry: "Business & Finance",
      location: "Makati",
      avatar: "/placeholder.svg?height=100&width=100",
    },
    {
      id: "c7",
      name: "LuxeVoyage Travel",
      industry: "Hospitality & Tourism",
      location: "Pasay",
      avatar: "/placeholder.svg?height=100&width=100",
    },
    {
      id: "c8",
      name: "Golden Spoon Catering",
      industry: "Food & Beverage",
      location: "San Juan",
      avatar: "/placeholder.svg?height=100&width=100",
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
