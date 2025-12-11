"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronRight, LogOut, Settings, Calendar } from "lucide-react"
import { Avatar } from "@mui/material"
import { useRouter } from "next/navigation"
import { signOut } from "next-auth/react"
import { HiBadgeCheck } from "react-icons/hi"
import { LuBadgeCheck, LuSquareActivity } from "react-icons/lu"
import { PiWarningFill } from "react-icons/pi"
import Tooltip from "@mui/material/Tooltip"
import { useSession } from "next-auth/react"

interface ProfileModalProps {
  user: {
    name: string
    email: string
    avatarUrl?: string
  }
  onClose: () => void
}

export function ProfileModal({ user, onClose }: ProfileModalProps) {
  const router = useRouter()
  const { data: session } = useSession()
  const [isOpen, setIsOpen] = useState(true)
  const modalRef = useRef<HTMLDivElement>(null)
  const [dbName, setDbName] = useState<string>("")
  const [dbEmail, setDbEmail] = useState<string>("")
  const [dbAvatar, setDbAvatar] = useState<string | undefined>(undefined)
  const [loading, setLoading] = useState(true)
  const [userType, setUserType] = useState<"student" | "employer" | null>(null)

  const handleClose = useCallback(() => {
    setIsOpen(false)
    setTimeout(onClose, 200) 
  }, [onClose])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        handleClose()
      }
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        handleClose()
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    document.addEventListener("keydown", handleEscape)

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.removeEventListener("keydown", handleEscape)
    }
  }, [handleClose])

  useEffect(() => {
    const sessionKey = "profileModalUserDetails"
    const sessionRoleKey = "profileModalUserRole"
    const sessionAvatarKey = "profileModalUserAvatar"

    const cachedDetails = sessionStorage.getItem(sessionKey)
    const cachedRole = sessionStorage.getItem(sessionRoleKey)
    const cachedAvatar = sessionStorage.getItem(sessionAvatarKey)

    if (cachedDetails && cachedRole) {
      const { name, email } = JSON.parse(cachedDetails)
      setDbName(name)
      setDbEmail(email)
      setUserType(cachedRole as "student" | "employer")
      if (cachedAvatar) {
        setDbAvatar(cachedAvatar + (cachedAvatar.includes("?") ? "&" : "?") + `t=${Date.now()}`)
      } else {
        setDbAvatar(undefined)
      }
      setLoading(false)
      return
    }

    (async () => {
      setLoading(true)
      let detailsRes: Response | null = null
      try {
        detailsRes = await fetch("/api/employers/get-employer-details", { credentials: "include" })
        if (detailsRes.ok) {
          const { first_name, last_name, suffix, email, profile_img } = await detailsRes.json()
          const name =
            first_name && last_name
              ? `${first_name} ${last_name}${suffix ? " " + suffix : ""}`
              : first_name || last_name || ""
          setDbName(name)
          setDbEmail(email || "")
          setUserType("employer")
          sessionStorage.setItem(sessionKey, JSON.stringify({ name, email }))
          sessionStorage.setItem(sessionRoleKey, "employer")
          if (profile_img) {
            try {
              const signedRes = await fetch("/api/employers/get-signed-url", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ bucket: "user.avatars", path: profile_img }),
                credentials: "include",
              })
              if (signedRes.ok) {
                const { signedUrl } = await signedRes.json()
                const avatarWithTs = signedUrl + (signedUrl.includes("?") ? "&" : "?") + `t=${Date.now()}`
                setDbAvatar(avatarWithTs)
                sessionStorage.setItem(sessionAvatarKey, avatarWithTs)
              } else {
                setDbAvatar(undefined)
                sessionStorage.removeItem(sessionAvatarKey)
              }
            } catch {
              setDbAvatar(undefined)
              sessionStorage.removeItem(sessionAvatarKey)
            }
          } else {
            const defaultUrl = `https://dbuyxpovejdakzveiprx.supabase.co/storage/v1/object/public/app.images/default.png?t=${Date.now()}`
            setDbAvatar(defaultUrl)
            sessionStorage.removeItem(sessionAvatarKey)
          }
          setLoading(false)
          return
        }
      } catch {}
      try {
        detailsRes = await fetch("/api/students/get-student-details", { credentials: "include" })
        if (detailsRes.ok) {
          const { first_name, last_name, email, profile_img } = await detailsRes.json()
          const name =
            first_name && last_name
              ? `${first_name} ${last_name}`
              : first_name || last_name || ""
          setDbName(name)
          setDbEmail(email || "")
          setUserType("student")
          sessionStorage.setItem(sessionKey, JSON.stringify({ name, email }))
          sessionStorage.setItem(sessionRoleKey, "student")
          if (profile_img) {
            try {
              const signedRes = await fetch("/api/students/get-signed-url", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ bucket: "user.avatars", path: profile_img }),
                credentials: "include",
              })
              if (signedRes.ok) {
                const { signedUrl } = await signedRes.json()
                const avatarWithTs = signedUrl + (signedUrl.includes("?") ? "&" : "?") + `t=${Date.now()}`
                setDbAvatar(avatarWithTs)
                sessionStorage.setItem(sessionAvatarKey, avatarWithTs)
              } else {
                setDbAvatar(undefined)
                sessionStorage.removeItem(sessionAvatarKey)
              }
            } catch {
              setDbAvatar(undefined)
              sessionStorage.removeItem(sessionAvatarKey)
            }
          } else {
            const defaultUrl = `https://dbuyxpovejdakzveiprx.supabase.co/storage/v1/object/public/app.images/default.png?t=${Date.now()}`
            setDbAvatar(defaultUrl)
            sessionStorage.removeItem(sessionAvatarKey)
          }
          setLoading(false)
          return
        }
      } catch {}
      setLoading(false)
    })()
  }, [user.name, user.email, user.avatarUrl])

  useEffect(() => {
    const handleProfilePicUpdate = async () => {
      setLoading(true)
      sessionStorage.removeItem("profileModalUserDetails")
      sessionStorage.removeItem("profileModalUserRole")
      sessionStorage.removeItem("profileModalUserAvatar")
      let detailsRes: Response | null = null
      try {
        detailsRes = await fetch("/api/employers/get-employer-details", { credentials: "include" })
        if (detailsRes.ok) {
          const { first_name, last_name, suffix, email, profile_img } = await detailsRes.json()
          const name =
            first_name && last_name
              ? `${first_name} ${last_name}${suffix ? " " + suffix : ""}`
              : first_name || last_name || ""
          setDbName(name)
          setDbEmail(email || "")
          setUserType("employer")
          sessionStorage.setItem("profileModalUserDetails", JSON.stringify({ name, email }))
          sessionStorage.setItem("profileModalUserRole", "employer")
          if (profile_img) {
            try {
              const signedRes = await fetch("/api/employers/get-signed-url", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ bucket: "user.avatars", path: profile_img }),
                credentials: "include",
              })
              if (signedRes.ok) {
                const { signedUrl } = await signedRes.json()
                const avatarWithTs = signedUrl + (signedUrl.includes("?") ? "&" : "?") + `t=${Date.now()}`
                setDbAvatar(avatarWithTs)
                sessionStorage.setItem("profileModalUserAvatar", avatarWithTs)
              } else {
                setDbAvatar(undefined)
                sessionStorage.removeItem("profileModalUserAvatar")
              }
            } catch {
              setDbAvatar(undefined)
              sessionStorage.removeItem("profileModalUserAvatar")
            }
          } else {
            const defaultUrl = `https://dbuyxpovejdakzveiprx.supabase.co/storage/v1/object/public/app.images/default.png?t=${Date.now()}`
            setDbAvatar(defaultUrl)
            sessionStorage.removeItem("profileModalUserAvatar")
          }
          setLoading(false)
          return
        }
      } catch {}
      try {
        detailsRes = await fetch("/api/students/get-student-details", { credentials: "include" })
        if (detailsRes.ok) {
          const { first_name, last_name, email, profile_img } = await detailsRes.json()
          const name =
            first_name && last_name
              ? `${first_name} ${last_name}`
              : first_name || last_name || ""
          setDbName(name)
          setDbEmail(email || "")
          setUserType("student")
          sessionStorage.setItem("profileModalUserDetails", JSON.stringify({ name, email }))
          sessionStorage.setItem("profileModalUserRole", "student")
          if (profile_img) {
            try {
              const signedRes = await fetch("/api/students/get-signed-url", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ bucket: "user.avatars", path: profile_img }),
                credentials: "include",
              })
              if (signedRes.ok) {
                const { signedUrl } = await signedRes.json()
                const avatarWithTs = signedUrl + (signedUrl.includes("?") ? "&" : "?") + `t=${Date.now()}`
                setDbAvatar(avatarWithTs)
                sessionStorage.setItem("profileModalUserAvatar", avatarWithTs)
              } else {
                setDbAvatar(undefined)
                sessionStorage.removeItem("profileModalUserAvatar")
              }
            } catch {
              setDbAvatar(undefined)
              sessionStorage.removeItem("profileModalUserAvatar")
            }
          } else {
            const defaultUrl = `https://dbuyxpovejdakzveiprx.supabase.co/storage/v1/object/public/app.images/default.png?t=${Date.now()}`
            setDbAvatar(defaultUrl)
            sessionStorage.removeItem("profileModalUserAvatar")
          }
          setLoading(false)
          return
        }
      } catch {}
      setLoading(false)
    }
    window.addEventListener("profilePictureUpdated", handleProfilePicUpdate)
    return () => window.removeEventListener("profilePictureUpdated", handleProfilePicUpdate)
  }, [])

  const handleProfileClick = async () => {
    const profilePath =
      userType === "employer"
        ? "/employers/profile"
        : "/students/profile"
    await router.prefetch(profilePath)
    router.push(profilePath)
    onClose()
  }
  const handleSettingsClick = async () => {
    const settingsPath =
      userType === "employer"
        ? "/employers/settings"
        : "/students/settings"
    await router.prefetch(settingsPath)
    router.push(settingsPath)
    onClose()
  }
  const handleActivityLogClick = async () => {
    await router.prefetch("/students/profile?tab=activity-tab")
    router.push("/students/profile?tab=activity-tab")
    onClose()
  }
  const handleCalendarClick = async () => {
    const calendarPath =
      userType === "employer"
        ? "/employers/calendar"
        : "/students/calendar"
    await router.prefetch(calendarPath)
    router.push(calendarPath)
    onClose()
  }

  const handleLogoutClick = async () => {
    sessionStorage.clear()
    setDbName("")
    setDbEmail("")
    setDbAvatar(undefined)
    setUserType(null)
    setLoading(true)
    await signOut({ callbackUrl: "/landing" });
    onClose();
  }

  const menuItems: {
    id: string
    label: string
    icon: React.ComponentType<{ size?: number }>
    onClick: () => Promise<void>
  }[] = [
    { id: "calendar", label: "Calendar", icon: Calendar, onClick: handleCalendarClick },
    { id: "settings", label: "Settings", icon: Settings, onClick: handleSettingsClick },
  ]

  if (userType === "student") {
    menuItems.push({
      id: "theme",
      label: "Activity Log",
      icon: LuSquareActivity,
      onClick: handleActivityLogClick,
    })
  }

  if (userType === "employer") {
    const verifyStatus = (session?.user as { verifyStatus?: string } | undefined)?.verifyStatus
    const verificationHref =
      verifyStatus === "full"
        ? "/employers/verification/fully-verified"
        : verifyStatus === "standard"
        ? "/employers/verification/partially-verified"
        : "/employers/verification/unverified"
    menuItems.unshift({
      id: "verification",
      label: "Verification",
      icon: HiBadgeCheck,
      onClick: async () => {
        await router.prefetch(verificationHref)
        router.push(verificationHref)
        onClose()
      }
    })
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-start justify-end p-4 mt-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <motion.div
            ref={modalRef}
            className="bg-white rounded-lg shadow-lg overflow-hidden w-full max-w-xs"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            <div className="p-4 border-b border-gray-100">
              <h3 className="text-lg font-medium text-gray-800">Account</h3>
            </div>

            <div
              className="p-4 flex items-center space-x-3 border-b border-gray-100 cursor-pointer hover:bg-blue-50 transition"
              onClick={loading ? undefined : handleProfileClick}
              style={loading ? { cursor: "default", opacity: 0.7 } : undefined}
            >
              {loading ? (
                <div className="animate-pulse flex items-center space-x-3 w-full">
                  <div className="rounded-full bg-gray-200" style={{ width: 48, height: 48 }} />
                  <div className="flex flex-col space-y-2 flex-1">
                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                    <div className="h-3 bg-gray-200 rounded w-1/2" />
                  </div>
                </div>
              ) : (
                <>
                  <Avatar
                    src={dbAvatar || (userType === "student" ? user.avatarUrl : undefined) || "/placeholder.svg"}
                    alt={dbName}
                    sx={{ width: 48, height: 48, border: "2px solid #bbdefb" }}
                  >
                    {!dbAvatar &&
                      dbName
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                  </Avatar>
                  <div>
                    <div className="font-medium text-gray-800 flex items-center gap-2">
                      {dbName}
                      {userType === "employer" && (() => {
                        const verifyStatus = (session?.user as { verifyStatus?: string } | undefined)?.verifyStatus
                        if (!verifyStatus) return null
                        if (verifyStatus === "full") {
                          return (
                            <Tooltip title="Fully Verified" arrow>
                              <motion.span
                                className="flex items-center"
                                whileHover={{ scale: 1.18 }}
                                transition={{ type: "spring", stiffness: 340, damping: 16 }}
                              >
                                <HiBadgeCheck className="w-4 h-4 text-blue-600" />
                              </motion.span>
                            </Tooltip>
                          )
                        }
                        if (verifyStatus === "standard") {
                          return (
                            <Tooltip title="Partially Verified" arrow>
                              <motion.span
                                className="flex items-center"
                                whileHover={{ scale: 1.18 }}
                                transition={{ type: "spring", stiffness: 340, damping: 16 }}
                              >
                                <LuBadgeCheck className="w-4 h-4" style={{ color: "#7c3aed" }} />
                              </motion.span>
                            </Tooltip>
                          )
                        }
                        return (
                          <Tooltip title="Unverified" arrow>
                            <motion.span
                              className="flex items-center"
                              whileHover={{ scale: 1.18 }}
                              transition={{ type: "spring", stiffness: 340, damping: 16 }}
                            >
                              <PiWarningFill className="w-4 h-4 text-orange-500 ml-1" />
                            </motion.span>
                          </Tooltip>
                        )
                      })()}
                    </div>
                    <div className="text-sm text-gray-500">{dbEmail}</div>
                  </div>
                </>
              )}
            </div>

            <div className="py-2">
              {menuItems.map((item) => {
                const Icon = item.icon
                return (
                  <button
                    key={item.id}
                    className="w-full flex items-center justify-between p-3 text-left hover:bg-blue-50 transition-colors"
                    onClick={item.onClick}
                    disabled={loading}
                    style={loading ? { opacity: 0.5, pointerEvents: "none" } : undefined}
                  >
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-gray-500">
                        {/* Render Lucide or custom icons */}
                        <Icon size={18} />
                      </div>
                      <span className="ml-3 text-gray-700">{item.label}</span>
                    </div>
                    <ChevronRight size={16} className="text-gray-400" />
                  </button>
                )
              })}
            </div>

            <div className="py-2 border-t border-gray-100">
              <button 
                className={`w-full flex items-center p-3 text-left transition-colors ${
                  loading 
                    ? 'bg-gray-50 text-gray-400 cursor-not-allowed' 
                    : 'hover:bg-red-50 text-red-600'
                }`}
                onClick={handleLogoutClick}
                disabled={loading}
              >
                <div className="w-8 h-8 rounded-full flex items-center justify-center">
                  <LogOut size={18} />
                </div>
                <span className="ml-3">Logout</span>
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
