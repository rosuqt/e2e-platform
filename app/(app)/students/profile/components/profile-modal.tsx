"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronRight, LogOut, Settings, User, Palette, AlertCircle } from "lucide-react"
import { Avatar } from "@mui/material"
import { useRouter } from "next/navigation"
import { signOut } from "next-auth/react"

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
      setDbAvatar(cachedAvatar || undefined)
      setLoading(false)
      return
    }

    (async () => {
      setLoading(true)
      let detailsRes: Response | null = null
      try {
        detailsRes = await fetch("/api/employers/get-employer-details", { credentials: "include" })
        if (detailsRes.ok) {
          const { first_name, last_name, email, profile_img } = await detailsRes.json()
          const name =
            first_name && last_name
              ? `${first_name} ${last_name}`
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
                setDbAvatar(signedUrl)
                sessionStorage.setItem(sessionAvatarKey, signedUrl)
              } else {
                setDbAvatar(undefined)
                sessionStorage.removeItem(sessionAvatarKey)
              }
            } catch {
              setDbAvatar(undefined)
              sessionStorage.removeItem(sessionAvatarKey)
            }
          } else {
            setDbAvatar(undefined)
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
              : ""
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
                setDbAvatar(signedUrl)
                sessionStorage.setItem(sessionAvatarKey, signedUrl)
              } else {
                setDbAvatar(undefined)
                sessionStorage.removeItem(sessionAvatarKey)
              }
            } catch {
              setDbAvatar(undefined)
              sessionStorage.removeItem(sessionAvatarKey)
            }
          } else {
            setDbAvatar(undefined)
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
          const { first_name, last_name, email, profile_img } = await detailsRes.json()
          const name =
            first_name && last_name
              ? `${first_name} ${last_name}`
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
                setDbAvatar(signedUrl)
                sessionStorage.setItem("profileModalUserAvatar", signedUrl)
              } else {
                setDbAvatar(undefined)
                sessionStorage.removeItem("profileModalUserAvatar")
              }
            } catch {
              setDbAvatar(undefined)
              sessionStorage.removeItem("profileModalUserAvatar")
            }
          } else {
            setDbAvatar(undefined)
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
              : ""
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
                setDbAvatar(signedUrl)
                sessionStorage.setItem("profileModalUserAvatar", signedUrl)
              } else {
                setDbAvatar(undefined)
                sessionStorage.removeItem("profileModalUserAvatar")
              }
            } catch {
              setDbAvatar(undefined)
              sessionStorage.removeItem("profileModalUserAvatar")
            }
          } else {
            setDbAvatar(undefined)
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
    await router.prefetch("/students/settings")
    router.push("/students/settings")
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

  const menuItems = [
    { id: "profile", label: "Profile", icon: User, onClick: handleProfileClick },
    { id: "settings", label: "Settings", icon: Settings, onClick: handleSettingsClick },
    { id: "theme", label: "Theme", icon: Palette, badge: "7" },
    { id: "report", label: "Report a bug", icon: AlertCircle },
  ]

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

            <div className="p-4 flex items-center space-x-3 border-b border-gray-100">
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
                    src={dbAvatar || "/placeholder.svg"}
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
                    <div className="font-medium text-gray-800">{dbName}</div>
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
                        <Icon size={18} />
                      </div>
                      <span className="ml-3 text-gray-700">{item.label}</span>
                    </div>
                    {item.badge ? (
                      <span className="bg-blue-100 text-blue-600 text-xs rounded-full px-2 py-0.5">{item.badge}</span>
                    ) : (
                      <ChevronRight size={16} className="text-gray-400" />
                    )}
                  </button>
                )
              })}
            </div>

            <div className="py-2 border-t border-gray-100">
              <button className="w-full flex items-center p-3 text-left hover:bg-red-50 transition-colors text-red-600" onClick={handleLogoutClick}>
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
