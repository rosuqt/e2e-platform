/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Mail,
  Phone,
  Globe,
  MapPin,
  Users,
  Award,
  Star,
  Building2,
} from "lucide-react"
import { FaLinkedin, FaFacebook, FaTwitter, FaInstagram, FaGithub, FaYoutube, FaTools, FaBug } from "react-icons/fa"
import Image from "next/image"
import { RatingsCards } from "./marquee-ratings"
import { Star as StarIcon } from "lucide-react"
import { useState, useEffect, useMemo } from "react"
import { useSession } from "next-auth/react"
import AddEditContactModal from "./add-edit-contact"
import { SiIndeed } from "react-icons/si"
import { motion } from "framer-motion"
import Tooltip from "@mui/material/Tooltip"
import { MdAdminPanelSettings } from "react-icons/md"
import { useRouter } from "next/navigation"


type SessionUser = {
  name?: string | null
  email?: string | null
  image?: string | null
  role?: string | null
  employerId?: string
}

type SocialLink = { key: string; url: string }
type ContactInfo = {
  email?: string
  countryCode?: string
  phone?: string
  socials?: SocialLink[]
  website?: string
} | null

type RegisteredEmployer = {
  email?: string
  phone?: string
  countryCode?: string
  company_email?: string
}
type RegisteredCompany = {
  company_website?: string
}

