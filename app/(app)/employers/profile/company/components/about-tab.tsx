"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { MapPin,  Mail, Phone, Calendar, Target, Award, Heart, Users, ShieldCheck, CheckCircle, Star, Pencil, Trash, Camera, Trophy, Medal, ThumbsUp, Rocket, User } from "lucide-react"
import { FaLinkedin, FaFacebook, FaTwitter, FaInstagram, FaGithub, FaYoutube, FaGlobe } from "react-icons/fa6"
import { SiIndeed } from "react-icons/si"
import Image from "next/image"
import AddCoreValueModal from "./modals/add-values"
import AddAchievementModal from "./modals/add-achievement"
import AddEditContactModal from "./modals/add-edit-contact"
import AvailabilityModal from "./modals/availability-modal"
import { useState, useEffect, useRef } from "react"

type CoreValue = {
  value: string
  icon: string
  iconColor: string
  paragraph: string
}

type Achievement = {
  title: string
  icon: string
  iconColor: string
  description: string
  issuer: string
  year: string
}

type Founder = {
  name: string
  title: string
  bio: string
  img: string | null
}

type BusinessHours = {
  days: string[]
  start: string
  end: string
  timezone: string
}

export default function AboutTab() {
  const [coreValues, setCoreValues] = useState<CoreValue[]>([])
  const [addOpen, setAddOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [editIndex, setEditIndex] = useState<number | null>(null)
  const [mission, setMission] = useState("")
  const [vision, setVision] = useState("")
  const [companyId, setCompanyId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [about, setAbout] = useState("")
  const [goals, setGoals] = useState<string[]>([])
  const [newGoal, setNewGoal] = useState("")
  const [editingGoalIdx, setEditingGoalIdx] = useState<number | null>(null)
  const [hqImgUrl, setHqImgUrl] = useState<string | null>(null)
  const [uploadingHQ, setUploadingHQ] = useState(false)
  const [hqBio, setHqBio] = useState("")
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [addAchievementOpen, setAddAchievementOpen] = useState(false)
  const [addCoreValueError, setAddCoreValueError] = useState<string | null>(null)
  const [founders, setFounders] = useState<Founder[]>([])
  const [editingFounderIdx, setEditingFounderIdx] = useState<number | null>(null)
  const [founderEdits, setFounderEdits] = useState<Partial<Founder>>({})
  const [founderImgUrls, setFounderImgUrls] = useState<(string | null)[]>([])
  const [contactEmail, setContactEmail] = useState<string | null>(null)
  const [contactNumber, setContactNumber] = useState<string | null>(null)
  const [companyWebsite, setCompanyWebsite] = useState<string | null>(null)
  const [companyAddress, setCompanyAddress] = useState<string | null>(null)
  const [countryCode, setCountryCode] = useState<string | null>(null)
  const [socials, setSocials] = useState<Record<string, string | null> | null>(null)
  const [editContactOpen, setEditContactOpen] = useState(false)
  const [editAvailabilityOpen, setEditAvailabilityOpen] = useState(false)
  const [businessHours, setBusinessHours] = useState<BusinessHours | null>(null)
  const hqBioRef = useRef<HTMLTextAreaElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const founderFileInputRefs = useRef<(HTMLInputElement | null)[]>([])
  const iconMap = { Heart, Award, Users, ShieldCheck, CheckCircle, Star, Trophy, Medal, ThumbsUp, Rocket }
  const [canEdit, setCanEdit] = useState(false)

  useEffect(() => {
    fetch("/api/employers/me")
      .then(res => res.json())
      .then(data => {
        if (typeof data?.edit_company_profile === "boolean") setCanEdit(data.edit_company_profile)
      })
  }, [])

  useEffect(() => {
    fetch("/api/employers/company-profile/getHandlers")
      .then(res => res.json())
      .then(async data => {
        if (data?.id) setCompanyId(data.id)
        if (data?.mission) setMission(data.mission)
        if (data?.vision) setVision(data.vision)
        if (Array.isArray(data?.core_values)) setCoreValues(data.core_values)
        if (data?.about) setAbout(data.about)
        if (Array.isArray(data?.goals)) setGoals(data.goals)
        if (data?.hq_img) {
          const urlRes = await fetch("/api/employers/get-signed-url", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ bucket: "company.images", path: data.hq_img }),
          })
          const urlData = await urlRes.json()
          if (urlData?.signedUrl) {
            setHqImgUrl(urlData.signedUrl + (urlData.signedUrl.includes('?') ? '&' : '?') + 't=' + Date.now())
          } else {
            setHqImgUrl(null)
          }
        } else {
          setHqImgUrl(null)
        }
        if (data?.hq_bio) setHqBio(data.hq_bio)
        if (Array.isArray(data?.achievements)) setAchievements(data.achievements)
        if (Array.isArray(data?.founders)) {
          let loadedFounders = data.founders
          if (loadedFounders.length < 2) {
            loadedFounders = [
              ...loadedFounders,
              ...Array(2 - loadedFounders.length).fill({ name: "", title: "", bio: "", img: null })
            ]
          }
          setFounders(loadedFounders)
          const urls = await Promise.all(
            loadedFounders.map(async (founder: Founder) => {
              if (founder.img) {
                const res = await fetch("/api/employers/get-signed-url", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ bucket: "company.images", path: founder.img }),
                })
                const urlData = await res.json()
                if (urlData?.signedUrl) {
                  return urlData.signedUrl + (urlData.signedUrl.includes('?') ? '&' : '?') + 't=' + Date.now()
                }
              }
              return null
            })
          )
          setFounderImgUrls(urls)
        } else {
          setFounders([
            { name: "", title: "", bio: "", img: null },
            { name: "", title: "", bio: "", img: null }
          ])
          setFounderImgUrls([null, null])
        }
        if (data?.contact_email) setContactEmail(data.contact_email)
        if (data?.contact_number) setContactNumber(data.contact_number)
        if (data?.company_website) setCompanyWebsite(data.company_website)
        if (data?.address) setCompanyAddress(data.address)
        if (data?.country_code) setCountryCode(data.country_code)
        if (data?.socials) setSocials(data.socials)
        if (data?.company_website) {
          setSocials(socials => {
            const prevObj = socials || {}
            if (!prevObj.website || prevObj.website !== data.company_website) {
              return { ...prevObj, website: data.company_website }
            }
            return prevObj
          })
        }
        if (data?.business_hours) setBusinessHours(data.business_hours as BusinessHours)
      })
  }, [])

  async function saveMissionVision() {
    if (!companyId) return
    setSaving(true)
    await fetch("/api/employers/company-profile/postHandlers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        company_id: companyId,
        mission,
        vision,
        action: "update_mission_vision"
      }),
    })
    setSaving(false)
  }

  async function saveCoreValues(values: CoreValue[]) {
    if (!companyId) return
    setSaving(true)
    await fetch("/api/employers/company-profile/postHandlers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        company_id: companyId,
        core_values: values,
        action: "update_core_values"
      }),
    })
    setSaving(false)
  }

  async function saveAbout() {
    if (!companyId) return
    setSaving(true)
    await fetch("/api/employers/company-profile/postHandlers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        company_id: companyId,
        about,
        action: "update_about"
      }),
    })
    setSaving(false)
  }

  async function saveGoals(updatedGoals: string[]) {
    if (!companyId) return
    setSaving(true)
    await fetch("/api/employers/company-profile/postHandlers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        company_id: companyId,
        goals: updatedGoals,
        action: "update_goals"
      }),
    })
    setSaving(false)
  }

  async function uploadHQImg(file: File) {
    if (!companyId) return
    setUploadingHQ(true)
    const formData = new FormData()
    formData.append("file", file)
    formData.append("company_id", companyId)
    formData.append("type", "hq_img")
    const res = await fetch("/api/employers/company-profile/upload", {
      method: "POST",
      body: formData,
    })
    const data = await res.json()
    if (data?.filePath) {
      const urlRes = await fetch("/api/employers/get-signed-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bucket: "company.images", path: data.filePath }),
      })
      const urlData = await urlRes.json()
      if (urlData?.signedUrl) {
        setHqImgUrl(urlData.signedUrl + (urlData.signedUrl.includes('?') ? '&' : '?') + 't=' + Date.now())
      }
    }
    setUploadingHQ(false)
  }

  async function saveHqBio() {
    if (!companyId) return
    setSaving(true)
    await fetch("/api/employers/company-profile/postHandlers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        company_id: companyId,
        hq_bio: hqBio,
        action: "update_hq_bio"
      }),
    })
    setSaving(false)
  }

  async function saveAchievements(updated: Achievement[]) {
    if (!companyId) return
    setSaving(true)
    await fetch("/api/employers/company-profile/postHandlers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        company_id: companyId,
        achievements: updated,
        action: "update_achievements"
      }),
    })
    setSaving(false)
  }

  async function saveFounders(updated: Founder[]) {
    if (!companyId) return
    setSaving(true)
    await fetch("/api/employers/company-profile/postHandlers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        company_id: companyId,
        founders: updated,
        action: "update_founders"
      }),
    })
    setSaving(false)
  }

  async function uploadFounderImg(idx: number, file: File) {
    if (!companyId) return
    setUploadingHQ(true)
    const founderKey = idx === 0 ? "founder" : `founder_${idx + 1}`
    const formData = new FormData()
    formData.append("file", file)
    formData.append("company_id", companyId)
    formData.append("type", "founder_img")
    formData.append("founder_idx", idx.toString())
    formData.append("founder_key", founderKey)
    const res = await fetch("/api/employers/company-profile/upload", {
      method: "POST",
      body: formData,
    })
    const data = await res.json()
    let imgPath = null
    if (data?.filePath) {
      imgPath = data.filePath

      const urlRes = await fetch("/api/employers/get-signed-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bucket: "company.images", path: imgPath }),
      })
      const urlData = await urlRes.json()
      setFounderImgUrls(urls => {
        const updated = [...urls]
        updated[idx] = urlData?.signedUrl
          ? urlData.signedUrl + (urlData.signedUrl.includes('?') ? '&' : '?') + 't=' + Date.now()
          : null
        return updated
      })
    }
    setFounders(f => {
      const updated = [...f]
      updated[idx] = { ...updated[idx], img: imgPath }
      saveFounders(updated)
      return updated
    })
    setUploadingHQ(false)
  }

  async function saveBusinessHours(hours: BusinessHours) {
    if (!companyId) return
    setSaving(true)
    await fetch("/api/employers/company-profile/postHandlers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        company_id: companyId,
        business_hours: hours,
        action: "update_business_hours"
      }),
    })
    setBusinessHours(hours)
    setSaving(false)
  }

  const maxFounders = 4

  function getDisplayFounders(founders: Founder[]) {
    const arr = [...founders]
    while (arr.length < maxFounders) {
      arr.push({ name: "", title: "", bio: "", img: null })
    }
    return arr
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const _suppressUnusedHqImg = hqImgUrl

  return (
    <div className="space-y-6">
      {/* Overview Section */}
      <div className="bg-white rounded-xl shadow-md mb-6 overflow-hidden border border-blue-200">
        <div className="flex justify-between items-center p-4 border-b border-blue-100 bg-gradient-to-r from-blue-50 to-blue-100">
          <h2 className="text-blue-700 font-semibold text-lg flex items-center gap-2">
            <Target className="text-blue-600" size={20} />
            Overview
          </h2>
        </div>
        <div className="p-6 space-y-6">
          {/* Mission & Vision */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Mission</h3>
            <textarea
              className="w-full min-h-[80px] border border-blue-200 rounded-lg p-3 text-gray-700 focus:outline-none focus:border-blue-400"
              placeholder="Write your company mission here. Press Enter to save."
              value={mission}
              onChange={e => setMission(e.target.value)}
              onBlur={saveMissionVision}
              onKeyDown={e => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault()
                  saveMissionVision()
                }
              }}
              disabled={saving || !canEdit}
            />
            <h3 className="font-semibold text-lg mt-6">Vision</h3>
            <textarea
              className="w-full min-h-[80px] border border-blue-200 rounded-lg p-3 text-gray-700 focus:outline-none focus:border-blue-400"
              placeholder="Share your company vision here. Press Enter to save."
              value={vision}
              onChange={e => setVision(e.target.value)}
              onBlur={saveMissionVision}
              onKeyDown={e => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault()
                  saveMissionVision()
                }
              }}
              disabled={saving || !canEdit}
            />
          </div>

          {/* Core Values */}
          <div className="mt-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-lg">Core Values</h3>
              <span className="text-sm text-gray-400">{coreValues.length}/6 max values</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {coreValues.map((v, i) => {
                const Icon = iconMap[v.icon as keyof typeof iconMap] || Heart
                return (
                  <Card key={i} className={`border relative`} style={{ borderColor: v.iconColor }}>
                    <button
                      type="button"
                      className={`absolute top-2 right-9 p-1 rounded-full transition-colors ${canEdit ? "hover:bg-blue-50" : "opacity-40 pointer-events-none"}`}
                      onClick={() => {
                        if (canEdit) {
                          setEditIndex(i)
                          setEditOpen(true)
                        }
                      }}
                      aria-label="Edit core value"
                      style={!canEdit ? { cursor: "not-allowed" } : {}}
                      tabIndex={canEdit ? 0 : -1}
                    >
                      <Pencil className="w-4 h-4 text-blue-500" />
                    </button>
                    <button
                      type="button"
                      className={`absolute top-2 right-2 p-1 rounded-full transition-colors ${canEdit ? "hover:bg-red-50" : "opacity-40 pointer-events-none"}`}
                      onClick={async () => {
                        if (canEdit) {
                          const updated = coreValues.filter((_, idx) => idx !== i)
                          setCoreValues(updated)
                          await saveCoreValues(updated)
                        }
                      }}
                      aria-label="Delete core value"
                      style={!canEdit ? { cursor: "not-allowed" } : {}}
                      tabIndex={canEdit ? 0 : -1}
                    >
                      <Trash className="w-4 h-4 text-red-500" />
                    </button>
                    <CardContent className="p-4 flex flex-col items-center text-center">
                      <div
                        className="w-12 h-12 rounded-full flex items-center justify-center mb-3 mt-3"
                        style={{ background: v.iconColor + "22", color: v.iconColor }}
                      >
                        <Icon className="w-6 h-6" color={v.iconColor} />
                      </div>
                      <h4 className="font-medium mb-2">{v.value}</h4>
                      <p className="text-sm text-gray-600">{v.paragraph}</p>
                    </CardContent>
                  </Card>
                )
              })}
              {(coreValues.length < 6) && (
                <button
                  type="button"
                  onClick={() => canEdit && setAddOpen(true)}
                  className={`flex flex-col items-center justify-center border-2 border-dashed border-blue-200 rounded-xl min-h-[170px] bg-blue-50 transition-colors ${canEdit ? "hover:bg-blue-100" : "opacity-40 pointer-events-none"}`}
                  style={{ minHeight: 170, cursor: canEdit ? "pointer" : "not-allowed" }}
                  tabIndex={canEdit ? 0 : -1}
                  disabled={!canEdit}
                >
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mb-2">
                    <svg width={28} height={28} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path d="M12 5v14M5 12h14" strokeLinecap="round" />
                    </svg>
                  </div>
                  <span className="font-medium text-blue-700">Add Core Value</span>
                </button>
              )}
            </div>
            <AddCoreValueModal
              open={addOpen}
              onClose={() => {
                setAddOpen(false)
                setAddCoreValueError(null)
              }}
              onSave={async v => {
                const exists = coreValues.some(
                  x =>
                    x.value.trim().toLowerCase() === v.value.trim().toLowerCase()
                )
                if (exists) {
                  setAddCoreValueError("Core value already exists.")
                  return
                }
                setAddCoreValueError(null)
                const updated = coreValues.length < 6 ? [...coreValues, v] : coreValues
                setCoreValues(updated)
                await saveCoreValues(updated)
                setAddOpen(false)
              }}
              error={addCoreValueError}
            />
            <AddCoreValueModal
              open={editOpen}
              onClose={() => {
                setEditOpen(false)
                setEditIndex(null)
              }}
              onSave={async v => {
                const updated = coreValues.map((item, idx) => (idx === editIndex ? v : item))
                setCoreValues(updated)
                await saveCoreValues(updated)
                setEditOpen(false)
                setEditIndex(null)
              }}
              initial={editIndex !== null ? coreValues[editIndex] : undefined}
              editMode
            />
          </div>
        </div>
      </div>
      {/* About Company */}
      <div className="bg-white rounded-xl shadow-md mb-6 overflow-hidden border border-blue-200">
        <div className="flex justify-between items-center p-4 border-b border-blue-100 bg-gradient-to-r from-blue-50 to-blue-100">
          <h2 className="text-blue-700 font-semibold text-lg flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-blue-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
            About Company
          </h2>
        </div>
        <div className="p-6">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="md:w-1/3">
              <div className="relative rounded-xl overflow-hidden mb-4 group">
                <Image
                  src={
                    hqImgUrl
                      ? hqImgUrl
                      : "https://dbuyxpovejdakzveiprx.supabase.co/storage/v1/object/public/app.images/default-hq.png"
                  }
                  alt="Company headquarters"
                  width={300}
                  height={300}
                  className="w-full object-cover"
                  unoptimized
                  style={{
                    maxHeight: 470,
                    width: "100%",
                    objectFit: "cover",
                    objectPosition: "center top"
                  }}
                />
                {canEdit && (
                  <button
                    type="button"
                    className={`absolute bottom-2 right-2 bg-white/80 rounded-full p-2 shadow transition-colors flex items-center ${canEdit ? "hover:bg-blue-100" : "opacity-40 pointer-events-none"}`}
                    onClick={() => canEdit && fileInputRef.current?.click()}
                    disabled={uploadingHQ || !canEdit}
                    aria-label="Upload headquarters image"
                    style={!canEdit ? { cursor: "not-allowed" } : {}}
                    tabIndex={canEdit ? 0 : -1}
                  >
                    <Camera className="w-5 h-5 text-blue-600" />
                  </button>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  disabled={uploadingHQ || !canEdit}
                  onChange={e => {
                    if (e.target.files && e.target.files[0]) {
                      uploadHQImg(e.target.files[0])
                    }
                  }}
                />
              </div>
              <div className="text-center">
                <h3 className="font-semibold">Our Company</h3>
                <div className="relative w-full mt-1">
                  <textarea
                    ref={hqBioRef}
                    className="w-full bg-transparent focus:outline-none text-gray-600 resize-none px-1 py-1 text-sm text-center"
                    value={hqBio}
                    onChange={e => setHqBio(e.target.value)}
                    onBlur={saveHqBio}
                    onKeyDown={async e => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault()
                        if (hqBioRef.current) hqBioRef.current.blur()
                        await saveHqBio()
                      }
                    }}
                    maxLength={50}
                    rows={1}
                    placeholder="Write a short description here"
                    disabled={saving || !canEdit}
                    style={{ minHeight: "1.5em" }}
                  />
                </div>
              </div>
            </div>

            <div className="md:w-2/3 space-y-4">
              <h3 className="font-semibold text-lg ">About</h3>
              <textarea
                className="w-full border border-blue-200 rounded-lg p-3 text-gray-700 focus:outline-none focus:border-blue-400 resize-none"
                placeholder="Describe your company here. Press Enter to save."
                value={about}
                onChange={e => setAbout(e.target.value)}
                onBlur={saveAbout}
                onKeyDown={e => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault()
                    saveAbout()
                  }
                }}
                disabled={saving || !canEdit}
                wrap="soft"
                rows={Math.max(6, about.split('\n').length)}
                style={{
                  overflow: "hidden",
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word",
                  width: "100%",
                  maxWidth: "100%",
                  minWidth: "0",
                }}
              />
              <h3 className="font-semibold text-lg mt-6">Goals</h3>
              <ul className="list-disc pl-5 text-gray-600 space-y-2">
                {goals.map((goal, idx) => {
                  const maxGoalChars = 120;
                  return (
                    <li key={idx} className="flex items-start gap-2 p-0 m-0" style={{ listStylePosition: "outside" }}>
                      {editingGoalIdx === idx ? (
                        <form
                          className="flex-1 flex items-start"
                          onSubmit={async e => {
                            e.preventDefault()
                            setEditingGoalIdx(null)
                            await saveGoals(goals)
                          }}
                        >
                          <textarea
                            className="w-full bg-transparent border border-blue-200 rounded px-2 py-1 outline-none text-gray-700 leading-[1.5] align-top resize-none"
                            value={goal}
                            maxLength={maxGoalChars}
                            autoFocus
                            onChange={e => {
                              const updated = [...goals]
                              updated[idx] = e.target.value
                              setGoals(updated)
                            }}
                            onBlur={async () => {
                              setEditingGoalIdx(null)
                              await saveGoals(goals)
                            }}
                            disabled={saving || !canEdit}
                            wrap="soft"
                            ref={el => {
                              if (el) {
                                el.style.height = "auto";
                                el.style.height = el.scrollHeight + "px";
                              }
                            }}
                            style={{
                              background: "transparent",
                              border: "1px solid #bfdbfe",
                              boxShadow: "none",
                              lineHeight: "1.5",
                              width: "100%",
                              maxWidth: "100%",
                              minWidth: "0",
                              overflow: "hidden",
                              overflowX: "hidden",
                              whiteSpace: "pre-wrap",
                              wordBreak: "break-word",
                              height: "auto",
                              resize: "none",
                              verticalAlign: "top",
                            }}
                            spellCheck={false}
                          />
                          <button
                            type="button"
                            className={`ml-2 p-1 rounded-full transition-colors self-start ${canEdit ? "hover:bg-blue-50" : "opacity-40 pointer-events-none"}`}
                            onClick={() => canEdit && setEditingGoalIdx(null)}
                            aria-label="Cancel edit"
                            disabled={saving || !canEdit}
                            style={!canEdit ? { cursor: "not-allowed" } : {}}
                            tabIndex={canEdit ? 0 : -1}
                          >
                            {/* Optionally, use an X icon or just hide this button if not needed */}
                          </button>
                          <button
                            type="button"
                            className={`ml-2 p-1 rounded-full transition-colors self-start ${canEdit ? "hover:bg-red-50" : "opacity-40 pointer-events-none"}`}
                            onClick={async () => {
                              if (canEdit) {
                                const updated = goals.filter((_, i) => i !== idx)
                                setGoals(updated)
                                setEditingGoalIdx(null)
                                await saveGoals(updated)
                              }
                            }}
                            aria-label="Remove goal"
                            disabled={saving || !canEdit}
                            style={!canEdit ? { cursor: "not-allowed" } : {}}
                            tabIndex={canEdit ? 0 : -1}
                          >
                            <Trash className="w-4 h-4 text-red-500" />
                          </button>
                        </form>
                      ) : (
                        <div className="flex-1 flex items-start">
                          <span className="whitespace-pre-line break-words flex-1">{goal}</span>
                          <button
                            type="button"
                            className={`ml-2 p-1 rounded-full transition-colors self-start ${canEdit ? "hover:bg-blue-50" : "opacity-40 pointer-events-none"}`}
                            onClick={() => canEdit && setEditingGoalIdx(idx)}
                            aria-label="Edit goal"
                            disabled={saving || !canEdit}
                            style={!canEdit ? { cursor: "not-allowed" } : {}}
                            tabIndex={canEdit ? 0 : -1}
                          >
                            <Pencil className="w-4 h-4 text-blue-500" />
                          </button>
                          <button
                            type="button"
                            className={`ml-2 p-1 rounded-full transition-colors self-start ${canEdit ? "hover:bg-red-50" : "opacity-40 pointer-events-none"}`}
                            onClick={async () => {
                              if (canEdit) {
                                const updated = goals.filter((_, i) => i !== idx)
                                setGoals(updated)
                                await saveGoals(updated)
                              }
                            }}
                            aria-label="Remove goal"
                            disabled={saving || !canEdit}
                            style={!canEdit ? { cursor: "not-allowed" } : {}}
                            tabIndex={canEdit ? 0 : -1}
                          >
                            <Trash className="w-4 h-4 text-red-500" />
                          </button>
                        </div>
                      )}
                    </li>
                  );
                })}
              </ul>
              <form
                className="flex gap-2 mt-2"
                onSubmit={async e => {
                  e.preventDefault()
                  if (!newGoal.trim() || goals.length >= 6) return
                  const updated = [...goals, newGoal.trim()]
                  setGoals(updated)
                  setNewGoal("")
                  await saveGoals(updated)
                }}
              >
                <input
                  className="flex-1 border border-blue-200 rounded-lg p-2 text-gray-700 focus:outline-none focus:border-blue-400"
                  placeholder="Add a new goal..."
                  value={newGoal}
                  onChange={e => setNewGoal(e.target.value)}
                  disabled={saving || goals.length >= 6 || !canEdit}
                />
                <Button type="submit" disabled={saving || !newGoal.trim() || goals.length >= 6 || !canEdit}>
                  Add
                </Button>
              </form>
              {goals.length >= 6 && (
                <div className="text-xs text-red-500 mt-1">Maximum of 6 goals allowed.</div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Achievements & Awards */}
      <div className="bg-white rounded-xl shadow-md mb-6 overflow-hidden border border-blue-200">
        <div className="flex justify-between items-center p-4 border-b border-blue-100 bg-gradient-to-r from-blue-50 to-blue-100">
          <h2 className="text-blue-700 font-semibold text-lg flex items-center gap-2">
            <Award className="text-blue-600" size={20} />
            Company Achievements
          </h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {achievements.map((a, idx) => {
              const Icon = iconMap[a.icon as keyof typeof iconMap] || Award
              const capitalize = (s: string) => s ? s.charAt(0).toUpperCase() + s.slice(1) : ""
              return (
                <div key={idx} className="border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow relative">
                  <button
                    type="button"
                    className={`absolute top-2 right-9 p-1 rounded-full transition-colors ${canEdit ? "hover:bg-blue-50" : "opacity-40 pointer-events-none"}`}
                    onClick={() => {
                      if (canEdit) {
                        setAddAchievementOpen(true)
                        setEditIndex(idx)
                      }
                    }}
                    aria-label="Edit achievement"
                    style={!canEdit ? { cursor: "not-allowed" } : {}}
                    tabIndex={canEdit ? 0 : -1}
                  >
                    <Pencil className="w-4 h-4 text-blue-500" />
                  </button>
                  <button
                    type="button"
                    className={`absolute top-2 right-2 p-1 rounded-full transition-colors ${canEdit ? "hover:bg-red-50" : "opacity-40 pointer-events-none"}`}
                    onClick={async () => {
                      if (canEdit) {
                        const updated = achievements.filter((_, i) => i !== idx)
                        setAchievements(updated)
                        await saveAchievements(updated)
                      }
                    }}
                    aria-label="Delete achievement"
                    style={!canEdit ? { cursor: "not-allowed" } : {}}
                    tabIndex={canEdit ? 0 : -1}
                  >
                    <Trash className="w-4 h-4 text-red-500" />
                  </button>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 flex items-center justify-center rounded-full" style={{ background: a.iconColor + "22", color: a.iconColor }}>
                      <Icon className="w-6 h-6" color={a.iconColor} />
                    </div>
                    <div>
                      <h3 className="font-medium text-lg">{capitalize(a.title)}</h3>
                      <p className="text-sm text-gray-500">{capitalize(a.issuer)}{a.year ? `, ${a.year}` : ""}</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{a.description}</p>
                </div>
              )
            })}
            <div
              className={`border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col items-center justify-center cursor-pointer min-h-[200px] bg-blue-50 border-2 border-dashed border-blue-200 ${canEdit ? "" : "opacity-40 pointer-events-none"}`}
              style={{ minHeight: 170, cursor: canEdit ? "pointer" : "not-allowed" }}
              onClick={() => canEdit && (setAddAchievementOpen(true), setEditIndex(null))}
              tabIndex={canEdit ? 0 : -1}
              role="button"
              aria-disabled={!canEdit}
            >
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mb-3 mt-3">
                <Award className="w-6 h-6" />
              </div>
              <span className="font-medium text-blue-700 mb-1">Add Achievement</span>
              <span className="text-xs text-gray-400 text-center">Up to 6 achievements</span>
            </div>
          </div>
          <AddAchievementModal
            open={addAchievementOpen}
            onClose={() => {
              setAddAchievementOpen(false)
              setEditIndex(null)
            }}
            onSave={async (a: Achievement) => {
              let updated
              if (editIndex !== null && editIndex >= 0) {
                updated = achievements.map((item, idx) => (idx === editIndex ? a : item))
              } else {
                updated = [...achievements, a]
              }

              const key = (x: Achievement) => [x.title?.toLowerCase().trim(), x.issuer?.toLowerCase().trim(), x.year?.toString().trim()].join("|")
              const keys = updated.map(key)
              const hasDup = keys.length !== new Set(keys).size
              if (hasDup) {
                const err = new Error("Achievement already exists")
                err.message = "Achievement already exists"
                throw err
              }
              const res = await fetch("/api/employers/company-profile/postHandlers", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  company_id: companyId,
                  achievements: updated,
                  action: "update_achievements"
                }),
              })
              if (!res.ok) {
                const data = await res.json()
                if (data?.error?.includes("Achievement already exists")) {
                  const err = new Error("Achievement already exists")
                  err.message = "Achievement already exists"
                  throw err
                }
                throw new Error(data?.error || "Failed to save achievement")
              }
              setAchievements(updated)
              setEditIndex(null)
            }}
            initial={editIndex !== null ? achievements[editIndex] : undefined}
            editMode={editIndex !== null}
          />
        </div>
      </div>

      {/* Founders */}
      <div className="bg-white rounded-xl shadow-md mb-6 overflow-hidden border border-blue-200">
        <div className="flex justify-between items-center p-4 border-b border-blue-100 bg-gradient-to-r from-blue-50 to-blue-100">
          <h2 className="text-blue-700 font-semibold text-lg flex items-center gap-2">
            <Users className="text-blue-600" size={20} />
            Founders
          </h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {getDisplayFounders(founders).map((founder, idx) => (
              <div key={idx} className="flex items-start gap-4 relative">
                <div className="w-24 h-24 rounded-full overflow-hidden flex-shrink-0 relative group bg-gray-100 flex items-center justify-center">
                  {founder.img && founderImgUrls[idx] ? (
                    <Image
                      src={founderImgUrls[idx]!}
                      alt={founder.name || "Founder"}
                      width={96}
                      height={96}
                      className="object-cover"
                    />
                  ) : (
                    <User className="w-16 h-16 text-gray-300" />
                  )}
                  <button
                    type="button"
                    className={`absolute bottom-2 right-2 bg-white/80 rounded-full p-2 shadow transition-colors flex items-center ${canEdit ? "hover:bg-blue-100" : "opacity-40 pointer-events-none"}`}
                    onClick={() => canEdit && founderFileInputRefs.current[idx]?.click()}
                    disabled={uploadingHQ || !canEdit}
                    aria-label="Upload founder image"
                    style={!canEdit ? { cursor: "not-allowed" } : {}}
                    tabIndex={canEdit ? 0 : -1}
                  >
                    <Camera className="w-5 h-5 text-blue-600" />
                  </button>
                </div>
                <div className="flex-1">
                  {editingFounderIdx === idx ? (
                    <form
                      className="space-y-2"
                      onSubmit={async e => {
                        e.preventDefault()
                        const updated = founders.map((f, i) =>
                          i === idx
                            ? {
                                ...f,
                                ...founderEdits,
                                name: founderEdits.name ?? f.name,
                                title: founderEdits.title ?? f.title,
                                bio: founderEdits.bio ?? f.bio,
                              }
                            : f
                        )
                        setFounders(updated)
                        setEditingFounderIdx(null)
                        setFounderEdits({})
                        await saveFounders(updated)
                      }}
                    >
                      <input
                        className="w-full border border-blue-200 rounded-lg p-2 text-gray-700 focus:outline-none focus:border-blue-400 font-semibold text-lg"
                        value={founderEdits.name ?? founder.name}
                        onChange={e => setFounderEdits(ed => ({ ...ed, name: e.target.value }))}
                        maxLength={40}
                        disabled={saving || !canEdit}
                        placeholder="Founder Name"
                      />
                      <select
                        className="w-full border border-blue-200 rounded-lg p-2 text-gray-700 focus:outline-none focus:border-blue-400 text-sm"
                        value={founderEdits.title ?? founder.title}
                        onChange={e => setFounderEdits(ed => ({ ...ed, title: e.target.value }))}
                        disabled={saving || !canEdit}
                      >
                        <option value="">Select Title</option>
                        <option value="CEO & Co-Founder">CEO & Co-Founder</option>
                        <option value="CTO & Co-Founder">CTO & Co-Founder</option>
                        <option value="COO">COO</option>
                        <option value="CFO">CFO</option>
                        <option value="Founder">Founder</option>
                        <option value="Other">Other</option>
                      </select>
                      <textarea
                        className="w-full border border-blue-200 rounded-lg p-2 text-gray-700 focus:outline-none focus:border-blue-400 text-sm"
                        value={founderEdits.bio ?? founder.bio}
                        onChange={e => setFounderEdits(ed => ({ ...ed, bio: e.target.value }))}
                        maxLength={300}
                        rows={3}
                        disabled={saving || !canEdit}
                        placeholder="Short founder description"
                      />
                      <div className="flex gap-2 mt-1">
                        <Button type="submit" disabled={saving || !canEdit}>Save</Button>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            setEditingFounderIdx(null)
                            setFounderEdits({})
                          }}
                          disabled={saving || !canEdit}
                        >
                          Cancel
                        </Button>
                      </div>
                    </form>
                  ) : (
                    <>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-lg">
                          {founder.name || <span className="text-gray-400">Founder Name</span>}
                        </h3>
                        <button
                          type="button"
                          className={`ml-1 p-1 rounded-full transition-colors ${canEdit ? "hover:bg-blue-50" : "opacity-40 pointer-events-none"}`}
                          onClick={() => canEdit && setEditingFounderIdx(idx)}
                          aria-label="Edit founder"
                          disabled={saving || !canEdit}
                          style={!canEdit ? { cursor: "not-allowed" } : {}}
                          tabIndex={canEdit ? 0 : -1}
                        >
                          <Pencil className="w-4 h-4 text-blue-500" />
                        </button>
                        {(founder.name || founder.title || founder.bio || founder.img) && (
                          <button
                            type="button"
                            className={`ml-1 p-1 rounded-full transition-colors ${canEdit ? "hover:bg-red-50" : "opacity-40 pointer-events-none"}`}
                            onClick={async () => {
                              if (canEdit) {
                                setFounders(f => {
                                  const updated = f.map((item, i) =>
                                    i === idx ? { name: "", title: "", bio: "", img: null } : item
                                  )
                                  setFounderImgUrls(urls => urls.map((url, i) => (i === idx ? null : url)))
                                  saveFounders(updated)
                                  return updated
                                })
                              }
                            }}
                            aria-label="Delete founder"
                            disabled={saving || !canEdit}
                            style={!canEdit ? { cursor: "not-allowed" } : {}}
                            tabIndex={canEdit ? 0 : -1}
                          >
                            <Trash className="w-4 h-4 text-red-600" />
                          </button>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        {founder.title || <span className="text-gray-400">Title</span>}
                      </p>
                      <p className="text-sm text-gray-600">
                        {founder.bio || <span className="text-gray-400">Short founder description</span>}
                      </p>
                    </>
                  )}
                </div>
                <input
                  ref={el => {
                    founderFileInputRefs.current[idx] = el
                  }}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  disabled={uploadingHQ || !canEdit}
                  onChange={e => {
                    if (e.target.files && e.target.files[0]) {
                      uploadFounderImg(idx, e.target.files[0])
                    }
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Company Members Preview */}
      <div className="bg-white rounded-xl shadow-md mb-6 overflow-hidden border border-blue-200">
        <div className="flex justify-between items-center p-4 border-b border-blue-100 bg-gradient-to-r from-blue-50 to-blue-100">
          <h2 className="text-blue-700 font-semibold text-lg flex items-center gap-2">
            <Users className="text-blue-600" size={20} />
            Company Members
          </h2>
          <Button variant="link" className="text-blue-600">
            View All
          </Button>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="overflow-hidden border border-gray-200 hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-200 mb-3">
                      <Image
                        src="/placeholder.svg?height=64&width=64"
                        alt="Team member"
                        width={64}
                        height={64}
                        className="object-cover"
                      />
                    </div>
                    <div className="text-center">
                      <div className="font-medium text-sm">
                        {i === 1 ? "Alex Morgan" : i === 2 ? "Jessica Lee" : i === 3 ? "David Kim" : "Rachel Chen"}
                      </div>
                      <div className="text-xs text-gray-500">
                        {i === 1
                          ? "Head of Design"
                          : i === 2
                            ? "Senior Developer"
                            : i === 3
                              ? "Product Manager"
                              : "Marketing Lead"}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div className="bg-white rounded-xl shadow-md mb-6 overflow-hidden border border-blue-200">
        <div className="flex justify-between items-center p-4 border-b border-blue-100 bg-gradient-to-r from-blue-50 to-blue-100">
          <h2 className="text-blue-700 font-semibold text-lg flex items-center gap-2">
            <Mail className="text-blue-600" size={20} />
            Contact Information
          </h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 text-blue-600 flex items-center justify-center rounded-full">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800">Headquarters</p>
                  <p className="text-sm text-gray-600">{companyAddress || "Not set"}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 text-purple-600 flex items-center justify-center rounded-full">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800">Email</p>
                  <p className="text-sm text-gray-600">{contactEmail || "Not set"}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 text-green-600 flex items-center justify-center rounded-full">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800">Phone</p>
                  <p className="text-sm text-gray-600">
                    {contactNumber
                      ? (countryCode
                          ? `+${countryCode} ${contactNumber}`
                          : contactNumber)
                      : "Not set"}
                  </p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-800 mb-1">Socials</p>
                <div className="flex flex-wrap gap-4 items-center">
                  {socials && Object.entries(socials).some(([, value]) => value) ? (
                    SOCIALS.filter(s => socials[s.key]).map(s => {
                      const value = socials[s.key]
                      if (!value) return null
                      return (
                        <div key={s.key} className="flex flex-col items-center">
                          <a
                            href={value}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`w-9 h-9 flex items-center justify-center rounded-full ${s.color} ${s.text} hover:opacity-80 transition`}
                            title={`${s.label}: ${value}`}
                            style={{ textDecoration: "none" }}
                          >
                            {s.icon}
                          </a>
                          <a
                            href={value}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-1 text-xs font-medium hover:underline text-blue-700"
                            style={{ maxWidth: 80, textAlign: "center", wordBreak: "break-word" }}
                          >
                            {s.label}
                          </a>
                        </div>
                      )
                    })
                  ) : (
                    <span className="text-xs text-gray-400">No socials set</span>
                  )}
                </div>
              </div>

            </div>
            {/* Business Hours moved down */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-red-100 text-red-600 flex items-center justify-center rounded-full">
                  <Calendar className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-800 flex items-center">
                    Business Hours
                    <button
                      type="button"
                      className={`ml-2 p-1 rounded-full transition-colors ${canEdit ? "hover:bg-blue-50" : "opacity-40 pointer-events-none"}`}
                      onClick={() => canEdit && setEditAvailabilityOpen(true)}
                      aria-label="Edit business hours"
                      disabled={!canEdit}
                      tabIndex={canEdit ? 0 : -1}
                      style={!canEdit ? { cursor: "not-allowed" } : {}}
                    >
                      <Pencil className="w-4 h-4 text-blue-500" />
                    </button>
                  </p>
                  <p className="text-sm text-gray-600">
                    {businessHours
                      ? (() => {
                          const days = Array.isArray(businessHours.days) ? businessHours.days.join(", ") : "Not set"
                          const start = businessHours.start || "09:00"
                          const end = businessHours.end || "18:00"
                          const tz = businessHours.timezone || "PST"
                          return `${days}: ${start} - ${end} ${tz}`
                        })()
                      : "Monday - Friday: 9am - 6pm PST"}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-start mt-6">
            <Button
              variant="outline"
              className={`gap-2 ${canEdit ? "" : "opacity-40 pointer-events-none"}`}
              onClick={() => canEdit && setEditContactOpen(true)}
              disabled={!canEdit}
              tabIndex={canEdit ? 0 : -1}
              style={!canEdit ? { cursor: "not-allowed" } : {}}
            >
              <Pencil className="w-4 h-4" />
              Edit Contact Info
            </Button>
          </div>
          <AddEditContactModal
            open={editContactOpen}
            onClose={() => setEditContactOpen(false)}
            initial={{
              email: contactEmail || "",
              countryCode: countryCode || "",
              phone: contactNumber || "",
              website: companyWebsite || "",
              address: companyAddress || "",
              socials: (() => {
                const s = socials
                  ? Object.fromEntries(
                      Object.entries(socials).map(([k, v]) => [k, v || ""])
                    )
                  : {}
                if (companyWebsite && (!s.website || s.website !== companyWebsite)) {
                  s.website = companyWebsite
                }
                return s
              })(),
            }}
            onSave={data => {
              setContactEmail(data.email)
              setCountryCode(data.countryCode)
              setContactNumber(data.phone)
              setCompanyWebsite(data.website)
              setCompanyAddress(data.address)
              setSocials(() => {
                const updated = { ...data.socials }
                if (data.website) updated.website = data.website
                return updated
              })
            }}
          />
          <AvailabilityModal
            open={editAvailabilityOpen}
            onClose={() => setEditAvailabilityOpen(false)}
            initial={businessHours}
            onSave={async (hours: BusinessHours) => {
              await saveBusinessHours(hours)
              setEditAvailabilityOpen(false)
            }}
          />
        </div>
      </div>
    </div>
  )
}

const SOCIALS = [
  { key: "linkedin", label: "LinkedIn", icon: <FaLinkedin size={16} />, color: "bg-blue-100", text: "text-blue-600" },
  { key: "indeed", label: "Indeed", icon: <SiIndeed size={16} />, color: "bg-blue-900", text: "text-white" },
  { key: "facebook", label: "Facebook", icon: <FaFacebook size={16} />, color: "bg-blue-600", text: "text-white" },
  { key: "twitter", label: "Twitter", icon: <FaTwitter size={16} />, color: "bg-blue-400", text: "text-white" },
  { key: "instagram", label: "Instagram", icon: <FaInstagram size={16} />, color: "bg-pink-400", text: "text-white" },
  { key: "github", label: "GitHub", icon: <FaGithub size={16} />, color: "bg-gray-800", text: "text-white" },
  { key: "youtube", label: "YouTube", icon: <FaYoutube size={16} />, color: "bg-red-500", text: "text-white" },
  { key: "website", label: "Website", icon: <FaGlobe size={16} />, color: "bg-green-200", text: "text-green-700" }
]

