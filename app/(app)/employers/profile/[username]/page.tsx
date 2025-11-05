"use client"

import { useState, useEffect, useRef } from "react"

import { Button } from "@/components/ui/button"
import { Building2, Camera, Pencil } from "lucide-react"
import { HiBadgeCheck } from "react-icons/hi"
import { LuBadgeCheck } from "react-icons/lu"
import {  PiWarningBold, PiWarningFill } from "react-icons/pi"
import { RiErrorWarningLine } from "react-icons/ri"
import { useRouter } from "next/navigation"
import Tooltip, { TooltipProps, tooltipClasses } from "@mui/material/Tooltip"
import { styled } from "@mui/material/styles"
import Skeleton from "@mui/material/Skeleton"
import { motion } from "framer-motion"
import Image from "next/image"

import AboutTab from "../components/about-tab"
import JobListingsTab from "../components/job-listings-tab"
import RatingsTab from "../components/ratings-tab"
import Tabs from "@mui/material/Tabs"
import Tab from "@mui/material/Tab"
import Box from "@mui/material/Box"

type Employer = {
  id: string
  first_name: string
  last_name: string
  email: string
  job_title: string
  company_name: string
  verify_status: string
  short_bio?: string
}

const CustomTooltip = styled(Tooltip)<TooltipProps>(() => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: "#fff",
    color: "#222",
    boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
    fontSize: 13,
    borderRadius: 8,
    padding: "8px 14px",
    fontWeight: 500,
    letterSpacing: 0.1,
  },
  [`& .${tooltipClasses.arrow}`]: {
    color: "#fff",
  },
}))