export default function AboutTab() {
  const { data: session } = useSession()
  const employerID = (session?.user as SessionUser)?.employerId
  const router = useRouter()

  const [about, setAbout] = useState("")
  const [hiringPhilosophy, setHiringPhilosophy] = useState("")
  const [contactInfo, setContactInfo] = useState<ContactInfo>(null)
  const [registeredEmployer, setRegisteredEmployer] = useState<RegisteredEmployer | null>(null)
  const [registeredCompany, setRegisteredCompany] = useState<RegisteredCompany | null>(null)
  const [contactModalOpen, setContactModalOpen] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)
  const [companyProfile, setCompanyProfile] = useState<Record<string, unknown> | null>(null)
  const [companyLoading, setCompanyLoading] = useState(true)
  const [companyError, setCompanyError] = useState<string | null>(null)
  const [teamMembers, setTeamMembers] = useState<Array<{
    id: string
    first_name?: string
    last_name?: string
    email?: string
    job_title?: string
    company_role?: string
    company_admin?: boolean
    profile_img?: string
  }>>([])
  const [teamLoading, setTeamLoading] = useState(true)
  const [teamError, setTeamError] = useState<string | null>(null)
  const [companyLogoUrl, setCompanyLogoUrl] = useState<string | null>(null)
  const [ratings, setRatings] = useState<any[]>([])
  const [ratingsLoading, setRatingsLoading] = useState(true)
  const [ratingsError, setRatingsError] = useState<string | null>(null)

  useEffect(() => {
    if (!employerID) return
    fetch(`/api/employers/employer-profile/getHandlers?employerID=${employerID}`)
      .then((res) => res.json())
      .then((data) => {
        setAbout(data.about || "")
        setHiringPhilosophy(data.hiring_philosophy || "")
        setContactInfo(data.contact_info as ContactInfo || null)
        setRegisteredEmployer(
          data.registered_employer
            ? {
                ...data.registered_employer,
                countryCode: data.registered_employer.country_code || data.registered_employer.countryCode,
                company_email: data.registered_employer.company_email
              }
            : null
        )
        setRegisteredCompany(data.registered_company || null)
      })
  }, [employerID, refreshKey])

  useEffect(() => {
    fetch("/api/employers/company-profile/getHandlers")
      .then(res => res.json())
      .then(async data => {
        if (data.error) {
          setCompanyError(data.error)
          setCompanyProfile(null)
        } else {
          setCompanyProfile(data)
          if (data?.company_logo_image_path) {
            if (typeof data.company_logo_image_path === "string" && data.company_logo_image_path.startsWith("http")) {
              setCompanyLogoUrl(data.company_logo_image_path)
            } else {
              const res = await fetch("/api/employers/get-signed-url", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ bucket: "company.logo", path: data.company_logo_image_path }),
              })
              if (res.ok) {
                const { signedUrl } = await res.json()
                setCompanyLogoUrl(signedUrl || null)
              } else {
                setCompanyLogoUrl(null)
              }
            }
          } else {
            setCompanyLogoUrl(null)
          }
        }
        setCompanyLoading(false)
      })
      .catch(() => {
        setCompanyError("Failed to load company info.")
        setCompanyLoading(false)
        setCompanyLogoUrl(null)
      })
  }, [])

  useEffect(() => {
    if (!companyProfile || typeof companyProfile.company_name !== "string") return
    setTeamLoading(true)
    setTeamError(null)
    fetch(`/api/employers/colleagues/fetchUsers?company_name=${encodeURIComponent(companyProfile.company_name)}`)
      .then(res => res.json())
      .then(async res => {
        if (res.error) {
          setTeamError(res.error)
          setTeamMembers([])
          setTeamLoading(false)
          return
        }
        const employees: {
          id: string
          first_name?: string
          last_name?: string
          email?: string
          job_title?: string
          company_role?: string
          company_admin?: boolean
          profile_img?: string
        }[] = Array.isArray(res.data) ? res.data : []
        const updated = await Promise.all(
          employees.map(async (emp) => {
            let profileImgUrl = emp.profile_img
            if (profileImgUrl && typeof profileImgUrl === "string" && !/^https?:\/\//.test(profileImgUrl)) {
              const r = await fetch("/api/employers/get-signed-url", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ bucket: "user.avatars", path: profileImgUrl }),
              })
              if (r.ok) {
                const { signedUrl } = await r.json()
                profileImgUrl = signedUrl || profileImgUrl
              }
            }
            return {
              ...emp,
              profile_img: profileImgUrl || "https://dbuyxpovejdakzveiprx.supabase.co/storage/v1/object/public/app.images//default-pfp.jpg",
            }
          })
        )
        setTeamMembers(updated)
        setTeamLoading(false)
      })
      .catch(() => {
        setTeamError("Failed to load team members.")
        setTeamLoading(false)
      })
  }, [companyProfile?.company_name])

  useEffect(() => {
    if (!employerID) return
    setRatingsLoading(true)
    setRatingsError(null)
    fetch(`/api/employers/fetchRatings`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setRatings(data)
        } else {
          setRatings([])
        }
        setRatingsLoading(false)
      })
      .catch(() => {
        setRatingsError("Failed to load ratings.")
        setRatings([])
        setRatingsLoading(false)
      })
  }, [employerID, refreshKey])

  const ratingsStats = useMemo(() => {
    if (!ratings || ratings.length === 0) return { avg: 0, count: 0 }
    const avg = (
      ratings.reduce((sum, r) => sum + (r.overall_rating || 0), 0) / ratings.length
    )
    return { avg: Math.round(avg * 10) / 10, count: ratings.length }
  }, [ratings])

  async function saveProfileField(field: "about" | "hiring_philosophy", value: string) {
    if (!employerID) return
    await fetch("/api/employers/employer-profile/postHandlers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ employerID, [field]: value }),
    })
  }

  async function saveContactInfo(data: ContactInfo) {
    if (!employerID) return
    await fetch("/api/employers/employer-profile/postHandlers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ employerID, contact_info: data }),
    })
    setContactInfo(data)
    setRefreshKey((k) => k + 1)
  }

  function handleAboutChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setAbout(e.target.value)
  }
  function handleAboutKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      saveProfileField("about", about)
    }
  }
  function handleHiringPhilosophyChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setHiringPhilosophy(e.target.value)
  }
  function handleHiringPhilosophyKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      saveProfileField("hiring_philosophy", hiringPhilosophy)
    }
  }

  const SOCIALS = [
    { key: "linkedin", icon: <FaLinkedin size={20} />, color: "bg-blue-100", text: "text-blue-600" },
    { key: "facebook", icon: <FaFacebook size={20} />, color: "bg-blue-600", text: "text-white" },
    { key: "twitter", icon: <FaTwitter size={20} />, color: "bg-blue-400", text: "text-white" },
    { key: "instagram", icon: <FaInstagram size={20} />, color: "bg-pink-400", text: "text-white" },
    { key: "github", icon: <FaGithub size={20} />, color: "bg-gray-800", text: "text-white" },
    { key: "youtube", icon: <FaYoutube size={20} />, color: "bg-red-500", text: "text-white" },
    { key: "indeed", icon: <SiIndeed size={20} />, color: "bg-blue-900", text: "text-white" },
    { key: "website", icon: <Globe className="w-5 h-5" />, color: "bg-green-200", text: "text-green-700" }
  ]

  return (
    <div className="space-y-6">
      {/* About Info */}
      <Card className="border-blue-200">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 border-b border-blue-100">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-blue-700 flex items-center gap-2">
                <Building2 className="text-blue-600" size={20} />
                About Info
              </CardTitle>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-green-100 px-3 py-1 rounded-full">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-green-700 font-medium">Active Recruiter</span>
              </div>
            </div>
          </div>
          <p className="text-sm text-gray-600 mt-1">Update your background and experience to reflect your career.</p>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          {/* Introduction */}
          <div>
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-600" />
              Introduction
            </h3>
            <textarea
              className="w-full p-3 border border-gray-300 rounded-lg text-sm text-gray-700 min-h-[100px] resize-none"
              placeholder="Write about your role and responsibilities. Press Enter to save."
              value={about}
              onChange={handleAboutChange}
              onKeyDown={handleAboutKeyDown}
            />
          </div>

          <Separator />

          {/* Hiring Philosophy */}
          <div>
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Award className="w-4 h-4 text-blue-600" />
              Hiring Philosophy
            </h3>
            <textarea
              className="w-full p-3 border border-gray-300 rounded-lg text-sm text-gray-700 min-h-[120px] resize-none"
              placeholder="Describe your hiring philosophy. Press Enter to save."
              value={hiringPhilosophy}
              onChange={handleHiringPhilosophyChange}
              onKeyDown={handleHiringPhilosophyKeyDown}
            />
          </div>

          <Separator />

        </CardContent>
      </Card>

      {/* Candidate Ratings */}
      <section className="bg-white rounded-lg shadow-sm border border-blue-200">
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 border-b border-blue-100 rounded-t-lg px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <StarIcon className="w-5 h-5 text-yellow-400" />
            <h2 className="text-lg font-semibold text-blue-700">Candidate Ratings</h2>
          </div>
          <button
            type="button"
            onClick={() => router.push("/employers/profile/company#ratings")}
            className="text-blue-600 hover:text-blue-800 font-medium text-sm px-4 py-2 border border-blue-200 rounded-md transition-colors"
          >
            View All Ratings
          </button>
        </div>
        <div className="p-6">
          <div className="bg-gray-50 p-4 rounded-lg mb-4">
            {ratingsLoading ? (
              <div className="text-center text-gray-500">Loading ratings...</div>
            ) : ratingsError ? (
              <div className="text-center text-red-500">{ratingsError}</div>
            ) : (
              <div className="flex items-center gap-2 mb-2">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className={`w-4 h-4 ${ratingsStats.avg >= star ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} />
                  ))}
                </div>
                <span className="text-sm font-medium">{ratingsStats.avg}/5</span>
              </div>
            )}
            <p className="text-xs text-gray-600">
              {ratingsStats.count > 0
                ? `Based on ${ratingsStats.count} candidate review${ratingsStats.count > 1 ? "s" : ""}`
                : "No candidate reviews yet"}
            </p>
          </div>
          <RatingsCards ratings={ratings} />
        </div>
      </section>

      {/* Company Association */}
      <Card className="border-blue-200">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 border-b border-blue-100">
          <CardTitle className="text-blue-700 flex items-center gap-2">
            <Building2 className="text-blue-600" size={18} />
            Company Association
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {companyLoading ? (
            <div className="text-center text-gray-500">Loading company info...</div>
          ) : companyError ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="text-[5rem] font-extrabold text-red-500 leading-none mb-2">404</div>
              <div className="flex flex-col items-center">
                <div className="flex items-center gap-2 mb-4 justify-center">
                  <FaTools className="w-7 h-7 text-red-500" />
                  <span className="text-red-600 font-semibold text-base text-center">
                    Woah! This page pulled a disappearing act.<br />
                    We can’t seem to find what you’re looking for — it might’ve wandered off!<br />
                    If you think this shouldn’t have happened, let us know so we can chase it down!
                  </span>
                </div>
                <Button
                  variant="ghost"
                  className="font-bold text-red-700 hover:text-red-900 hover:text-red-900 flex items-center gap-2 px-0 py-0"
                  onClick={() => window.open('https://github.com/allyzdev/e2e-platform/issues/new', '_blank')}
                >
                  <FaBug className="w-5 h-5 mr-1" />
                  Report Bug
                </Button>
              </div>
            </div>
          ) : companyProfile ? (
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-60 h-60 rounded-xl bg-gray-100 flex items-center justify-center overflow-hidden border-2 border-gray-200 relative">
                    <Image
                      src={companyLogoUrl || "/placeholder.svg"}
                      alt={typeof companyProfile?.company_name === "string" ? companyProfile.company_name as string : ""}
                      fill
                      sizes="240px"
                      style={{ objectFit: "contain" }}
                      unoptimized
                      onError={e => {
                        const target = e.target as HTMLImageElement
                        if (target.src && !target.src.endsWith("/placeholder.svg")) {
                          target.src = "/placeholder.svg"
                        }
                      }}
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-xl text-gray-900 mb-2">
                      {typeof companyProfile.company_name === "string" ? companyProfile.company_name : ""}
                    </h3>
                    <div className="flex flex-wrap gap-2 mb-3">
                      <Badge variant="secondary" className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {(() => {
                          let city = ""
                          if (typeof companyProfile.address === "string" && companyProfile.address) {
                            const parts = companyProfile.address.split(",").map((s: string) => s.trim())
                            city = parts[0] || ""
                          } else if (typeof companyProfile.exact_address === "string" && companyProfile.exact_address) {
                            const parts = companyProfile.exact_address.split(",").map((s: string) => s.trim())
                            city = parts[0] || ""
                          }
                          return city ? `${city}, Metro Manila` : "City, Metro Manila"
                        })()}
                      </Badge>
                      <Badge variant="outline">
                        {typeof companyProfile.company_industry === "string" && companyProfile.company_industry
                          ? companyProfile.company_industry.charAt(0).toUpperCase() + companyProfile.company_industry.slice(1)
                          : "Industry"}
                      </Badge>
                      <Badge variant="outline">
                        {typeof companyProfile.company_size === "string" && companyProfile.company_size
                          ? companyProfile.company_size
                          : "—"}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed mb-4">
                      {typeof companyProfile.about === "string" && companyProfile.about
                        ? companyProfile.about
                        : typeof companyProfile.mission === "string" && companyProfile.mission
                        ? companyProfile.mission
                        : "No company description."}
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-blue-300 text-blue-600 hover:bg-blue-50"
                      onClick={() => router.push("/employers/profile/company")}
                    >
                      View Company Profile
                    </Button>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-4 flex items-center gap-2">
                  <Users className="w-4 h-4 text-blue-600" />
                  Team Members
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  {teamLoading ? (
                    Array.from({ length: 4 }).map((_, i) => (
                      <div key={i} className="bg-blue-50 rounded-lg p-3 text-center animate-pulse">
                        <div className="w-12 h-12 rounded-full bg-gray-200 mb-2 mx-auto" />
                        <div className="h-4 w-20 bg-gray-200 rounded mx-auto mb-1" />
                        <div className="h-3 w-16 bg-gray-100 rounded mx-auto" />
                      </div>
                    ))
                  ) : teamError ? (
                    <div className="col-span-full text-center text-red-500">{teamError}</div>
                  ) : teamMembers.length === 0 ? (
                    <div className="col-span-full text-center text-gray-500">No team members found.</div>
                  ) : (
                    teamMembers.slice(0, 4).map((member) => (
                      <div key={member.id} className="bg-blue-50 rounded-lg p-3 text-center">
                        <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden mb-2 mx-auto">
                          <Image
                            src={member.profile_img || "https://dbuyxpovejdakzveiprx.supabase.co/storage/v1/object/public/app.images//default-pfp.jpg"}
                            alt={member.first_name || member.email || "Profile"}
                            width={48}
                            height={48}
                            className="object-cover w-full h-full"
                          />
                        </div>
                        <div className="text-sm font-medium text-gray-800 truncate">
                          {(member.first_name || "") + " " + (member.last_name || "")}
                          {member.company_admin && (
                            <Tooltip title="This employer is a company admin" placement="top" arrow>
                              <motion.span
                                whileHover={{ scale: 1.2 }}
                                className="inline-flex items-center ml-1 cursor-pointer"
                              >
                                <MdAdminPanelSettings className="text-blue-600" title="Admin" size={16} />
                              </motion.span>
                            </Tooltip>
                          )}
                        </div>
                        <div className="text-xs text-gray-500 truncate">{member.job_title || member.company_role}</div>
                      </div>
                    ))
                  )}
                </div>
                <Button variant="link" size="sm" className="text-blue-600 hover:text-blue-800 mt-3 w-full"
                  onClick={() => router.push("/employers/profile/company#team")}
                >
                  View All Team Members
                </Button>
              </div>
            </div>
          ) : null}
        </CardContent>
      </Card>

      {/* Contact Information */}
      <Card className="border-blue-200">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 border-b border-blue-100">
          <CardTitle className="text-blue-700 flex items-center gap-2">
            <Mail className="text-blue-600" size={18} />
            Contact Information
          </CardTitle>
          <p className="text-sm text-gray-600 mt-1">
            Keep your contact details up-to-date for candidates and networking.
          </p>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 text-blue-600 flex items-center justify-center rounded-full">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Email</p>
                  <p className="text-sm text-gray-600">
                    {contactInfo?.email ||
                      registeredEmployer?.email ||
                      <span className="text-gray-500">Set up your email</span>}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-100 text-green-600 flex items-center justify-center rounded-full">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Phone</p>
                  <p className="text-sm text-gray-600">
                    {registeredEmployer?.phone
                      ? `+${registeredEmployer.countryCode || ""} ${registeredEmployer.phone}`
                      : contactInfo?.phone
                      ? `+${contactInfo.countryCode || ""} ${contactInfo.phone}`
                      : <span className="text-gray-500">Set up your phone number</span>}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-100 text-gray-600 flex items-center justify-center rounded-full">
                  <Globe className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Company Website</p>
                  <p className="text-sm text-gray-600">
                    {registeredCompany?.company_website?.trim()
                      ? registeredCompany.company_website
                      : "Not provided"}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex flex-col h-full">
              <h4 className="font-semibold mb-4">Social Media</h4>
              <div className="flex gap-4 flex-wrap">
                {(contactInfo?.socials || []).filter((s: SocialLink) => s.key !== "website").map((s: SocialLink) => {
                  const social = SOCIALS.find((soc) => soc.key === s.key);
                  const url = s.url ? (s.url.startsWith("http") ? s.url : `https://${s.url}`) : undefined;
                  return (
                    <div key={s.key} className="flex flex-col items-center">
                      {url ? (
                        <a
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`w-12 h-12 flex items-center justify-center rounded-full ${social?.color ?? "bg-blue-100"} ${social?.text ?? "text-blue-600"}`}
                          style={{ textDecoration: "none" }}
                        >
                          {social?.icon}
                        </a>
                      ) : (
                        <div className={`w-12 h-12 flex items-center justify-center rounded-full ${social?.color ?? "bg-blue-100"} ${social?.text ?? "text-blue-600"}`}>
                          {social?.icon}
                        </div>
                      )}
                      {url ? (
                        <a
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs mt-2 font-medium text-black"
                          style={{ textDecoration: "none" }}
                        >
                          {s.key.charAt(0).toUpperCase() + s.key.slice(1)}
                        </a>
                      ) : (
                        <p className="text-xs mt-2 font-medium text-black">{s.key.charAt(0).toUpperCase() + s.key.slice(1)}</p>
                      )}
                    </div>
                  );
                })}
              </div>
              <Button
                variant="outline"
                size="sm"
                className="border-blue-300 text-blue-600 hover:bg-blue-50 mt-6 w-full"
                onClick={() => setContactModalOpen(true)}
              >
                Edit Contact Info
              </Button>
            </div>
          </div>
          <AddEditContactModal
            open={contactModalOpen}
            onClose={() => setContactModalOpen(false)}
            onSave={saveContactInfo}
            initial={{
              email: contactInfo?.email || registeredEmployer?.email || "",
              personal_email: registeredEmployer?.email || "", 
              countryCode: contactInfo?.countryCode || registeredEmployer?.countryCode || "",
              phone: contactInfo?.phone || registeredEmployer?.phone || "",
              socials: contactInfo?.socials || [],
              website: contactInfo?.website || registeredCompany?.company_website || "",
              company_email: registeredEmployer?.company_email
            }}
          />
        </CardContent>
      </Card>

    </div>
  )
}
