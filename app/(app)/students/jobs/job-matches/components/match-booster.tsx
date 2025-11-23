"use client"

import { useMemo, useState, useEffect } from "react"
import { AnimatePresence, motion } from "framer-motion"
import dynamic from "next/dynamic"
import { SiCodemagic, SiStarship } from "react-icons/si"
import LiquidFillGauge from "react-liquid-gauge"
import { GiBrokenShield } from "react-icons/gi"
import rocketLoaderAnimation from "../../../../../../public/animations/space.json"
import skyAnimation from "../../../../../../public/animations/sky.json"
import flyingAnimation from "../../../../../../public/animations/rocket_loader.json"
import { useSession } from "next-auth/react"
import Tooltip from "@mui/material/Tooltip"
import SuccessMatch, { SkillAbsorptionAnimation } from "./success-match"

const Lottie = dynamic(() => import("lottie-react"), { ssr: false })

type Skill = {
  name: string
  selected: boolean
  completed: boolean
}

type Resource = {
  skill_id: string
  name: string
  title: string
  url: string
  description?: string
  level?: string
  completed?: boolean
}

type MatchBoosterPopupProps = {
  open: boolean
  onClose: () => void
  matchScore: number
  topSkills?: string[]
  resources?: Resource[]
  rocketAnimation?: unknown
  score?: number
}

export function useTopEmployerSkills() {
  const [skills, setSkills] = useState<string[] | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    async function load() {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch("/api/match-booster/checkSkills")
        if (!res.ok) throw new Error("failed")
        const json = await res.json()
        if (!cancelled) {
          setSkills(Array.isArray(json.skills) ? json.skills.map((s: { name: string }) => s.name) : null)
        }
      } catch {
        if (!cancelled) setError("failed")
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, []) 

  return { skills, loading, error }
}

export function useResourcesForSkills(selectedSkills: string[]) {
  const [resources, setResources] = useState<Resource[] | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [lastFetchedSkills, setLastFetchedSkills] = useState<string[]>([])

  useEffect(() => {
    if (
      selectedSkills.length === 0 || 
      JSON.stringify(selectedSkills) === JSON.stringify(lastFetchedSkills)
    ) {
      return
    }

    const fetchResources = async () => {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch("/api/match-booster/fetchResources", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ selectedSkills }),
        })
        if (!res.ok) throw new Error("Failed to fetch resources")
        const json = await res.json()
        setResources(json.resources || [])
        setLastFetchedSkills(selectedSkills)
      } catch {
        setError("Failed to fetch resources")
      } finally {
        setLoading(false)
      }
    }

    fetchResources()
  }, [selectedSkills, lastFetchedSkills]) 

  return { resources, loading, error }
}

const steps = ["Intro", "Skills", "Learning", "Success", "Done"] as const
type Step = 0 | 1 | 2 | 3 | 4

