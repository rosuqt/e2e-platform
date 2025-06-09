"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {  Building2, Camera, Pencil } from "lucide-react"
import { HiBadgeCheck } from "react-icons/hi";

import AboutTab from "./components/about-tab"
import JobListingsTab from "./components/job-listings-tab"
import RatingsTab from "./components/ratings-tab"
import Tabs from "@mui/material/Tabs"
import Tab from "@mui/material/Tab"
import Box from "@mui/material/Box"
import router from "next/router"

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
        const avatar = await getSignedUrlIfNeeded(data?.profile_img, "user.avatars")
        const cover = await getSignedUrlIfNeeded(data?.cover_image, "user.covers")
        setAvatarUrl(avatar)
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
      if (fileType === "avatar") setAvatarUrl(signedUrl)
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

  const goToRatingsTab = () => setActiveTab(2)

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

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      {/* Profile Header */}
      <div className="bg-white rounded-xl overflow-hidden shadow-md mb-6 border border-blue-200">
        <div className="h-48 bg-gradient-to-r from-blue-500 to-blue-600 relative">
          {coverUrl ? (
            <img
              src={coverUrl}
              alt="Cover"
              className="object-cover w-full h-full"
              style={{ height: "100%" }}
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
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt="Avatar"
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-2xl select-none">
                    {employer
                      ? `${employer.first_name?.[0] ?? ""}${employer.last_name?.[0] ?? ""}`.toUpperCase()
                      : "KV"}
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
                    : "Kemlerina Vivi"}
                </h1>
                {employer?.verify_status === "verified" && (
                  <Badge className="ml-3 bg-blue-600 text-white font-medium flex items-center justify-start   gap-1 px-6 shadow-sm">
                    <HiBadgeCheck className="w-5 h-5 mr-1" /> Verified
                  </Badge>
                )}
              </div>
              <p className="text-gray-600">
                {employer
                  ? `${employer.job_title ?? ""}${employer.company_name ? ` at ${employer.company_name}` : ""}`
                  : "Senior HR Manager at TechCorp Inc."}
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
                    <Pencil className="w-4 h-4 ml-2 text-gray-400 hover:text-gray-600" />
                  </span>
                )}
              </div>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" className="rounded-full gap-2 border-blue-300 text-blue-600 hover:bg-blue-50"
              onClick={() => router.push("/employers/profile/company")}>
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
      </div>

      {/* Tab Content */}
      <div className="mb-8">
        {activeTab === 0 && <AboutTab goToRatingsTab={goToRatingsTab} />}
        {activeTab === 1 && <JobListingsTab />}
        {activeTab === 2 && <RatingsTab />}
      </div>

    </div>
  )
}
