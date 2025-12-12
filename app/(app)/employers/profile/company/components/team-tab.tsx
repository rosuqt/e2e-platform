"use client"
import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Search, User, Users } from "lucide-react"
import Image from "next/image"
import { MdAdminPanelSettings } from "react-icons/md"
import { useSession } from "next-auth/react"
import { motion } from "framer-motion"
import Tooltip from "@mui/material/Tooltip"

type Employer = {
  id: string
  first_name: string | null
  last_name: string | null
  email: string | null
  company_branch: string | null
  job_title: string | null
  company_role: string | null
  company_email: string | null
  company_admin: boolean | null
  created_at: string | null
  company_id: string | null
  user_id: string | null
  company_name: string | null
  profile_img?: string | null
  cover_image?: string | null
  founded?: string | null
  joined?: string | null
}

export default function TeamTab() {
  const { data: session } = useSession()
  const employerId =
    (session?.user && "employerId" in session.user
      ? (session.user as { employerId?: string }).employerId
      : undefined)

  const [companyId, setCompanyId] = useState<string | null>(null)
  const [companyName, setCompanyName] = useState<string | null>(null)
  const [employees, setEmployees] = useState<Employer[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState("")
  const [selectedBranches, setSelectedBranches] = useState<string[]>(["All"])
  const [selectedJobTitles, setSelectedJobTitles] = useState<string[]>(["All Job Titles"])

  useEffect(() => {
    if (!employerId) return
    setLoading(true)
    setError(null)
    const url =
      typeof window !== "undefined"
        ? `${window.location.origin}/api/employers/get-company-id?employer_id=${encodeURIComponent(employerId)}`
        : `/api/employers/get-company-id?employer_id=${encodeURIComponent(employerId)}`
    fetch(url)
      .then(res => res.json())
      .then(res => {
        if (res.error || !res.company_id) {
          setError("Could not find company id.")
          setLoading(false)
        } else {
          setCompanyId(res.company_id)
        }
      })
      .catch(() => {
        setError("Could not fetch company id.")
        setLoading(false)
      })
  }, [employerId])

  useEffect(() => {
    if (!companyId) return
    setLoading(true)
    setError(null)
    const url =
      typeof window !== "undefined"
        ? `${window.location.origin}/api/employers/get-company-name?company_id=${encodeURIComponent(companyId)}`
        : `/api/employers/get-company-name?company_id=${encodeURIComponent(companyId)}`
    fetch(url)
      .then(res => res.json())
      .then(res => {
        if (res.error || !res.company_name) {
          setError("Could not find company name.")
          setLoading(false)
        } else {
          setCompanyName(res.company_name)
        }
      })
      .catch(() => {
        setError("Could not fetch company name.")
        setLoading(false)
      })
  }, [companyId])

  async function getSignedUrlIfNeeded(img: string | null | undefined, bucket: string): Promise<string | null> {
    if (!img) return null
    if (/^https?:\/\//.test(img)) return img
    const res = await fetch("/api/employers/get-signed-url", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ bucket, path: img }),
    })
    if (!res.ok) return null
    const { signedUrl } = await res.json()
    return signedUrl || null
  }

  useEffect(() => {
    if (!companyName) return
    setLoading(true)
    setError(null)
    const url =
      typeof window !== "undefined"
        ? `${window.location.origin}/api/employers/colleagues/fetchUsers?company_name=${encodeURIComponent(companyName)}`
        : `/api/employers/colleagues/fetchUsers?company_name=${encodeURIComponent(companyName)}`
    fetch(url)
      .then(res => res.json())
      .then(async res => {
        if (res.error) {
          setError(res.error)
          setEmployees([])
          setLoading(false)
          return
        }
        const employees: Employer[] = Array.isArray(res.data) ? res.data : []
        const updated = await Promise.all(
          employees.map(async (emp) => {
            const profileImgUrl = await getSignedUrlIfNeeded(emp.profile_img, "user.avatars")
            const coverImgUrl = await getSignedUrlIfNeeded(emp.cover_image, "user.covers")
            return {
              ...emp,
              profile_img: profileImgUrl || "https://dbuyxpovejdakzveiprx.supabase.co/storage/v1/object/public/app.images//default-pfp.jpg",
              cover_image: coverImgUrl || undefined,
            }
          })
        )
        setEmployees(updated)
        setLoading(false)
      })
      .catch(() => {
        setError("Failed to load team members.")
        setLoading(false)
      })
  }, [companyName])

  const branches = [
    { name: "All", count: employees.length },
    ...Array.from(
      employees.reduce((acc, emp) => {
        const branch = emp.company_branch || "Other"
        acc.set(branch, (acc.get(branch) || 0) + 1)
        return acc
      }, new Map<string, number>())
    ).map(([name, count]) => ({ name, count }))
  ]

  const jobTitles = [
    "All Job Titles",
    ...Array.from(new Set(employees.map(e => e.job_title || "").filter(Boolean)))
  ]

  function handleBranchChange(branch: string) {
    if (branch === "All") {
      setSelectedBranches(["All"])
    } else {
      setSelectedBranches(prev => {
        const next = prev.includes(branch)
          ? prev.filter(b => b !== branch)
          : [...prev.filter(b => b !== "All"), branch]
        return next.length === 0 ? ["All"] : next
      })
    }
  }

  function handleJobTitleChange(jobTitle: string) {
    if (jobTitle === "All Job Titles") {
      setSelectedJobTitles(["All Job Titles"])
    } else {
      setSelectedJobTitles(prev => {
        const next = prev.includes(jobTitle)
          ? prev.filter(j => j !== jobTitle)
          : [...prev.filter(j => j !== "All Job Titles"), jobTitle]
        return next.length === 0 ? ["All Job Titles"] : next
      })
    }
  }

  const filteredEmployees = employees.filter(emp => {
    const matchesSearch =
      !search ||
      [emp.first_name, emp.last_name, emp.email, emp.job_title, emp.company_branch]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(search.toLowerCase())
    const matchesBranch =
      selectedBranches.includes("All") ||
      selectedBranches.includes(emp.company_branch || "Other")
    const matchesJobTitle =
      selectedJobTitles.includes("All Job Titles") ||
      selectedJobTitles.includes(emp.job_title || "")
    return matchesSearch && matchesBranch && matchesJobTitle
  })

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-md p-6 border border-blue-200">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Company Team</h2>
          <div className="flex items-center gap-2">
            <Badge className="bg-blue-100 text-blue-800 px-3 py-1">
              <Users className="w-4 h-4 mr-1" />
              {employees.length} Employees
            </Badge>
          </div>
        </div>
        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:w-1/4 space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <Input
                placeholder="Search team members..."
                className="pl-10 pr-4 py-2 w-full border border-gray-200 rounded-lg"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-medium mb-3">Branches</h3>
              <div className="space-y-2">
                {branches.map((branch) => (
                  <div key={branch.name} className="flex items-center justify-between">
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="rounded text-blue-600 focus:ring-blue-500"
                        checked={selectedBranches.includes(branch.name)}
                        onChange={() => handleBranchChange(branch.name)}
                      />
                      <span className="ml-2 text-sm">{branch.name}</span>
                    </label>
                    <span className="text-xs bg-gray-200 rounded-full px-2 py-0.5">{branch.count}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-medium mb-3">Job Title</h3>
              <div className="space-y-2">
                {jobTitles.map((jobTitle) => (
                  <div key={jobTitle} className="flex items-center">
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="rounded text-blue-600 focus:ring-blue-500"
                        checked={selectedJobTitles.includes(jobTitle)}
                        onChange={() => handleJobTitleChange(jobTitle)}
                      />
                      <span className="ml-2 text-sm">{jobTitle}</span>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="md:w-3/4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {loading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="overflow-hidden border border-gray-200 animate-pulse bg-white rounded-xl">
                    <div className="h-36 bg-gradient-to-r from-blue-100 to-purple-100 relative" />
                    <div className="pt-10 p-4">
                      <div className="flex items-center justify-center gap-1">
                        <div className="h-6 w-32 bg-gray-200 rounded mb-2" />
                      </div>
                      <div className="h-4 w-20 bg-gray-100 rounded mx-auto mb-2" />
                      <div className="flex justify-center mt-2">
                        <div className="h-5 w-24 bg-gray-100 rounded" />
                      </div>
                      <div className="mt-3 h-3 w-24 bg-gray-100 rounded mx-auto" />
                      <div className="flex gap-2 mt-4">
                        <div className="h-8 w-20 bg-gray-200 rounded" />
                        <div className="h-8 w-20 bg-gray-100 rounded" />
                      </div>
                    </div>
                  </div>
                ))
              ) : error ? (
                <div className="col-span-full text-center text-red-500 py-10">{error}</div>
              ) : filteredEmployees.length === 0 ? (
                <div className="col-span-full text-center text-gray-500 py-10">No team members found.</div>
              ) : (
                filteredEmployees.map((employee) => (
                  <Card
                    key={employee.id}
                    className="overflow-hidden border border-gray-200 hover:shadow-md transition-shadow relative"
                  >
                    {employee.id === employerId && (
                      <span className="absolute top-3 right-3 z-10 bg-green-100 text-green-800 text-xs font-semibold px-3 py-1 rounded-full shadow">
                        You
                      </span>
                    )}
                    <CardContent className="p-0">
                      <div className="h-36 bg-gradient-to-r from-blue-500 to-purple-500 relative">
                        {employee.cover_image ? (
                          <Image
                            src={employee.cover_image}
                            alt="Cover"
                            fill
                            style={{ objectFit: "cover", zIndex: 0 }}
                            className="w-full h-full"
                          />
                        ) : null}
                        <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 w-20 h-20">
                          <div className="w-full h-full rounded-full border-4 border-white overflow-hidden bg-white aspect-square">
                            <Image
                              src={employee.profile_img || "https://dbuyxpovejdakzveiprx.supabase.co/storage/v1/object/public/app.images//default-pfp.jpg"}
                              alt={employee.first_name || employee.email || "Profile"}
                              width={80}
                              height={80}
                              className="object-cover w-full h-full rounded-full"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="pt-10 p-4">
                        <div className="flex items-center justify-center gap-1">
                          <h3 className="font-semibold text-lg text-center flex items-center justify-center gap-1 m-0">
                            {employee.first_name} {employee.last_name}
                            {employee.company_admin && (
                              <Tooltip title="This employer is a company admin" placement="top" arrow>
                                <motion.span
                                  whileHover={{ scale: 1.2 }}
                                  className="inline-flex items-center ml-1 cursor-pointer"
                                >
                                  <MdAdminPanelSettings className="text-blue-600" title="Admin" size={20} />
                                </motion.span>
                              </Tooltip>
                            )}
                          </h3>
                        </div>
                        <p className="text-sm text-gray-600 text-center">{employee.company_branch}</p>
                        <div className="flex justify-center mt-2">
                          <Badge className="bg-blue-100 text-blue-800">{employee.job_title || employee.company_role}</Badge>
                        </div>
                        <div className="mt-3 text-xs text-gray-500">
                          <div className="flex items-center justify-center mb-1">
                            <User className="w-3 h-3 mr-1" />
                            {employee.joined ? `Joined ${employee.joined}` : employee.created_at ? `Joined ${new Date(employee.created_at).getFullYear()}` : ""}
                          </div>
                        </div>
                        <div className="flex gap-2 mt-4">
                          {/* Removed Message and Profile buttons */}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
