"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronRight, LogOut, Settings, User, Palette, AlertCircle } from "lucide-react"
import { Avatar } from "@mui/material"
import { useRouter } from "next/navigation"

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

  const handleProfileClick = async () => {
    await router.prefetch("/students/profile")
    router.push("/students/profile")
    onClose()
  }
  const handleSettingsClick = async () => {
    await router.prefetch("/students/settings")
    router.push("/students/settings")
    onClose()
  }

  const handleLogoutClick = async () => {
    await router.prefetch("/landing")
    router.push("/landing")
    onClose()
  }

  const menuItems = [
    { id: "profile", label: "Profile", icon: User, onClick: handleProfileClick },
    { id: "settings", label: "Settings", icon: Settings, onclick: handleSettingsClick },
    { id: "theme", label: "Theme", icon: Palette, badge: "7" },
    { id: "report", label: "Report a bug", icon: AlertCircle },
  ]

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-start justify-end p-4"
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
              <Avatar
                src={user.avatarUrl || "/placeholder.svg"}
                alt={user.name}
                sx={{ width: 48, height: 48, border: "2px solid #bbdefb" }}
              >
                {!user.avatarUrl &&
                  user.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
              </Avatar>
              <div>
                <div className="font-medium text-gray-800">{user.name}</div>
                <div className="text-sm text-gray-500">{user.email}</div>
              </div>
            </div>

            <div className="py-2">
              {menuItems.map((item) => {
                const Icon = item.icon
                return (
                  <button
                    key={item.id}
                    className="w-full flex items-center justify-between p-3 text-left hover:bg-blue-50 transition-colors"
                    onClick={item.onClick}
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