export default function EmployerProfilePage() {
  const [activeTab, setActiveTab] = useState(0)
  const [employer, setEmployer] = useState<Employer | null>(null)
  const [bio, setBio] = useState("")
  const [editingBio, setEditingBio] = useState(false)
  const [savingBio, setSavingBio] = useState(false)
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const [coverUrl, setCoverUrl] = useState<string | null>(null)
  const [uploadingCover, setUploadingCover] = useState(false)
  const [uploadingAvatar, setUploadingAvatar] = useState(false)
  const [tooltipOpen, setTooltipOpen] = useState(false)
  const tooltipTimer = useRef<NodeJS.Timeout | null>(null)
  const router = useRouter()

  async function getSignedUrlIfNeeded(img: string | undefined, bucket: string): Promise<string | null> {
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
    fetch("/api/employers/get-employer-details")
      .then(res => res.json())
      .then(data => {
        if (!data.error) {
          setEmployer(data)
        }
      })

    fetch("/api/employers/employer-profile/getHandlers")
      .then(res => res.json())
      .then(async data => {
        if (data && typeof data.short_bio === "string" && data.short_bio.length > 0) {
          setBio(data.short_bio)
        }

        if (typeof data?.profile_img === "string" && data.profile_img.trim() !== "") {
          const res = await fetch("/api/employers/get-signed-url", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              bucket: "user.avatars",
              path: data.profile_img,
            }),
          });
          if (res.ok) {
            const { signedUrl } = await res.json();
            setAvatarUrl(signedUrl || null);
          } else {
            setAvatarUrl(null);
          }
        } else {
          setAvatarUrl(null);
        }
        const cover = await getSignedUrlIfNeeded(data?.cover_image, "user.covers")
        setCoverUrl(cover)
      })
  }, [employer?.id])

  const handleUpload = async (file: File, fileType: "avatar" | "cover") => {
    if (!employer) return
    const formData = new FormData()
    formData.append("file", file)
    formData.append(
      "fileType",
      fileType === "avatar" ? "profile_img" : "cover_image"
    )
    formData.append("employer_id", employer.id)
    if (fileType === "avatar") setUploadingAvatar(true)
    if (fileType === "cover") setUploadingCover(true)
    const res = await fetch("/api/employers/employer-profile/upload", {
      method: "POST",
      body: formData,
    })
    if (fileType === "avatar") setUploadingAvatar(false)
    if (fileType === "cover") setUploadingCover(false)
    if (res.ok) {
      const data = await res.json()
      const bucket = fileType === "avatar" ? "user.avatars" : "user.covers"
      const filePath = data.filePath 
      const signedUrl = await getSignedUrlIfNeeded(filePath, bucket)
      if (fileType === "avatar") {
        setAvatarUrl(signedUrl)
        window.dispatchEvent(new Event("profilePictureUpdated"))
      }
      if (fileType === "cover") setCoverUrl(signedUrl)
    } else {
      const errorText = await res.text()
      console.error("Upload failed:", errorText)
    }
  }

  const handleCameraClick = (fileType: "avatar" | "cover") => {
    const input = document.createElement("input")
    input.type = "file"
    input.accept = "image/*"
    input.onchange = (e: Event) => {
      const target = e.target as HTMLInputElement
      const file = target.files?.[0]
      if (file) handleUpload(file, fileType)
    }
    input.click()
  }

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue)
  }

  const handleBioChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setBio(e.target.value)
  }

  const handleBioBlur = async () => {
    if (!employer) return
    setSavingBio(true)
    await fetch("/api/employers/employer-profile/postHandlers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ employerID: employer.id, short_bio: bio }),
    })
    setSavingBio(false)
    setEditingBio(false)
  }

  const handleBioKeyDown = async (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      await handleBioBlur()
    }
  }

  const loading = !employer 

  function getInitials(name: string | undefined) {
    if (!name) return ""
    const parts = name.trim().split(" ")
    if (parts.length === 1) return parts[0][0]?.toUpperCase() ?? ""
    return (parts[0][0] ?? "") + (parts[1][0] ?? "")
  }

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <div className="bg-white rounded-xl overflow-hidden shadow-md mb-6 border border-blue-200">
        {loading ? (
          <div>
            <div className="h-48 relative">
              <Skeleton variant="rectangular" width="100%" height="100%" />
              <div className="absolute top-4 right-4">
                <Skeleton variant="circular" width={40} height={40} />
              </div>
            </div>
            <div className="px-6 pb-6 relative">
              <div className="absolute -top-16 left-6 w-32 h-32">
                <Skeleton variant="circular" width={128} height={128} />
              </div>
              <div className="ml-36 pt-4 flex justify-between">
                <div>
                  <Skeleton variant="text" width={180} height={32} />
                  <Skeleton variant="text" width={140} height={24} />
                  <Skeleton variant="text" width={220} height={20} />
                </div>
                <div className="flex gap-3">
                  <Skeleton variant="rectangular" width={120} height={40} />
                </div>
              </div>
              <div className="flex items-end mt-6">
                <Skeleton variant="rectangular" width={320} height={40} />
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="h-48 bg-gradient-to-r from-blue-500 to-blue-600 relative">
              {uploadingCover ? (
                <Skeleton variant="rectangular" width="100%" height="100%" sx={{ position: "absolute", top: 0, left: 0, height: "100%", width: "100%" }} />
              ) : coverUrl ? (
                <Image
                  src={coverUrl}
                  alt="Cover"
                  width={1200}
                  height={192}
                  className="object-cover w-full h-full"
                  style={{ height: "100%" }}
                  unoptimized
                />
              ) : null}
              <button
                className="absolute top-4 right-4 bg-white border border-blue-300 text-blue-600 hover:bg-blue-50 rounded-full p-2 shadow"
                title="Change cover photo"
                onClick={() => handleCameraClick("cover")}
                disabled={uploadingCover}
              >
                <Camera className="w-5 h-5" />
              </button>
            </div>
            <div className="px-6 pb-6 relative">
              <div className="absolute -top-16 left-6 w-32 h-32 bg-white rounded-full">
                <div className="relative w-full h-full">
                  <div className="w-full h-full rounded-full bg-white border-4 border-white flex items-center justify-center overflow-hidden">
                    {uploadingAvatar ? (
                      <>
                        <Skeleton variant="circular" width={128} height={128} />
                        <div className="absolute inset-0 flex items-center justify-center bg-white/60">
                          <div className="w-10 h-10 border-4 border-blue-400 border-t-transparent border-b-transparent rounded-full animate-spin"></div>
                        </div>
                      </>
                    ) : avatarUrl ? (
                      <Image
                        src={avatarUrl}
                        alt="Avatar"
                        width={128}
                        height={128}
                        className="w-full h-full rounded-full object-cover"
                        unoptimized
                      />
                    ) : (
  
                      <div className="w-full h-full flex items-center justify-center bg-blue-100 rounded-full">
                        <span className="text-4xl font-bold text-blue-600 select-none">
                          {getInitials(
                            [employer?.first_name, employer?.last_name]
                              .filter(Boolean)
                              .join(" ")
                          )}
                        </span>
                      </div>
                    )}
                  </div>
                  <button
                    className="absolute top-0 right-0 translate-x-1/4 -translate-y-1/4 bg-white border border-blue-300 text-blue-600 hover:bg-blue-50 rounded-full p-2 shadow"
                    title="Change profile picture"
                    onClick={() => handleCameraClick("avatar")}
                    disabled={uploadingAvatar}
                  >
                    <Camera className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="ml-36 pt-4 flex justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-2xl font-bold">
                      {employer
                        ? `${employer.first_name ?? ""} ${employer.last_name ?? ""}`
                        : "Employer Name"}
                    </h1>
                    <div className="relative flex items-center">
                      <CustomTooltip
                        title={
                          employer?.verify_status === "full"
                            ? "Fully verified and trusted company"
                            : employer?.verify_status === "standard"
                            ? "Partially verified, exercise some caution"
                            : "Not verified, proceed carefully"
                        }
                        arrow
                        open={tooltipOpen}
                      >
                        <div className="flex items-center relative">
                          {(() => {
                            let badge, pillText, pillBg, pillTextColor, pillWidth
                            if (employer?.verify_status === "full") {
                              badge = (
                                <motion.span
                                  className="bg-gradient-to-r from-blue-600 to-purple-500 bg-clip-text cursor-default"
                                  whileHover={{ scale: 1.18 }}
                                  transition={{ type: "spring", stiffness: 340, damping: 16 }}
                                  onMouseEnter={() => {
                                    if (tooltipTimer.current) clearTimeout(tooltipTimer.current)
                                    tooltipTimer.current = setTimeout(() => setTooltipOpen(true), 2000)
                                  }}
                                  onMouseLeave={() => {
                                    if (tooltipTimer.current) {
                                      clearTimeout(tooltipTimer.current)
                                      tooltipTimer.current = null
                                    }
                                    setTooltipOpen(false)
                                  }}
                                  style={{ display: "inline-flex", zIndex: 1 }}
                                >
                                  <HiBadgeCheck className="w-6 h-6 text-blue-600" />
                                </motion.span>
                              )
                              pillText = "Fully Verified"
                              pillBg = "bg-gradient-to-r from-blue-100 to-purple-100"
                              pillTextColor = "text-blue-700"
                              pillWidth = 110
                            } else if (employer?.verify_status === "standard") {
                              badge = (
                                <motion.span
                                  className="cursor-default"
                                  whileHover={{ scale: 1.18 }}
                                  transition={{ type: "spring", stiffness: 340, damping: 16 }}
                                  onMouseEnter={() => {
                                    if (tooltipTimer.current) clearTimeout(tooltipTimer.current)
                                    tooltipTimer.current = setTimeout(() => setTooltipOpen(true), 2000)
                                  }}
                                  onMouseLeave={() => {
                                    if (tooltipTimer.current) {
                                      clearTimeout(tooltipTimer.current)
                                      tooltipTimer.current = null
                                    }
                                    setTooltipOpen(false)
                                  }}
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
                              badge = (
                                <motion.span
                                  className="cursor-default"
                                  whileHover={{ scale: 1.18 }}
                                  transition={{ type: "spring", stiffness: 340, damping: 16 }}
                                  onMouseEnter={() => {
                                    if (tooltipTimer.current) clearTimeout(tooltipTimer.current)
                                    tooltipTimer.current = setTimeout(() => setTooltipOpen(true), 2000)
                                  }}
                                  onMouseLeave={() => {
                                    if (tooltipTimer.current) {
                                      clearTimeout(tooltipTimer.current)
                                      tooltipTimer.current = null
                                    }
                                    setTooltipOpen(false)
                                  }}
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
                                {badge}
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
                      </CustomTooltip>
                    </div>
                  </div>
                  <p className="text-gray-600">
                    {employer
                      ? `${employer.job_title ?? ""}${employer.company_name ? ` at ${employer.company_name}` : ""}`
                      : "Job Title at Company Name"}
                  </p>
                  <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
                    {editingBio ? (
                      <textarea
                        className="w-full bg-transparent focus:outline-none text-gray-600 resize-none px-1 py-1"
                        value={bio}
                        onChange={handleBioChange}
                        onBlur={handleBioBlur}
                        onKeyDown={handleBioKeyDown}
                        maxLength={50}
                        rows={1}
                        autoFocus
                        disabled={savingBio}
                      />
                    ) : (
                      <span
                        className={`cursor-pointer flex items-center ${!bio ? "text-gray-400" : ""}`}
                        onClick={() => setEditingBio(true)}
                      >
                        {bio || "Add a short bio"}
                        <Pencil className="w-4 h-4 ml-2 text-gray-400 hover:text-blue-600" />
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    className="rounded-full gap-2 border-blue-300 text-blue-600 hover:bg-blue-50 hover:text-blue-700"
                    onClick={() => router.push("/employers/profile/company")}
                  >
                    <Building2 className="w-4 h-4" />
                    View Company
                  </Button>
                </div>
              </div>

              <div className="flex items-end mt-6">
                <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                  <Tabs
                    value={activeTab}
                    onChange={handleTabChange}
                    textColor="primary"
                    indicatorColor="primary"
                    aria-label="profile tabs"
                    variant="scrollable"
                    scrollButtons="auto"
                  >
                    <Tab
                      label="About"
                      sx={{
                        textTransform: "capitalize",
                        fontWeight: 500,
                        fontSize: 14,
                        "&:hover": { color: "#2563eb" },
                      }}
                    />
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
          </>
        )}
      </div>

      {/* Tab Content Banner */}
      {!loading && (employer?.verify_status === "standard") && (
        <div className="w-full flex items-center px-6 py-4 mb-6 rounded-lg bg-[#f3e8ff]">
          <div className="flex items-center h-full mr-4">
            <RiErrorWarningLine className="h-12 w-12 text-[#7c3aed]" />
          </div>
          <div className="flex-1">
            <div className="text-[#6d28d9] font-semibold text-base mb-1">
              You&apos;re currently partially verified!
            </div>
            <div className="text-[#5b21b6] text-sm">
              Complete your verification to unlock more features, gain maximum visibility, and build the highest trust with candidates.{" "}
              <Button
                variant="ghost"
                className="font-bold underline ml-2 px-0 py-0 text-[#6d28d9] border-0 shadow-none bg-transparent hover:bg-transparent hover:underline cursor-pointer"
                onClick={() => router.push("/employers/verification/partially-verified")}
              >
                Verify Now
              </Button>
            </div>
          </div>
        </div>
      )}
      {!loading && (employer?.verify_status !== "full" && employer?.verify_status !== "standard") && (
        <div className="w-full flex items-center px-6 py-4 mb-6 rounded-lg bg-[#ffdbae]">
          <div className="flex items-center h-full mr-4">
            <PiWarningBold className="h-12 w-12 text-[#ea580c]" />
          </div>
          <div className="flex-1">
            <div className="text-[#ea580c] font-semibold text-base mb-1">
              Your account is not verified.
            </div>
            <div className="text-[#c2410c] text-sm">
              Please verify your account to unlock features, improve visibility, and gain trust from candidates.{" "}
              <Button
                variant="ghost"
                className="font-bold underline ml-2 px-0 py-0 text-[#ea580c] hover:text-orange-700 border-0 shadow-none bg-transparent hover:bg-transparent hover:underline cursor-pointer"
                onClick={() => router.push("/employers/verification/unverified")}
              >
                Verify Now
              </Button>
            </div>
          </div>
        </div>
      )}
      {/* Tab Content */}
      <div className="mb-8">
        {loading ? (
          <div>
            <Skeleton variant="rectangular" width="100%" height={200} />
          </div>
        ) : (
          <>
            {activeTab === 0 && <AboutTab />}
            {activeTab === 1 && <JobListingsTab />}
            {activeTab === 2 && <RatingsTab />}
          </>
        )}
      </div>
    </div>
  )
}
