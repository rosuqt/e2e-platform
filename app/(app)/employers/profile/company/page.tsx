"use client"

import { useState, useEffect } from "react"
import { Calendar, Star, Award, Users2, Camera, Pencil } from "lucide-react"
// import AboutTab from "./components/about-tab"
import JobListingsTab from "./components/job-listings-tab"
import TeamTab from "./components/team-tab"
import RatingsTab from "./components/ratings-tab"
import Tabs from "@mui/material/Tabs"
import Tab from "@mui/material/Tab"
import Box from "@mui/material/Box"
import { HiBadgeCheck } from "react-icons/hi"
import { LuBadgeCheck } from "react-icons/lu"
import { PiWarningFill } from "react-icons/pi"
import { motion } from "framer-motion"
import { TextField, MenuItem } from "@mui/material"
import Image from "next/image"

type Company = {
  id: string
  company_name: string
  company_branch: string
  company_industry: string
  company_size: string | null
  company_website: string | null
  verify_status: string | null
  address: string | null
  exact_address: string | null
  company_logo_image_path: string | null
  country_code: string | null
}

export default function CompanyProfilePage() {
  // Set initial tab to 0 (Job Listings)
  const [activeTab, setActiveTab] = useState(0)
  const [company, setCompany] = useState<Company | null>(null)
  const [branchCount, setBranchCount] = useState<number | null>(null)
  const [logoUrl, setLogoUrl] = useState<string | null>(null)
  const [coverUrl, setCoverUrl] = useState<string | null>(null)
  const [editingFounded, setEditingFounded] = useState(false)
  const [editingSize, setEditingSize] = useState(false)
  const [founded, setFounded] = useState<string>("YYYY")
  const [companySize, setCompanySize] = useState<string>("")

  const [foundedError, setFoundedError] = useState<string>("")
  const [savingCompanySize, setSavingCompanySize] = useState(false)
  const [uploadingCover, setUploadingCover] = useState(false)
  const [jobCount, setJobCount] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [isCompanyAdmin, setIsCompanyAdmin] = useState(false)
  const [avgRating, setAvgRating] = useState<number | null>(null)

  const [canEdit, setCanEdit] = useState(false)
  const [canView, setCanView] = useState(false)

  useEffect(() => {
    setLoading(true)
    fetch("/api/employers/company-profile/getHandlers")
      .then(res => res.json())
      .then(async data => {
        if (!data.error) setCompany(data)
        if (data?.founded) setFounded(data.founded)
        if (data?.company_logo_image_path && data?.id) {
          const res = await fetch("/api/employers/get-signed-url", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ bucket: "company.logo", path: data.company_logo_image_path }),
          })
          if (res.ok) {
            const { signedUrl } = await res.json()
            setLogoUrl(signedUrl || null)
          }
        }
        if (data?.cover_img && data?.id) {
          const res = await fetch("/api/employers/get-signed-url", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ bucket: "company.images", path: data.cover_img }),
          })
          if (res.ok) {
            const { signedUrl } = await res.json()
            setCoverUrl(signedUrl ? signedUrl + (signedUrl.includes('?') ? '&' : '?') + 't=' + Date.now() : null)
          }
        }
        if (data?.id) {
          fetch(`/api/employers/company-profile/branch-count?company_id=${data.id}`)
            .then(res => res.json())
            .then(bc => {
              if (typeof bc.count === "number") setBranchCount(bc.count)
            })
          fetch(`/api/employers/company-profile/job-count?company_id=${data.id}`)
            .then(res => res.json())
            .then(jc => {
              if (typeof jc.count === "number") setJobCount(jc.count)
            })
        }
        if (data?.company_size) setCompanySize(data.company_size)
    
      })
      .finally(() => setLoading(false))

    fetch("/api/employers/me")
      .then(res => res.json())
      .then(data => {
        if (data?.company_admin) setIsCompanyAdmin(true)
        if (typeof data?.edit_company_profile === "boolean") setCanEdit(data.edit_company_profile)
        if (typeof data?.can_view === "boolean") setCanView(data.can_view)
        else setCanView(false)
      })
      .catch(() => {
        setIsCompanyAdmin(false)
        setCanEdit(false)
        setCanView(false)
      })

    const handler = (e: Event) => {
      if ((e as CustomEvent).detail?.tab === "team") setActiveTab(1) // Team is now tab 1
    }
    window.addEventListener("company-profile-switch-tab", handler)
    return () => window.removeEventListener("company-profile-switch-tab", handler)
  }, [])

  useEffect(() => {
    if (typeof window === "undefined") return
    const handler = (e: Event) => {
      const custom = e as CustomEvent
      if (custom.detail?.tab !== undefined) setActiveTab(custom.detail.tab)
    }
    window.addEventListener("company-profile-set-tab", handler)
    if (window.location.hash === "#team") setActiveTab(1) // Team is now tab 1
    return () => window.removeEventListener("company-profile-set-tab", handler)
  }, [])

  const handleLogoUpload = async (file: File) => {
    if (!company?.id) return
    const formData = new FormData()
    formData.append("file", file)
    formData.append("company_id", company.id)
    const res = await fetch("/api/employers/company-profile/upload", {
      method: "POST",
      body: formData,
    })
    if (res.ok) {
      const data = await res.json()
      const filePath = data.filePath
      const urlRes = await fetch("/api/employers/get-signed-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bucket: "company.logo", path: filePath }),
      })
      if (urlRes.ok) {
        const { signedUrl } = await urlRes.json()
        setLogoUrl(signedUrl || null)
      }
    }
  }

  const handleLogoCameraClick = () => {
    const input = document.createElement("input")
    input.type = "file"
    input.accept = "image/*"
    input.onchange = (e: Event) => {
      const target = e.target as HTMLInputElement
      const file = target.files?.[0]
      if (file) handleLogoUpload(file)
    }
    input.click()
  }

  const handleCoverUpload = async (file: File) => {
    if (!company?.id) return
    setUploadingCover(true)
    const formData = new FormData()
    formData.append("file", file)
    formData.append("company_id", company.id)
    formData.append("type", "cover_img")
    const res = await fetch("/api/employers/company-profile/upload", {
      method: "POST",
      body: formData,
    })
    if (res.ok) {
      const data = await res.json()
      const filePath = data.filePath
      const urlRes = await fetch("/api/employers/get-signed-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bucket: "company.images", path: filePath }),
      })
      if (urlRes.ok) {
        const { signedUrl } = await urlRes.json()
        setCoverUrl(signedUrl ? signedUrl + (signedUrl.includes('?') ? '&' : '?') + 't=' + Date.now() : null)
      }
    }
    setUploadingCover(false)
  }

  const handleCoverCameraClick = () => {
    const input = document.createElement("input")
    input.type = "file"
    input.accept = "image/*"
    input.onchange = (e: Event) => {
      const target = e.target as HTMLInputElement
      const file = target.files?.[0]
      if (file) handleCoverUpload(file)
    }
    input.click()
  }

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue)
  }

  const saveFounded = async () => {
    const year = founded.trim()
    const yearNum = Number(year)
    const currentYear = new Date().getFullYear()
    if (!/^\d{4}$/.test(year) || isNaN(yearNum) || yearNum < 1800 || yearNum > currentYear) {
      setFoundedError("Enter a valid year")
      return
    }
    setFoundedError("")
    setEditingFounded(false)
    if (company?.id) {
      await fetch("/api/employers/company-profile/postHandlers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          company_id: company.id,
          founded: year,
          action: "update_founded"
        }),
      })
    }
  }


  async function handleCompanySizeChange(value: string) {
    setCompanySize(value)
    if (!company?.id) return
    setSavingCompanySize(true)
    await fetch("/api/employers/company-profile/postHandlers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        company_id: company.id,
        company_size: value,
        action: "update_company_size_registered_companies"
      }),
    })
    setSavingCompanySize(false)
    setEditingSize(false)
  }

  useEffect(() => {
    // Add fetch for company ratings
    fetch("/api/employers/fetchRatings")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          const avg =
            data.reduce((sum, r) => sum + (r.company_rating || 0), 0) / data.length
          setAvgRating(Math.round(avg * 10) / 10)
        }
      })
      .catch(() => setAvgRating(null))
  }, [])

  if (!canView && !isCompanyAdmin) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[40vh]">
        <span className="mb-4">
          <span>
            <svg className="animate-spin h-8 w-8 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
            </svg>
          </span>
        </span>

      </div>
    )
  }

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      {loading ? (
        <div>
          <div className="bg-white rounded-xl overflow-hidden shadow-md mb-6 border border-blue-200 animate-pulse">
            <div className="h-48 bg-gradient-to-r from-blue-100 to-purple-100 relative" />
            <div className="px-6 pb-6 relative">
              <div className="absolute -top-16 left-6 w-32 h-32 bg-gray-200 rounded-md" />
              <div className="ml-36 pt-4 flex justify-between">
                <div>
                  <div className="h-7 w-48 bg-gray-200 rounded mb-2" />
                  <div className="h-4 w-32 bg-gray-100 rounded mb-1" />
                  <div className="h-4 w-40 bg-gray-100 rounded mb-1" />
                  <div className="h-4 w-56 bg-gray-100 rounded" />
                </div>
              </div>
              <div className="flex items-end mt-6">
                <div className="h-8 w-64 bg-gray-100 rounded" />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-white rounded-xl p-4 shadow-sm border border-blue-200 flex items-center gap-4 animate-pulse">
                <div className="w-12 h-12 rounded-full bg-gray-200" />
                <div className="flex-1">
                  <div className="h-4 w-24 bg-gray-100 rounded mb-2" />
                  <div className="h-6 w-16 bg-gray-200 rounded" />
                </div>
              </div>
            ))}
          </div>
          <div className="mb-8">
            <div className="bg-white rounded-xl shadow-md p-6 border border-blue-200 animate-pulse h-40" />
          </div>
        </div>
      ) : (
        <>
          {/* Profile Header */}
          <div className="bg-white rounded-xl overflow-hidden shadow-md mb-6 border border-blue-200">
            <div className="h-48 bg-gradient-to-r from-blue-600 to-purple-600 relative">
              {coverUrl && (
                <Image
                  src={coverUrl}
                  alt="Company Cover"
                  width={1200}
                  height={192}
                  className="absolute inset-0 w-full h-full object-cover"
                  style={{
                    zIndex: 0,
                    objectPosition: "center 50%"
                  }}
                  unoptimized
                />
              )}
              <button
                className="absolute top-4 right-4 bg-white border border-blue-300 text-blue-600 hover:bg-blue-50 rounded-full p-2 shadow"
                title="Change cover photo"
                onClick={handleCoverCameraClick}
                disabled={uploadingCover || !canEdit}
                style={!canEdit ? { opacity: 0.5, pointerEvents: "none" } : {}}
              >
                <Camera className="w-5 h-5" />
              </button>
            </div>
            <div className="px-6 pb-6 relative">
              <div className="absolute -top-16 left-6 w-32 h-32 bg-white rounded-md">
                <div className="relative w-full h-full">
                  {/* White border around profile icon */}
                  <div className="w-full h-full rounded-md bg-white border-4 border-white flex items-center justify-center overflow-hidden">
                    {logoUrl ? (
                      <Image
                        src={logoUrl}
                        alt="Company Logo"
                        width={128}
                        height={128}
                        className="w-full h-full rounded-md object-cover"
                        unoptimized
                      />
                    ) : (
                      <div className="w-full h-full rounded-md bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-2xl select-none relative">
                        {company?.company_name
                          ? company.company_name
                              .split(" ")
                              .map((w: string) => w[0])
                              .join("")
                              .slice(0, 2)
                              .toUpperCase()
                          : "TC"}
                      </div>
                    )}
                  </div>
                  {/* Floating camera button */}
                  <button
                    className="absolute top-0 right-0 translate-x-1/4 -translate-y-1/4 bg-white border border-blue-300 text-blue-600 hover:bg-blue-50 rounded-full p-2 shadow"
                    title="Change profile picture"
                    onClick={handleLogoCameraClick}
                    disabled={!canEdit}
                    style={!canEdit ? { opacity: 0.5, pointerEvents: "none" } : {}}
                  >
                    <Camera className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="ml-36 pt-4 flex justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-2xl font-bold">{company?.company_name || "Company Name"}</h1>
                    <div className="relative flex items-center">
                      {(() => {
                        let badgeEl, pillText, pillBg, pillTextColor, pillWidth
                        if (company?.verify_status === "full") {
                          badgeEl = (
                            <motion.span
                              className="bg-gradient-to-r from-blue-600 to-purple-500 bg-clip-text cursor-default"
                              whileHover={{ scale: 1.18 }}
                              transition={{ type: "spring", stiffness: 340, damping: 16 }}
                              style={{ display: "inline-flex", zIndex: 1 }}
                            >
                              <HiBadgeCheck className="w-6 h-6 text-blue-600" />
                            </motion.span>
                          )
                          pillText = "Fully Verified"
                          pillBg = "bg-gradient-to-r from-blue-100 to-purple-100"
                          pillTextColor = "text-blue-700"
                          pillWidth = 110
                        } else if (company?.verify_status === "standard") {
                          badgeEl = (
                            <motion.span
                              className="cursor-default"
                              whileHover={{ scale: 1.18 }}
                              transition={{ type: "spring", stiffness: 340, damping: 16 }}
                              style={{ display: "inline-flex", zIndex: 1 }}
                            >
                              <LuBadgeCheck className="w-5 h-5" style={{ color: "#7c3aed" }} />
                            </motion.span>
                          )
                          pillText = "Partially Verified"
                          pillBg = "bg-purple-100"
                          pillTextColor = "text-purple-700"
                          pillWidth = 140
                        } else {
                          badgeEl = (
                            <motion.span
                              className="cursor-default"
                              whileHover={{ scale: 1.18 }}
                              transition={{ type: "spring", stiffness: 340, damping: 16 }}
                              style={{ display: "inline-flex", zIndex: 1 }}
                            >
                              <PiWarningFill className="w-5 h-5 text-orange-500" />
                            </motion.span>
                          )
                          pillText = "Not Verified"
                          pillBg = "bg-orange-200"
                          pillTextColor = "text-orange-700"
                          pillWidth = 100
                        }
                        return (
                          <>
                            {badgeEl}
                            <motion.span
                              className={`whitespace-nowrap h-7 flex items-center justify-center ${pillBg} ${pillTextColor} rounded-full text-xs font-semibold ml-2 px-3 cursor-default`}
                              style={{ width: pillWidth }}
                              whileHover={{ scale: 1.08 }}
                              transition={{ type: "spring", stiffness: 260, damping: 18 }}
                            >
                              {pillText}
                            </motion.span>
                          </>
                        )
                      })()}
                    </div>
                  </div>
                  <p className="text-gray-600">
                    {company?.company_industry
                      ? company.company_industry.charAt(0).toUpperCase() + company.company_industry.slice(1)
                      : ""}
                    {company?.company_industry && branchCount !== null ? " | " : ""}
                    {branchCount !== null
                      ? branchCount === 1
                        ? "Headquarters"
                        : `${branchCount} Branches`
                      : ""}
                  </p>
                  {/* Company rating stars */}
                  {avgRating !== null && (
                    <div className="flex items-center gap-1 mt-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-4 h-4 ${avgRating >= star ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                        />
                      ))}
                      <span className="ml-2 text-sm text-gray-700">{avgRating}/5 Ratings</span>
                    </div>
                  )}
                  {/* Remove bio and slogan from here */}
                </div>
                {isCompanyAdmin ? null : (!canEdit && canView) ? (
                  <div className="flex flex-col items-start gap-2">
                   
              
                  </div>
                ) : null}
              </div>
              {/* MUI Tabs at the bottom left of the header */}
              <div className="flex items-end mt-6">
                <Box sx={{ borderBottom: 1, borderColor: "divider", width: "fit-content", minWidth: 0 }}>
                  <Tabs
                    value={activeTab}
                    onChange={handleTabChange}
                    textColor="primary"
                    indicatorColor="primary"
                    aria-label="company profile tabs"
                    variant="scrollable"
                    scrollButtons="auto"
                  >
                    {/* Remove About Tab, so Job Listings is first */}
                    <Tab
                      label="Job Listings"
                      sx={{
                        textTransform: "capitalize",
                        fontWeight: 500,
                        fontSize: 14,
                        "&:hover": { color: "#2563eb" },
                      }}
                    />
                    <Tab
                      label="Team"
                      sx={{
                        textTransform: "capitalize",
                        fontWeight: 500,
                        fontSize: 14,
                        "&:hover": { color: "#2563eb" },
                      }}
                    />
                    <Tab
                      label="Ratings"
                      sx={{
                        textTransform: "capitalize",
                        fontWeight: 500,
                        fontSize: 14,
                        "&:hover": { color: "#2563eb" },
                      }}
                    />
                  </Tabs>
                </Box>
              </div>
            </div>
          </div>
          {/* Company Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-xl p-4 shadow-sm border border-blue-200 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                <Calendar className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-500 flex items-center gap-1">
                  Founded
                  {canEdit && (
                    <button
                      className="ml-2 text-blue-500 hover:text-blue-700"
                      onClick={() => setEditingFounded(true)}
                      aria-label="Edit Founded"
                      type="button"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                  )}
                </p>
                {editingFounded && canEdit ? (
                  <>
                    <input
                      className="text-xl font-bold border-b border-blue-300 focus:outline-none focus:border-blue-500 bg-blue-50 px-1"
                      value={founded}
                      autoFocus
                      inputMode="numeric"
                      pattern="\d*"
                      onChange={e => {
                        const val = e.target.value.replace(/\D/g, "")
                        setFounded(val)
                        setFoundedError("")
                      }}
                      onBlur={saveFounded}
                      onKeyDown={e => {
                        if (e.key === "Enter") saveFounded()
                        if (e.key === "Escape") { setEditingFounded(false); setFoundedError("") }
                      }}
                      maxLength={4}
                      style={{ width: "5em" }}
                    />
                    {foundedError && (
                      <div className="text-xs text-red-500 mt-1">{foundedError}</div>
                    )}
                  </>
                ) : (
                  <p className="text-xl font-bold">{founded}</p>
                )}
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm border border-blue-200 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
                <Users2 className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-500 flex items-center gap-1">
                  Company Size
                  {canEdit && (
                    <button
                      className="ml-2 text-blue-500 hover:text-blue-700"
                      onClick={() => setEditingSize(true)}
                      aria-label="Edit Company Size"
                      type="button"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                  )}
                </p>
                {editingSize && canEdit ? (
                  <TextField
                    select
                    variant="standard"
                    value={companySize}
                    onChange={e => handleCompanySizeChange(e.target.value)}
                    onBlur={() => setEditingSize(false)}
                    autoFocus
                    fullWidth
                    disabled={savingCompanySize}
                    sx={{
                      fontSize: "1.25rem",
                      fontWeight: "bold",
                      background: "#f0f6ff",
                      borderRadius: 1,
                      mt: 1,
                    }}
                  >
                    <MenuItem value="">Select company size</MenuItem>
                    <MenuItem value="1-10">1-10</MenuItem>
                    <MenuItem value="11-50">11-50</MenuItem>
                    <MenuItem value="51-200">51-200</MenuItem>
                    <MenuItem value="201-500">201-500</MenuItem>
                    <MenuItem value="501-1000">501-1000</MenuItem>
                    <MenuItem value="1000+">1000+</MenuItem>
                  </TextField>
                ) : (
                  <p className="text-xl font-bold">{companySize || "N/A"}</p>
                )}
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm border border-blue-200 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                <Star className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Rating</p>
                <p className="text-xl font-bold">4.8/5</p>
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm border border-blue-200 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-600">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Posted Positions</p>
                <p className="text-xl font-bold">{jobCount !== null ? jobCount : "—"}</p>
              </div>
            </div>
          </div>

          {/* Tab Content */}
          <div className="mb-8">
            {/* Remove AboutTab, shift indices */}
            {/* 
              Ensure JobListingsTab displays a fallback like "No deadline set" if application_deadline is missing.
              This should be handled inside JobListingsTab when rendering each job.
            */}
            {activeTab === 0 && <JobListingsTab /* canEdit={canEdit} */ />}
            {activeTab === 1 && <TeamTab /* canEdit={canEdit} */ />}
            {activeTab === 2 && <RatingsTab /* canEdit={canEdit} */ />}
          </div>
        </>
      )}
    </div>
  )
}