function SaveProgressModal({ open, onSave, onClose, loading }: { open: boolean, onSave: () => void, onClose: () => void, loading: boolean }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[70] flex items-center justify-center bg-black/40 backdrop-blur-sm px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white rounded-2xl shadow-2xl border border-blue-100 max-w-lg w-full min-h-[250px] p-0 flex flex-col"
            initial={{ scale: 0.96, y: 40, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.96, y: 40, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            <div className="relative">
              <div className="bg-blue-600 h-12 flex items-center justify-between px-6 rounded-t-2xl">
                <span className="text-white text-xs text-base">Closing Match Booster</span>
                <button
                  onClick={onClose}
                  className="absolute right-4 top-2 bg-white text-blue-600 rounded-full w-8 h-8 flex items-center justify-center hover:bg-blue-50"
                  aria-label="Close"
                  disabled={loading}
                >
                  <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
                    <path d="M6 6L14 14M14 6L6 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </button>
              </div>
            </div>
            <div className="flex gap-6 items-center p-8">
              <div className="flex flex-col items-center justify-center gap-4">
                <GiBrokenShield className="text-blue-500 w-16 h-16" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-blue-700 mb-2">Wait—don’t lose your boost!</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Want us to save your Match Booster progress so you can keep boosting later?
                </p>
                <div className="flex gap-3 justify-end mt-6">
                  <button
                    onClick={() => {
                      onClose()
                    }}
                    className="px-4 py-2 rounded-full border border-blue-600 bg-white text-blue-600 text-sm font-medium hover:bg-blue-50"
                    disabled={loading}
                  >
                    No thanks
                  </button>
                  <button
                    onClick={onSave}
                    className="px-4 py-2 rounded-full bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 flex items-center gap-2"
                    disabled={loading}
                  >
                    {loading ? (
                      <span className="w-5 h-5 border-2 border-white border-t-blue-600 rounded-full animate-spin"></span>
                    ) : (
                      <SiStarship className="w-5 h-5" />
                    )}
                    <span>Save Progress</span>
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function ResetProgressModal({ open, onConfirm, onClose, loading }: { open: boolean, onConfirm: () => void, onClose: () => void, loading: boolean }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[80] flex items-center justify-center bg-black/40 backdrop-blur-sm px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white rounded-2xl shadow-2xl border border-blue-100 max-w-lg w-full min-h-[200px] p-0 flex flex-col"
            initial={{ scale: 0.96, y: 40, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.96, y: 40, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            <div className="relative">
              <div className="bg-blue-600 h-12 flex items-center justify-between px-6 rounded-t-2xl">
                <span className="text-white text-base">Reset Progress</span>
                <button
                  onClick={onClose}
                  className="absolute right-4 top-2 bg-white text-blue-600 rounded-full w-8 h-8 flex items-center justify-center hover:bg-blue-50"
                  aria-label="Close"
                  disabled={loading}
                >
                  <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
                    <path d="M6 6L14 14M14 6L6 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </button>
              </div>
            </div>
            <div className="flex flex-col gap-6 items-center p-8">
              <div className="flex flex-col items-center justify-center gap-4">
                <GiBrokenShield className="text-blue-500 w-16 h-16" />
              </div>
              <div className="flex-1 text-center">
                <h3 className="text-lg font-semibold text-blue-700 mb-2">Are you sure?</h3>
                <p className="text-sm text-gray-600 mb-4">
                  This will clear all your Match Booster progress and start over from the beginning.
                </p>
                <div className="flex gap-3 justify-center mt-6">
                  <button
                    onClick={onClose}
                    className="px-4 py-2 rounded-full border border-blue-600 bg-white text-blue-600 text-sm font-medium hover:bg-blue-50"
                    disabled={loading}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={onConfirm}
                    className="px-4 py-2 rounded-full bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 flex items-center gap-2"
                    disabled={loading}
                  >
                    {loading ? (
                      <span className="w-5 h-5 border-2 border-white border-t-blue-600 rounded-full animate-spin"></span>
                    ) : null}
                    <span>Yes, Reset Progress</span>
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export function MatchBoosterPopup({
  open,
  onClose,
  matchScore,
  topSkills,
  resources,
  rocketAnimation,
  score,
}: MatchBoosterPopupProps) {
  const { skills: serverSkills } = useTopEmployerSkills()
  const [step, setStep] = useState<Step>(0)
  const { data: session } = useSession()
  const [progressSkillNames, setProgressSkillNames] = useState<string[]>([])
  const [progressLoading, setProgressLoading] = useState(true)
  const [progressData, setProgressData] = useState<Record<string, string[]>>({})

  useEffect(() => {
    async function fetchStudentSkillProgress() {
      setProgressLoading(true)
      if (!session?.user?.studentId) {
        setProgressLoading(false)
        return
      }
      const res = await fetch("/api/match-booster/fetchProgress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentId: session.user.studentId }),
      })
      if (!res.ok) {
        setProgressLoading(false)
        return
      }
      const json = await res.json()
      if (Array.isArray(json.progress)) {
        const skillIds = json.progress.map((row: { skill_id: string }) => row.skill_id)
        const progressMap: Record<string, string[]> = {}
        json.progress.forEach((row: { skill_id: string; progress: string | { completed_levels: string[] } }) => {
          if (row.progress) {
            try {
              const parsed = typeof row.progress === "string" ? JSON.parse(row.progress) : row.progress
              if (Array.isArray(parsed.completed_levels)) {
                progressMap[row.skill_id] = parsed.completed_levels
              }
            } catch {}
          }
        })
        setProgressData(progressMap)
        if (skillIds.length > 0) {
          const namesRes = await fetch("/api/match-booster/fetchSkillNames", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ skillIds }),
          })
          if (!namesRes.ok) {
            setProgressLoading(false)
            return
          }
          const namesJson = await namesRes.json()
          if (Array.isArray(namesJson.names)) {
            setProgressSkillNames(namesJson.names)
          }
        }
      }
      setProgressLoading(false)
    }
    fetchStudentSkillProgress()
  }, [session?.user?.studentId])

  const effectiveTopSkills = useMemo(() => {
    if (topSkills && topSkills.length > 0) return topSkills
    if (serverSkills && serverSkills.length > 0) return serverSkills
    return []
  }, [topSkills, serverSkills])

  const [skills, setSkills] = useState<Skill[]>([])
  const [refetchSkillsFlag, setRefetchSkillsFlag] = useState(0)
  const [resetFlag, setResetFlag] = useState(0)

  useEffect(() => {
    if (progressLoading) return
    setSkills(prev =>
      effectiveTopSkills.map(s => {
        const prevSkill = prev.find(ps => ps.name === s)
        const autoSelected = progressSkillNames.includes(s)
        return prevSkill
          ? { ...prevSkill, selected: autoSelected || prevSkill.selected }
          : { name: s, selected: autoSelected, completed: false }
      })
    )
  }, [effectiveTopSkills, progressSkillNames, progressLoading, refetchSkillsFlag])

  const handleToggleSkill = (name: string) => {
    setSkills((prev) =>
      prev.map((s) =>
        s.name === name ? { ...s, selected: !s.selected } : s
      )
    )
  }

  const [resourceCompletion, setResourceCompletion] = useState<Record<string, boolean>>({})
  const [hasDbProgress, setHasDbProgress] = useState(false)
  const [dbResourceCompletion, setDbResourceCompletion] = useState<Record<string, boolean>>({})
  const selectedSkillsList = skills.filter((s) => s.selected)
  const selectedSkillNames = useMemo(
    () => selectedSkillsList.map((s) => s.name),
    [selectedSkillsList]
  )
  const { resources: dynamicResources, loading: resourcesLoading } = useResourcesForSkills(selectedSkillNames)

  useEffect(() => {
    async function checkDbProgress() {
      if (!session?.user?.studentId) {
        setHasDbProgress(false)
        setDbResourceCompletion({})
        return
      }
      const res = await fetch("/api/match-booster/fetchProgress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentId: session.user.studentId }),
      })
      if (!res.ok) {
        setHasDbProgress(false)
        setDbResourceCompletion({})
        return
      }
      const json = await res.json()
      setHasDbProgress(Array.isArray(json.progress) && json.progress.length > 0)
      const completion: Record<string, boolean> = {}
      if (Array.isArray(json.progress)) {
        json.progress.forEach((row: { skill_id: string; progress: string | { completed_levels: string[] } }) => {
          if (row.progress) {
            try {
              const parsed = typeof row.progress === "string" ? JSON.parse(row.progress) : row.progress
              if (Array.isArray(parsed.completed_levels)) {
                parsed.completed_levels.forEach((level: string) => {
                  const resourceList = resources && resources.length > 0 ? resources : dynamicResources || []
                  const resource = resourceList.find(
                    (r) => r.skill_id === row.skill_id && r.level === level
                  )
                  if (resource) {
                    completion[`${row.skill_id}-${resource.title}`] = true
                  }
                })
              }
            } catch {}
          }
        })
      }
      setDbResourceCompletion(completion)
    }
    if (open) checkDbProgress()
  }, [session?.user?.studentId, open, resources, dynamicResources])

  useEffect(() => {
    if (open && Object.keys(dbResourceCompletion).length > 0) {
      setResourceCompletion(prev => {
        const merged = { ...dbResourceCompletion, ...prev }
        return merged
      })
    }
  }, [dbResourceCompletion, open])

  const effectiveResources: Resource[] = useMemo(() => {
    const allResources = resources && resources.length > 0 ? resources : dynamicResources || []
    return allResources.map((r) => {
      const completedLevels = progressData[r.skill_id] || []
      const isCompleted = typeof r.level === "string" && completedLevels.includes(r.level)
      return {
        ...r,
        skill_id: r.skill_id,
        completed: isCompleted || resourceCompletion[`${r.skill_id}-${r.title}`] || false,
      }
    })
  }, [resources, dynamicResources, resourceCompletion, progressData])

  const filteredResources = useMemo(() => {
    if (selectedSkillNames.length === 0) return [];
    return effectiveResources.filter(r => selectedSkillNames.includes(r.name));
  }, [effectiveResources, selectedSkillNames]);

  const effectiveScore = score ?? matchScore
  const normalizedScore = Math.min(100, Math.max(0, effectiveScore))
  const effectiveRocketAnimation =
    rocketAnimation ?? rocketLoaderAnimation

  const mergedCompletion = useMemo(() => {
    return { ...dbResourceCompletion, ...resourceCompletion }
  }, [dbResourceCompletion, resourceCompletion])

  const completedSkills = selectedSkillsList.filter((s) => {
    const resourcesForSkill = effectiveResources.filter((r) => r.name === s.name)
    const easyCompleted = resourcesForSkill.some(
      (r) => r.level === "Easy" && mergedCompletion[`${r.skill_id}-${r.title}`]
    )
    const mediumCompleted = resourcesForSkill.some(
      (r) => r.level === "Medium" && mergedCompletion[`${r.skill_id}-${r.title}`]
    )
    const hardCompleted = resourcesForSkill.some(
      (r) => r.level === "Hard" && mergedCompletion[`${r.skill_id}-${r.title}`]
    )
    return easyCompleted && mediumCompleted && hardCompleted
  }).length

  const totalRequiredResources = selectedSkillsList.length * 3
  const completedResources = selectedSkillsList.reduce((acc, s) => {
    const resourcesForSkill = effectiveResources.filter((r) => r.name === s.name)
    return (
      acc +
      resourcesForSkill.filter(
        (r) =>
          (r.level === "Easy" || r.level === "Medium" || r.level === "Hard") &&
          mergedCompletion[`${r.skill_id}-${r.title}`]
      ).length
    )
  }, 0)

  const progressPercent = useMemo(
    () =>
      totalRequiredResources === 0
        ? 0
        : (completedResources / totalRequiredResources) * 100,
    [completedResources, totalRequiredResources]
  )

  const circleSize = 110
  const strokeWidth = 10
  const radius = (circleSize - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (normalizedScore / 100) * circumference

  const maxBoost = 20
  const estimatedBoost = Math.min(
    maxBoost,
    selectedSkillsList.length * 3
  )
  const estimatedTotal = Math.min(100, normalizedScore + estimatedBoost)

  const stepVariants = {
    initial: { opacity: 0, x: 40 },
    center: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -40 },
  }

  const skillResources = useMemo(() => {
    return selectedSkillsList.flatMap(skill => {
      const resourcesForSkill = filteredResources.filter(r => r.name === skill.name)
      return resourcesForSkill.map(resource => ({
        skill: skill.name,
        skill_id: resource.skill_id,
        resource,
      }))
    })
  }, [filteredResources, selectedSkillsList])

  const [showSaveModal, setShowSaveModal] = useState(false)
  const [showResetModal, setShowResetModal] = useState(false)
  const [resetting, setResetting] = useState(false)
  const [saving, setSaving] = useState(false)
  const [profileImgUrl, setProfileImgUrl] = useState<string | null>(null)
  useEffect(() => {
    async function fetchProfileImg() {
      if (step !== 3) return
      const res = await fetch("/api/match-booster/fetchProfilepic")
      if (res.ok) {
        const json = await res.json()
        setProfileImgUrl(json.signedUrl || null)
      }
    }
    fetchProfileImg()
  }, [step])

  const resetBoosterState = async () => {
    localStorage.setItem("openMatchBooster", "1")
    window.location.reload()
  }

  const handleClose = () => {
    if (hasUnsavedProgress) setShowSaveModal(true)
    else {
      resetBoosterState()
      onClose()
    }
  }
  const handleCancel = () => {
    if (hasUnsavedProgress) setShowSaveModal(true)
    else {
      resetBoosterState()
      onClose()
    }
  }
  const handleModalSave = async () => {
    setSaving(true)
    await handleSaveProgress()
    setSaving(false)
  }
  const handleModalNoThanks = () => {
    setShowSaveModal(false)
    resetBoosterState()
    onClose()
  }

  const handleResetProgress = async () => {
    setResetting(true)
    await fetch("/api/match-booster/resetProgress", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ studentId: session?.user?.studentId }),
    })
    setResetting(false)
    setShowResetModal(false)
    setStep(0)
    setProgressSkillNames([])
    setProgressData({})
    setSkills([])
    setResourceCompletion({})
  }

  const handleMarkCompleted = (skill_id: string, resourceTitle: string) => {
    setResourceCompletion((prev) => {
      const key = `${skill_id}-${resourceTitle}`
      const updated = { ...prev }
      updated[key] = !prev[key]
      return updated
    })
  }

  const handleContinue = async () => {
    const boosterPercent = estimatedTotal
    await fetch("/api/match-booster/addSkills", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        skills: selectedSkillNames,
        boosterPercent
      })
    })
    setStep(3)
  }

  function handleSaveProgress() {
    const selectedSkillObjs = skills.filter(s => s.selected)
    const progressDataArr = selectedSkillObjs.map(skill => {
      const resourcesForSkill = effectiveResources.filter(r => r.name === skill.name)
      const completedLevels = resourcesForSkill
        .filter(r => resourceCompletion[`${r.skill_id}-${r.title}`])
        .map(r => r.level)
        .filter(Boolean)
      return {
        skill_id: resourcesForSkill[0]?.skill_id,
        completed_levels: completedLevels
      }
    })
    .filter(d => d.skill_id && Array.isArray(d.completed_levels) && d.completed_levels.length > 0)
    return fetch("/api/match-booster/saveProgress", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ progress: progressDataArr })
    }).then(() => {
      setShowSaveModal(false)
      onClose()
    })
  }

  const hasProgress = useMemo(() => {
    return Object.values(resourceCompletion).some(Boolean) ||
      Object.values(progressData).some(arr => Array.isArray(arr) && arr.length > 0)
  }, [resourceCompletion, progressData])

  const completedSkillNames = useMemo(() => {
    return selectedSkillsList.filter((s) => {
      const resourcesForSkill = effectiveResources.filter((r) => r.name === s.name)
      const easyCompleted = resourcesForSkill.some(
        (r) => r.level === "Easy" && mergedCompletion[`${r.skill_id}-${r.title}`]
      )
      const mediumCompleted = resourcesForSkill.some(
        (r) => r.level === "Medium" && mergedCompletion[`${r.skill_id}-${r.title}`]
      )
      const hardCompleted = resourcesForSkill.some(
        (r) => r.level === "Hard" && mergedCompletion[`${r.skill_id}-${r.title}`]
      )
      return easyCompleted && mediumCompleted && hardCompleted
    }).map(s => s.name)
  }, [selectedSkillsList, effectiveResources, mergedCompletion])

  const hasUnsavedProgress = useMemo(() => {
    if (selectedSkillsList.length === 0) return false
    if (Object.entries(resourceCompletion).some(([key, val]) => val && !dbResourceCompletion[key])) return true
    // If there are selected skills not present in db progress, show warning
    const dbSkillNames = Object.keys(progressData).map(skill_id => {
      const skillObj = effectiveResources.find(r => r.skill_id === skill_id)
      return skillObj?.name
    }).filter(Boolean)
    return selectedSkillsList.some(s => !dbSkillNames.includes(s.name))
  }, [selectedSkillsList, resourceCompletion, dbResourceCompletion, progressData, effectiveResources])

  const noSkillsLeft = useMemo(() => {
    return effectiveTopSkills.length === 0
  }, [effectiveTopSkills])

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          >
            <motion.div
              className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-blue-100 overflow-hidden flex flex-col"
              initial={{ y: 40, opacity: 0, scale: 0.96 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 40, opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-gradient-to-r from-blue-500 via-blue-600 to-blue-500 px-6 py-4 text-white flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold flex items-center gap-2">
                    <span>⚡</span>
                    <span>Match Booster</span>
                  </h2>
                  <p className="mt-1 text-xs text-blue-100">
                    Here’s how you can get even better matches!
                  </p>
                </div>
                <div className="flex gap-2 items-center">
                  {hasDbProgress && step !== 0 && (
                    <button
                      onClick={() => setShowResetModal(true)}
                      className="text-xs px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 font-medium hover:bg-blue-100 flex items-center gap-2"
                      disabled={resetting}
                    >
                      {resetting ? (
                        <span className="w-4 h-4 border-2 border-blue-200 border-t-blue-700 rounded-full animate-spin"></span>
                      ) : null}
                      <span>Reset Progress</span>
                    </button>
                  )}
                  <button
                    onClick={handleClose}
                    className="text-xs px-3 py-1 rounded-full bg-white/10 border border-white/30 hover:bg-white/20"
                  >
                    Close
                  </button>
                </div>
              </div>

              <div className="px-6 pt-4 pb-1">
                <div className="mb-2 flex items-center justify-between">
                  <div className="flex gap-1">
                    {steps.map((label, idx) => (
                      <div
                        key={label}
                        className={`h-1.5 w-10 rounded-full ${
                          idx <= step ? "bg-blue-500" : "bg-blue-100"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-[11px] text-gray-400">
                    Step {step + 1} of {steps.length}
                  </span>
                </div>
                <div className="h-1 w-full rounded-full bg-blue-50 overflow-hidden">
                  <motion.div
                    className="h-full bg-blue-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercent}%` }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                  />
                </div>
              </div>
              <div
                className={`relative p-6 min-h-[380px] ${
                  step === 3 || step === 4 || noSkillsLeft ? "" : "flex-1 overflow-y-auto"
                }`}
              >
                {step === 4 && (
                  <div className="pointer-events-none absolute inset-0">
                    <Lottie
                      animationData={skyAnimation}
                      loop
                      autoplay
                    />
                  </div>
                )}
                {noSkillsLeft ? (
                  <div className="flex items-center justify-center min-h-[400px] bg-white rounded-2xl p-8 gap-8">
                    <div className="w-56 h-56 flex items-center justify-center">
                      <Lottie
                        animationData={flyingAnimation}
                        loop
                        autoplay
                      />
                    </div>
                    <div className="flex flex-col items-start justify-center gap-4">
                      <p className="text-2xl font-extrabold text-blue-700">You’ve Mastered Every Skill in Sight!</p>
                      <p className="text-sm text-gray-500 max-w-md">
                        Looks like you’ve learned it all — no new skills left for now. Come back later for fresh challenges!
                      </p>
                      <div className="w-full flex justify-center">
                        <button
                          onClick={onClose}
                          className="rounded-full bg-gradient-to-r from-blue-500 via-indigo-500 to-sky-400 text-white text-base font-bold py-3 px-8 hover:opacity-90 transition-colors"
                        >
                          Close Booster
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className={step === 3 || step === 4 ? "relative z-10" : ""}>
                    <AnimatePresence mode="wait">
                      {step === 0 && (
                        <>
                          <motion.div
                            key="step-intro"
                            variants={stepVariants}
                            initial="initial"
                            animate="center"
                            exit="exit"
                            transition={{ duration: 0.25, ease: "easeOut" }}
                            className="grid md:grid-cols-[1fr,1.15fr] gap-6 items-center"
                          >
                            {/* LEFT: Lottie animation */}
                            <div className="flex flex-col items-center justify-center">
                              <div className="w-68 h-68 mb-4">
                                <Lottie
                                  animationData={flyingAnimation}
                                  loop
                                  autoplay
                                />
                              </div>
                            </div>

                            {/* RIGHT: score + copy */}
                            <div className="flex flex-col items-center md:items-start gap-4">
                              <div className="space-y-4 w-full">
                                <p className="text-sm font-semibold text-blue-700 text-center md:text-left">
                                  Your Match Score: {normalizedScore}%
                                </p>
                                <div className="flex flex-col gap-4">
                                  <div className="flex items-center gap-4 justify-center md:justify-start">
                                    <div className="relative flex items-center justify-center shrink-0">
                                      <svg
                                        width={circleSize}
                                        height={circleSize}
                                        className="-rotate-90"
                                      >
                                        <circle
                                          cx={circleSize / 2}
                                          cy={circleSize / 2}
                                          r={radius}
                                          fill="transparent"
                                          stroke="#E5E7EB"
                                          strokeWidth={strokeWidth}
                                        />
                                        <motion.circle
                                          cx={circleSize / 2}
                                          cy={circleSize / 2}
                                          r={radius}
                                          fill="transparent"
                                          stroke="#3B82F6"
                                          strokeWidth={strokeWidth}
                                          strokeLinecap="round"
                                          strokeDasharray={circumference}
                                          strokeDashoffset={offset}
                                          initial={{ strokeDashoffset: circumference }}
                                          animate={{ strokeDashoffset: offset }}
                                          transition={{ duration: 0.8, ease: "easeOut" }}
                                        />
                                      </svg>
                                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                                        <span className="text-2xl font-bold text-blue-600 leading-none">
                                          {normalizedScore}%
                                        </span>
                                        <span className="mt-1 text-[11px] text-gray-500">
                                          Match Score
                                        </span>
                                      </div>
                                    </div>
                                    <div className="space-y-2 max-w-xs">
                                      <p className="text-xs text-gray-600">
                                        You already have a solid starting point. Let’s
                                        quickly boost your profile so employers can see your
                                        best skills.
                                      </p>
                                      <p className="text-xs text-blue-600">
                                        This will only take a few minutes and can lead to
                                        stronger, more relevant matches.
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </motion.div>

                          {/* BUTTON: spans under both columns, centered */}
                          <div className="mt-6 flex justify-center">
                            <motion.button
                              onClick={() => setStep(1)}
                              className="relative w-full max-w-xs px-3 py-2.5 rounded-full bg-gradient-to-r from-blue-500 via-indigo-500 to-sky-400 text-white text-sm font-medium shadow-sm flex items-center justify-center gap-2"
                              whileHover={{ scale: 1.03 }}
                              whileTap={{ scale: 0.97 }}
                            >
                              <SiCodemagic className="w-4 h-4" />
                              <span>Start Match Booster!</span>
                            </motion.button>
                          </div>
                        </>
                      )}

                      {step === 1 && (
                        <motion.div
                          key="step-skills"
                          variants={stepVariants}
                          initial="initial"
                          animate="center"
                          exit="exit"
                          transition={{ duration: 0.25, ease: "easeOut" }}
                          className="space-y-5"
                        >
                          {/* top card */}
                          <div className="rounded-2xl border border-blue-100 bg-blue-50/60 px-4 py-3 shadow-sm">
                            <p className="text-sm font-semibold text-blue-800">
                              Pick your power skills
                            </p>
                            <p className="mt-1 text-[11px] text-blue-700/80">
                              Choose a few skills you feel confident in or want to grow.
                              These are skills most employers are actively looking for
                              right now, and we’ll use them to personalize your learning
                              path and matches.
                            </p>
                          </div>

                          <div className="grid md:grid-cols-[1.1fr,1fr] gap-3 items-start">
                            <div className="rounded-2xl border border-blue-100 bg-white px-4 py-4 shadow-sm flex flex-col items-center justify-center mx-auto md:mx-0">
                              <div className="flex items-center gap-3">
                                <div className="w-32 h-32 mb-2 flex items-center justify-center">
                                  <LiquidFillGauge
                                    width={128}
                                    height={128}
                                    value={estimatedTotal}
                                    percent="%"
                                    textSize={0.9}
                                    textOffsetX={0}
                                    textOffsetY={0}
                                    riseAnimation
                                    waveAnimation
                                    waveFrequency={2}
                                    waveAmplitude={2}
                                    gradient
                                    circleStyle={{ fill: "#EFF6FF" }}
                                    waveStyle={{ fill: "#3B82F6" }}
                                    gradientStops={[
                                      { key: "0%", stopColor: "#3B82F6", stopOpacity: 1, offset: "0%" },
                                      { key: "50%", stopColor: "#8B5CF6", stopOpacity: 0.9, offset: "50%" },
                                      { key: "100%", stopColor: "#10B981", stopOpacity: 0.9, offset: "100%" },
                                    ]}
                                    textStyle={{
                                      fill: "#1F2933",
                                      fontFamily: "system-ui, sans-serif",
                                    }}
                                    waveTextStyle={{
                                      fill: "#F9FAFB",
                                      fontFamily: "system-ui, sans-serif",
                                    }}
                                  />
                                </div>
                                <div className="hidden md:flex flex-col items-start">
                                  <span className="text-xs text-gray-500">Approx boost</span>
                                  <span className="mt-0.5 inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700 border border-emerald-200">
                                    +{estimatedBoost} pts
                                  </span>
                                </div>
                              </div>
                              <div className="mt-2 md:hidden flex flex-col items-center">
                                <span className="text-[11px] text-gray-500">Approx boost</span>
                                <span className="mt-0.5 inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700 border border-emerald-200">
                                  +{estimatedBoost} pts
                                </span>
                              </div>
                              <p className="mt-2 text-xs font-semibold text-blue-700 text-center">
                                Estimated score after these skills: {estimatedTotal}%
                              </p>
                              <p className="mt-1 text-[11px] text-gray-500 text-center">
                                Each selected skill fills the gauge to approximate your potential match boost.
                              </p>
                              <p className="mt-1 text-[11px] text-blue-600">
                                Selected skills:{" "}
                                <span className="font-semibold">{selectedSkillsList.length}</span>
                              </p>
                            </div>

                            <div className="rounded-2xl border border-blue-100 bg-white px-4 py-3 shadow-sm">
                              <p className="text-[11px] font-medium text-gray-500 mb-2">
                                Tap to select or unselect skills that employers care
                                about most right now:
                              </p>
                              {progressLoading ? (
                                <div className="flex justify-center items-center h-16">
                                  <div className="w-6 h-6 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                                </div>
                              ) : (
                                <div className="flex flex-wrap gap-2">
                                  {skills.map((skill) => (
                                    <button
                                      key={skill.name}
                                      onClick={() => handleToggleSkill(skill.name)}
                                      className={`px-3 py-1.5 text-xs rounded-full border transition-colors ${
                                        skill.selected
                                          ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                                          : "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100"
                                    }`}
                                    >
                                      {skill.name}
                                    </button>
                                  ))}
                                </div>
                              )}
                              <p className="mt-2 text-[11px] text-gray-500">
                                Tip: Aim for{" "}
                                <span className="font-semibold text-blue-600">
                                  3–7 skills
                                </span>{" "}
                                so employers immediately see a focused set of in-demand
                                strengths.
                              </p>
                            </div>
                          </div>

                          {/* footer */}
                          <div className="flex items-center justify-between pt-1">
                            <p className="text-[11px] text-gray-500">
                              Estimated boost{" "}
                              <span className="font-semibold text-emerald-600">
                                +{estimatedBoost} pts
                              </span>
                            </p>
                            <div className="flex gap-2">
                              <button
                                onClick={handleCancel}
                                className="px-3 py-1.5 rounded-full border border-gray-200 text-xs text-gray-600 bg-white hover:bg-gray-50"
                              >
                                Cancel
                              </button>
                              <button
                                onClick={() => setStep(2)}
                                disabled={skills.length === 0}
                                className="px-4 py-1.5 rounded-full bg-blue-600 text-white text-xs font-medium hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed"
                              >
                                Next
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      )}

                      {step === 2 && (
                        <motion.div
                          key="step-learning"
                          variants={stepVariants}
                          initial="initial"
                          animate="center"
                          exit="exit"
                          transition={{ duration: 0.25, ease: "easeOut" }}
                          className="space-y-4"
                        >
                          {/* sticky overview header */}
                          <div className="sticky top-0 z-10 pb-3 bg-gradient-to-b from-white to-white/80 backdrop-blur-sm border-b border-blue-50 mb-1">
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                              <div>
                                <p className="text-sm font-semibold text-blue-700">
                                  Learn & Upskill
                                </p>
                                <p className="text-[11px] text-gray-500">
                                  Work through a few quick resources to turn{" "}
                                  <span className="font-semibold text-blue-600">
                                    selected skills
                                  </span>{" "}
                                  into finished strengths.
                                </p>
                              </div>
                              <div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-blue-50 border border-blue-100">
                                <div className="flex flex-col">
                                  <span className="text-[11px] text-gray-500">
                                    Completed skills
                                  </span>
                                  <span className="text-sm font-semibold text-blue-700">
                                    {completedSkills} / {selectedSkillsList.length || 0}
                                  </span>
                                </div>
                                <div className="h-8 w-px bg-blue-100" />
                                <div className="flex flex-col">
                                  <span className="text-[11px] text-gray-500">
                                    Progress
                                  </span>
                                  <div className="flex items-center gap-1">
                                    <div className="w-20 h-1.5 bg-blue-100 rounded-full overflow-hidden">
                                      <div
                                        className="h-full bg-blue-500 rounded-full transition-all"
                                        style={{ width: `${progressPercent}%` }}
                                      />
                                    </div>
                                    <span className="text-[11px] text-blue-600 font-medium">
                                      {Math.round(progressPercent)}%
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* body list */}
                          <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1 pt-1">
                            {resourcesLoading ? (
                              <div className="flex justify-center items-center h-full">
                                <div className="w-6 h-6 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                              </div>
                            ) : (
                              <>
                                <p className="text-[11px] text-gray-500 mb-1">
                                  Each skill comes with 3 resources—finish them all to officially mark your skill as learned!
                                </p>

                                {skillResources.map(({ skill, resource }, idx) => {
                                  const difficultyColor =
                                    resource.level === "Easy"
                                      ? "bg-green-100 text-green-600 border-green-200"
                                      : resource.level === "Medium"
                                      ? "bg-orange-100 text-orange-600 border-orange-200"
                                      : "bg-red-100 text-red-600 border-red-200";

                                  return (
                                    <div
                                      key={`${skill}-${idx}`}
                                      className={`rounded-2xl border px-4 py ${
                                        resource.completed
                                          ? "border-green-200 bg-green-50"
                                          : "border-blue-100 bg-blue-50/50"
                                    }`}
                                    >
                                      <div className="flex items-start justify-between gap-2">
                                        <div className="flex items-center gap-2">
                                          <div
                                            className={`h-7 w-7 rounded-full flex items-center justify-center text-[11px] font-semibold ${
                                              resource.completed
                                                ? "bg-green-500 text-white"
                                                : "bg-blue-600 text-white"
                                            }`}
                                          >
                                            {skill.charAt(0).toUpperCase()}
                                          </div>
                                          <div className="flex flex-col">
                                            <span className="text-xs font-semibold text-blue-800 flex items-center gap-2">
                                              {skill}
                                              <span
                                                className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${difficultyColor}`}
                                              >
                                                {resource.level}
                                              </span>
                                            </span>
                                            {resource.description && (
                                              <span className="text-[11px] text-gray-600 mt-0.5">
                                                {resource.description}
                                              </span>
                                            )}
                                          </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                          {resource.completed ? (
                                            <button
                                              onClick={() => {
                                                handleMarkCompleted(resource.skill_id, resource.title)
                                              }}
                                              className="text-[10px] px-2 py-0.5 rounded-full bg-green-50 text-green-600 border border-green-200 hover:bg-green-100"
                                            >
                                              Completed
                                            </button>
                                          ) : (
                                            <button
                                              onClick={() => {
                                                handleMarkCompleted(resource.skill_id, resource.title)
                                              }}
                                              className="text-[10px] px-2 py-0.5 rounded-full bg-white text-blue-600 border border-blue-200 hover:bg-blue-50"
                                            >
                                              Mark Done
                                            </button>
                                          )}
                                        </div>
                                      </div>
                                      <div className="mt-2 border-t border-white/60 pt-2">
                                        <ul className="space-y-1.5">
                                          <li className="flex flex-col gap-1.5">
                                            <div className="flex items-center gap-1.5">
                                              <span className="h-1.5 w-1.5 rounded-full bg-blue-400" />
                                              <a
                                                href={resource.url}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="text-[11px] text-blue-700 underline-offset-2 hover:underline"
                                              >
                                                {resource.title}
                                              </a>
                                            </div>
                                          </li>
                                        </ul>
                                      </div>
                                    </div>
                                  )
                                })}

                                {selectedSkillsList.length === 0 && (
                                  <div className="text-[11px] text-gray-400 italic mt-4">
                                    No skills selected yet. Go back and choose a few skills to start
                                    learning.
                                  </div>
                                )}
                              </>
                            )}
                          </div>

                          <div className="flex items-center justify-between pt-3">
                            <p className="text-[11px] text-gray-500">
                              Completed skills:{" "}
                              <span className="font-semibold text-blue-600">
                                {completedSkills}
                              </span>{" "}
                              / {selectedSkillsList.length}
                            </p>
                            <div className="flex gap-2">
                              <button
                                onClick={() => setStep(1)}
                                className="px-3 py-1.5 rounded-full border border-gray-200 text-xs text-gray-600 bg-white hover:bg-gray-50"
                              >
                                Back
                              </button>
                              <Tooltip
                                title={
                                  Math.round(progressPercent) < 100
                                    ? "Finish all resources for your selected skills to continue. You're almost there!"
                                    : ""
                                }
                                placement="top"
                                arrow
                                disableHoverListener={Math.round(progressPercent) === 100}
                              >
                                <span>
                                  <button
                                    onClick={handleContinue}
                                    className="px-4 py-1.5 rounded-full bg-blue-600 text-white text-xs font-medium hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed"
                                    disabled={skills.length === 0 || Math.round(progressPercent) < 100}
                                  >
                                    Continue
                                  </button>
                                </span>
                              </Tooltip>
                            </div>
                          </div>
                        </motion.div>
                      )}

                      {step === 3 && (
                        <motion.div
                          key="step-success"
                          variants={stepVariants}
                          initial="initial"
                          animate="center"
                          exit="exit"
                          transition={{ duration: 0.25, ease: "easeOut" }}
                          className="flex flex-col items-center justify-center min-h-[380px] bg-white"
                        >
                          <SuccessMatch
                            skills={completedSkillNames}
                            profileImgUrl={profileImgUrl ?? undefined}
                            onFinish={() => setStep(4)}
                          />
                        </motion.div>
                      )}

                      {step === 4 && (
                        <motion.div
                          key="step-done"
                          variants={stepVariants}
                          initial="initial"
                          animate="center"
                          exit="exit"
                          transition={{ duration: 0.25, ease: "easeOut" }}
                          className="grid md:grid-cols-[1.1fr,1fr] gap-6 items-center"
                        >
                          <div className="space-y-3">
                            <p className="text-sm font-semibold text-white">
                              You’re all set!
                            </p>
                            <p className="text-xs text-gray-300">
                              You just took real steps to improve your job matches.
                              As you add skills and keep learning, more opportunities
                              will open up for you.
                            </p>
                            <div className="rounded-xl border border-blue-100 bg-blue-50/60 px-4 py-3 text-xs text-blue-800">
                              <p className="font-semibold mb-1">
                                What you just boosted:
                              </p>
                              <ul className="list-disc list-inside space-y-0.5">
                                <li>
                                  Highlighted{" "}
                                  <span className="font-semibold">
                                    {skills.length}
                                  </span>{" "}
                                  key skills employers care about
                                </li>
                                <li>
                                  Marked{" "}
                                  <span className="font-semibold">
                                    {completedSkillNames.length}
                                  </span>{" "}
                                  skills as completed learning
                                </li>
                                <li>Strengthened your profile for better matches</li>
                              </ul>
                            </div>
                            <p className="text-xs text-gray-200">
                              💪 Small changes can lead to big opportunities. Keep
                              updating your skills and preferences to stay ahead.
                            </p>
                          </div>
                          <div className="flex flex-col items-center justify-center">
                            {effectiveRocketAnimation && (
                              <div className="w-40 h-40 mb-2">
                                <Lottie
                                  animationData={effectiveRocketAnimation}
                                  loop
                                  autoplay
                                />
                              </div>
                            )}
                            <div className="w-full flex gap-2">
                              <button
                                onClick={async () => {
                                  await resetBoosterState()
                                }}
                                className="w-full rounded-full bg-white text-blue-600 text-sm font-medium py-2.5 hover:bg-blue-50 border-2 border-blue-200 transition-colors shadow-sm flex items-center justify-center gap-2"
                              >
                                <SiStarship className="w-5 h-5" />
                                Restart Booster
                              </button>
                              <button
                                onClick={onClose}
                                className="w-full rounded-full bg-gradient-to-r from-blue-500 via-indigo-500 to-sky-400 text-white text-sm font-medium py-2.5 hover:opacity-90 transition-colors"
                              >
                                Close Booster
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}    </AnimatePresence>
      <SaveProgressModal
        open={showSaveModal && hasUnsavedProgress}
        onSave={handleModalSave}
        onClose={handleModalNoThanks}
        loading={saving}
      />
      <ResetProgressModal
        open={showResetModal && hasProgress}
        onConfirm={handleResetProgress}
        onClose={() => setShowResetModal(false)}
        loading={resetting}
      />
    </>
  )
}

export default MatchBoosterPopup
