"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { TiDelete } from "react-icons/ti"
import { Trash2 } from "lucide-react"
import ViewCertModal from "../modals/view-cert"
import AddCertModal from "../modals/add-cert"
import { useSession } from "next-auth/react"

export default function SkillsPage() {
  type Cert = {
    title: string;
    issuer?: string;
    issueDate?: string;
    description?: string;
    attachmentUrl?: string;
    category?: string;
  };

  const [skills, setSkills] = useState<string[]>([])
  const [skillInput, setSkillInput] = useState("")
  const [showSkillInput, setShowSkillInput] = useState(false)
  const [deletingSkillIdx, setDeletingSkillIdx] = useState<number | null>(null)
  const [expertise, setExpertise] = useState<{ skill: string; mastery: number }[]>([])
  const [deletingExpertiseIdx, setDeletingExpertiseIdx] = useState<number | null>(null)
  const [certs, setCerts] = useState<Cert[]>([])
  const [deletingCertIdx, setDeletingCertIdx] = useState<number | null>(null)
  const [openAddCert, setOpenAddCert] = useState(false)
  const [openViewCert, setOpenViewCert] = useState(false)
  const [selectedCert, setSelectedCert] = useState<Cert | null>(null)
  const [signedCertUrl, setSignedCertUrl] = useState<string | null>(null)
  const { data: session } = useSession()

  useEffect(() => {
    const fetchProfile = async () => {
      const res = await fetch("/api/students/student-profile/getHandlers")
      if (!res.ok) return
      const data = await res.json()
      if (data.skills && Array.isArray(data.skills)) setSkills(data.skills)
      if (data.expertise && Array.isArray(data.expertise)) setExpertise(data.expertise)
      if (data.certs && Array.isArray(data.certs)) setCerts(data.certs)
    }
    fetchProfile()
  }, [])

  useEffect(() => {
    if (openViewCert && selectedCert?.attachmentUrl) {
      fetch(`/api/students/student-profile/getHandlers?file=${encodeURIComponent(selectedCert.attachmentUrl)}`)
        .then(res => res.json())
        .then(data => setSignedCertUrl(data.url || null))
        .catch(() => setSignedCertUrl(null))
    } else {
      setSignedCertUrl(null)
    }
  }, [openViewCert, selectedCert?.attachmentUrl])

  const addSkill = async (value: string) => {
    const skill = value.trim()
    if (!skill || skills.includes(skill) || skill.length > 20) return
    const newSkills = [skill, ...skills]
    setSkills(newSkills)
    setSkillInput("")
    setShowSkillInput(false)
    await fetch("/api/students/student-profile/postHandlers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ skills: newSkills }),
    })
  }

  const removeSkill = async (idx: number) => {
    setDeletingSkillIdx(idx)
    const newSkills = skills.filter((_, i) => i !== idx)
    setSkills(newSkills)
    try {
      await fetch("/api/students/student-profile/postHandlers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ skills: newSkills }),
      })
    } finally {
      setDeletingSkillIdx(null)
    }
  }

  const addExpertise = async (data: { skill: string; mastery: number }) => {
    const newExpertise = [data, ...expertise]
    setExpertise(newExpertise)
    await fetch("/api/students/student-profile/postHandlers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "expertise", data }),
    })
  }

  const removeExpertise = async (idx: number) => {
    setDeletingExpertiseIdx(idx)
    const exp = expertise[idx]
    const newExpertise = expertise.filter((_, i) => i !== idx)
    setExpertise(newExpertise)
    try {
      await fetch("/api/students/student-profile/userActions", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          expertiseSkill: exp.skill,
          expertiseMastery: exp.mastery,
        }),
      })
    } finally {
      setDeletingExpertiseIdx(null)
    }
  }

  const removeCert = async (idx: number) => {
    setDeletingCertIdx(idx)
    const cert = certs[idx]
    const newCerts = certs.filter((_, i) => i !== idx)
    setCerts(newCerts)
    try {
      await fetch("/api/students/student-profile/userActions", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: cert.title,
          issuer: cert.issuer,
          issueDate: cert.issueDate,
        }),
      })
    } finally {
      setDeletingCertIdx(null)
    }
  }

  return (
    <Card className="border-none shadow-none">
      <CardContent className="p-6">
        <h2 className="text-xl font-semibold mb-6">Skills & Expertise</h2>
        <div className="space-y-8">
          <div>
            <h3 className="text-lg font-medium mb-4">Skills</h3>
            <p className="text-sm text-gray-500 mb-3 -mt-2">Highlight your top skills to attract employers.</p>
            <div className="flex flex-wrap gap-2 mb-4">
              {showSkillInput ? (
                <input
                  type="text"
                  value={skillInput}
                  onChange={e => setSkillInput(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === "Enter") {
                      addSkill(skillInput)
                    } else if (e.key === "Escape") {
                      setShowSkillInput(false)
                      setSkillInput("")
                    }
                  }}
                  onBlur={() => { setShowSkillInput(false); setSkillInput("") }}
                  placeholder="Type then press Enter"
                  maxLength={20}
                  autoFocus
                  className="border border-blue-300 rounded-full px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                  style={{ minHeight: 32 }}
                />
              ) : (
                <Button
                  size="sm"
                  variant="outline"
                  className="border-blue-300 text-blue-600 hover:bg-blue-50 rounded-full px-4"
                  onClick={() => setShowSkillInput(true)}
                >
                  + Add Skill
                </Button>
              )}
              {skills.map((skill, idx) => (
                <span
                  key={skill}
                  className="relative flex items-center px-3 py-1 rounded-full text-sm font-medium shadow-sm bg-blue-100 text-blue-700"
                  style={{ minHeight: 32 }}
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => removeSkill(idx)}
                    className="ml-2 absolute -top-2 -right-2 w-5 h-5 flex items-center justify-center rounded-full text-red-500 hover:text-red-700 focus:outline-none"
                    style={{ fontSize: 16, lineHeight: 1 }}
                    tabIndex={-1}
                    disabled={deletingSkillIdx === idx}
                  >
                    <TiDelete size={16} />
                  </button>
                  {deletingSkillIdx === idx && (
                    <span className="absolute -bottom-4 left-1/2 -translate-x-1/2 text-xs text-red-500">
                      ...
                    </span>
                  )}
                </span>
              ))}
            </div>
          </div>
          <hr className="border-gray-300 my-6" />

          <div>
            <h3 className="text-lg font-medium mb-4">Expertise</h3>
            <p className="text-sm text-gray-500 mb-3 -mt-2">Showcase your technical expertise and areas of proficiency.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              {expertise.map((exp, idx) => (
                <div key={idx} className="flex flex-col gap-1">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <span className="inline-block w-3 h-3 bg-yellow-400 rounded-sm"></span>
                      <span className="font-medium text-gray-800">{exp.skill}</span>
                    </div>
                    <span className="text-xs text-blue-600 font-semibold">{exp.mastery}%</span>
                    <button
                      className="ml-2 flex items-center justify-center text-red-500 hover:text-red-700"
                      title="Delete Expertise"
                      onClick={() => removeExpertise(idx)}
                      style={{ marginLeft: 8 }}
                      disabled={deletingExpertiseIdx === idx}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <div className="w-full bg-blue-100 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${exp.mastery}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="text-left mt-2">
              <Button
                size="sm"
                variant="outline"
                className="border-blue-300 text-blue-600 hover:bg-blue-50"
                onClick={() => {
                  const skill = prompt("Expertise Skill?")
                  const mastery = Number(prompt("Mastery % (0-100)?"))
                  if (skill && !isNaN(mastery)) addExpertise({ skill, mastery })
                }}
              >
                + Add Expertise
              </Button>
            </div>
          </div>
          <hr className="border-gray-300 my-6" />

          <div>
            <h3 className="text-lg font-medium mb-4">Achievements</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-stretch">
              {certs.slice(0, 4).map((cert, idx) => (
                <div key={idx} className="border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow min-h-[232px] flex flex-col">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-12 h-12 bg-blue-100 text-blue-600 flex items-center justify-center rounded-full">
                      <span className="font-bold text-lg">C</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium text-lg text-gray-800">{cert.title}</h3>
                        {cert.category && (
                          <span className="ml-2 px-2 py-1 rounded bg-blue-50 text-blue-600 text-xs font-medium">{cert.category}</span>
                        )}
                      </div>
                      <div className="flex items-center text-sm text-gray-600 mt-1">
                        <span>{cert.issuer}</span>
                        {cert.issueDate && (
                          <>
                            <span className="mx-2 text-gray-400">|</span>
                            <span className="text-xs text-gray-500">{cert.issueDate}</span>
                          </>
                        )}
                      </div>
                    </div>
                    <button
                      className="ml-2 flex items-center justify-center text-red-500 hover:text-red-700"
                      title="Delete Certificate"
                      disabled={deletingCertIdx === idx}
                      onClick={() => removeCert(idx)}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                  {cert.description && (
                    <p className="text-sm text-gray-600 mt-2">
                      {cert.description}
                    </p>
                  )}
                  <div className="mt-auto flex w-full justify-end gap-2">
                    {cert.attachmentUrl ? (
                      <Button
                        size="sm"
                        className="w-full text-xs bg-blue-600 text-white hover:bg-blue-700 rounded px-3 py-1 flex items-center justify-center"
                        variant="default"
                        style={{ minHeight: 32 }}
                        onClick={() => {
                          setSelectedCert(cert)
                          setOpenViewCert(true)
                        }}
                      >
                        View Certificate
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        className="w-full text-xs border-blue-300 text-blue-600 hover:bg-blue-50"
                        variant="outline"
                        disabled
                      >
                        No Certificate
                      </Button>
                    )}
                  </div>
                  {deletingCertIdx === idx && (
                    <div className="text-xs text-red-500 mt-2 flex items-center gap-1">
                      ...
                    </div>
                  )}
                </div>
              ))}
              <div className="border-dashed border-2 border-gray-300 bg-gray-50 rounded-lg p-6 flex flex-col items-center justify-center hover:bg-gray-100 transition-colors cursor-pointer min-h-[232px] w-full"
                style={{ gridColumn: "span 1 / span 1" }}
                onClick={() => setOpenAddCert(true)}
              >
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 bg-blue-100 text-blue-600 flex items-center justify-center rounded-full">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="2"
                      stroke="currentColor"
                      className="w-6 h-6"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                  </div>
                  <p className="text-sm text-blue-600 mt-2">Add Achievement</p>
                </div>
              </div>
              <div className="flex flex-col items-center justify-center min-h-[232px] w-full"
                style={{ gridColumn: "span 1 / span 1" }}
              >
                <button
                  type="button"
                  className="flex flex-col items-center focus:outline-none"
                  onClick={() => window.location.href = "/students/profile?tab=skills-tab"}
                  tabIndex={0}
                  style={{ outline: "none" }}
                >
                  <span className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white hover:bg-blue-700 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                  <span className="text-xs text-blue-700 mt-1 font-medium">View All</span>
                </button>
              </div>
            </div>
            <AddCertModal
              open={openAddCert}
              onClose={() => setOpenAddCert(false)}
              onSave={cert => {
                setCerts(prev => [...prev, cert])
                setOpenAddCert(false)
              }}
            />
            <ViewCertModal
              open={openViewCert}
              onClose={() => setOpenViewCert(false)}
              cert={
                selectedCert
                  ? {
                      ...selectedCert,
                      attachment: null,
                      attachmentUrl: signedCertUrl || selectedCert.attachmentUrl || "",
                      student_id: (session?.user as { studentId?: string })?.studentId || "student_001",
                      issuer: selectedCert.issuer || "",
                      issueDate: selectedCert.issueDate || ""
                    }
                  : {
                      title: "",
                      issuer: "",
                      issueDate: "",
                      description: "",
                      attachment: null,
                      category: "",
                      attachmentUrl: "",
                      student_id: (session?.user as { studentId?: string })?.studentId || "student_001"
                    }
              }
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
