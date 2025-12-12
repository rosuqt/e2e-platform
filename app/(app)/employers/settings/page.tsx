"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { User, Shield, Save } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TabList } from "./components/tab-list"
import Tooltip from "@mui/material/Tooltip"
import toast, { Toaster } from "react-hot-toast"

// Add suffixes array
const suffixes = [
  "",
  "Jr.",
  "Sr.",
  "MD",
  "PhD",
  "Esq.",
  "II",
  "III",
  "IV",
  "V",
  "VI",
  "VII",
  "VIII",
  "IX",
  "X",
  "XI",
  "XII",
  "XIII",
  "XIV",
  "XV",
]

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile")
  const tabs = [
    { id: "profile", icon: User, label: "Profile", description: "Manage your personal information" },
    { id: "security", icon: Shield, label: "Security", description: "Change your password" },
  ]

  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState({
    first_name: "",
    middle_name: "",
    last_name: "",
    suffix: "",
    email: "",
    phone: "",
  })
  const [editProfile, setEditProfile] = useState(profile)
  const [saving, setSaving] = useState(false)
  const [verifyStatus, setVerifyStatus] = useState<string | undefined>(undefined)
  const [phoneError, setPhoneError] = useState<string>("")
  const [firstNameError, setFirstNameError] = useState<string>("")
  const [lastNameError, setLastNameError] = useState<string>("")

  useEffect(() => {
    setLoading(true)
    fetch("/api/employers/settings")
      .then(res => res.json())
      .then(data => {
        setProfile({
          first_name: data.first_name || "",
          middle_name: data.middle_name || "",
          last_name: data.last_name || "",
          suffix: data.suffix || "",
          email: data.email || "",
          phone: data.phone || "",
        })
        setEditProfile({
          first_name: data.first_name || "",
          middle_name: data.middle_name || "",
          last_name: data.last_name || "",
          suffix: data.suffix || "",
          email: data.email || "",
          phone: data.phone || "",
        })
        setVerifyStatus(data.verify_status)
      })
      .finally(() => setLoading(false))
  }, [])

  const handleTabChange = (id: string) => {
    setActiveTab(id)
  }

  const validatePhone = (value: string) => {
    // Only digits, 10 digits, starts with 9
    if (!/^\d{10}$/.test(value)) {
      return "Phone number must be 10 digits."
    }
    if (!value.startsWith("9")) {
      return "Phone number must start with 9."
    }
    return ""
  }

  const strictNameRegex = /^(Ma\. )?([A-Za-zñÑ]+([ '-][A-Za-zñÑ]+)*|'[A-Za-zñÑ]+)*$/;

  const validateFirstName = (value: string) => {
    if (value.length < 2 || value.length > 50) {
      return "First name must be 2-50 characters."
    }
    if (!strictNameRegex.test(value)) {
      return "First name can only contain letters, spaces, hyphens, apostrophes, 'Ma.' and ñ."
    }
    return ""
  }

  const validateLastName = (value: string) => {
    if (value.length < 2 || value.length > 50) {
      return "Last name must be 2-50 characters."
    }
    if (!strictNameRegex.test(value)) {
      return "Last name can only contain letters, spaces, hyphens, apostrophes, and ñ."
    }
    return ""
  }

  const handleProfileChange = (field: string, value: string) => {
    setEditProfile(prev => ({ ...prev, [field]: value }))
    if (field === "phone") {
      setPhoneError(validatePhone(value))
    }
    if (field === "first_name") {
      setFirstNameError(validateFirstName(value))
    }
    if (field === "last_name") {
      setLastNameError(validateLastName(value))
    }
  }

  const handleSaveProfile = async () => {
    if (phoneError || firstNameError || lastNameError) return
    setSaving(true)
    await fetch("/api/employers/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editProfile),
    })
    setProfile(editProfile)
    setSaving(false)
    toast.success("Profile updated successfully!", { style: { background: "#e6ffed", color: "#059669" } })
  }

  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [passwordError, setPasswordError] = useState<string>("")
  const [changePasswordError, setChangePasswordError] = useState<string>("")
  const [changingPassword, setChangingPassword] = useState(false)
  const [changePasswordSuccess, setChangePasswordSuccess] = useState(false)
  const [confirmPasswordError, setConfirmPasswordError] = useState<string>("")

  const passwordChecklist = [
    { label: "Minimum 8 characters", valid: newPassword.length >= 8 },
    { label: "At least one uppercase letter", valid: /[A-Z]/.test(newPassword) },
    { label: "At least one special character", valid: /[!@#$%^&*(),.?":{}|<>]/.test(newPassword) },
  ]

  const validateNewPassword = (value: string) => {
    if (value.length < 8) return "Password must be at least 8 characters."
    if (!/[A-Z]/.test(value)) return "Password must contain an uppercase letter."
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(value)) return "Password must contain a special character."
    return ""
  }

  useEffect(() => {
    if (newPassword) {
      setPasswordError(validateNewPassword(newPassword))
    } else {
      setPasswordError("")
    }
    setChangePasswordError("")
    setChangePasswordSuccess(false)
  }, [newPassword])

  useEffect(() => {
    if (confirmPassword && newPassword && confirmPassword !== newPassword) {
      setConfirmPasswordError("Confirmation does not match new password.")
    } else {
      setConfirmPasswordError("")
    }
  }, [confirmPassword, newPassword])

  const handleChangePassword = async () => {
    setChangePasswordError("")
    setChangePasswordSuccess(false)
    if (!currentPassword || !newPassword || !confirmPassword) {
      setChangePasswordError("All fields are required.")
      return
    }
    if (passwordError) return
    if (newPassword !== confirmPassword) {
      setChangePasswordError("New password and confirmation do not match.")
      return
    }
    setChangingPassword(true)
    const res = await fetch("/api/employers/settings/passwordChange", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ currentPassword, newPassword }),
    })
    const result = await res.json()
    if (result.success) {
      setChangePasswordSuccess(true)
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
      toast.success("Password changed successfully!", { style: { background: "#e6ffed", color: "#059669" } })
    } else {
      setChangePasswordError(result.error || "Failed to change password.")
    }
    setChangingPassword(false)
  }

  return (
    <>
      <Toaster position="top-center" />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-sky-100 pb-10">
        <div className="container mx-auto px-4 py-8">
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl font-bold text-blue-600 flex items-center">
              <motion.div
                className="mr-4 bg-blue-500 text-white p-3 rounded-2xl shadow-lg"
                whileHover={{ rotate: [0, -10, 10, -10, 0], scale: 1.1 }}
                transition={{ duration: 0.5 }}
              >
                <User size={28} />
              </motion.div>
              <span className="bg-gradient-to-r from-blue-500 to-sky-400 text-transparent bg-clip-text">
                Account Settings
              </span>
            </h1>
            <p className="text-blue-600/70 mt-2 ml-16">Manage your profile and security settings</p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <TabList items={tabs} defaultTab={activeTab} onTabChange={handleTabChange} />
            </div>

            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Profile Tab */}
              {activeTab === "profile" && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  <Card className="bg-white/80 backdrop-blur-sm border-blue-200 shadow-xl">
                    <CardHeader>
                      <CardTitle className="text-blue-600 flex items-center">
                        <User className="h-5 w-5 mr-2" />
                        Personal Information
                      </CardTitle>
                      <CardDescription>Your basic profile information</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {loading ? (
                        <div className="animate-pulse space-y-4">
                          <div className="h-10 bg-blue-100 rounded" />
                          <div className="h-10 bg-blue-100 rounded" />
                          <div className="h-10 bg-blue-100 rounded" />
                          <div className="h-10 bg-blue-100 rounded" />
                        </div>
                      ) : (
                        <>
                          <div className="space-y-2">
                            <Label htmlFor="first_name" className="text-blue-700">
                              First Name
                            </Label>
                            <Input
                              id="first_name"
                              value={editProfile.first_name}
                              onChange={e => handleProfileChange("first_name", e.target.value)}
                              className={`border-blue-200 focus:border-blue-400 ${firstNameError ? "border-red-500" : ""}`}
                            />
                            {firstNameError && (
                              <div className="text-red-600 text-sm mt-1">{firstNameError}</div>
                            )}
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="middle_name" className="text-blue-700">
                              Middle Name
                            </Label>
                            <Input
                              id="middle_name"
                              value={editProfile.middle_name}
                              onChange={e => handleProfileChange("middle_name", e.target.value)}
                              className="border-blue-200 focus:border-blue-400"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="last_name" className="text-blue-700">
                              Last Name
                            </Label>
                            <Input
                              id="last_name"
                              value={editProfile.last_name}
                              onChange={e => handleProfileChange("last_name", e.target.value)}
                              className={`border-blue-200 focus:border-blue-400 ${lastNameError ? "border-red-500" : ""}`}
                            />
                            {lastNameError && (
                              <div className="text-red-600 text-sm mt-1">{lastNameError}</div>
                            )}
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="suffix" className="text-blue-700">
                              Suffix
                            </Label>
                            {/* Dropdown for suffix */}
                            <select
                              id="suffix"
                              value={editProfile.suffix}
                              onChange={e => handleProfileChange("suffix", e.target.value)}
                              className="border-blue-200 focus:border-blue-400 rounded-md w-full px-3 py-2"
                            >
                              {suffixes.map((suf, idx) => (
                                <option key={idx} value={suf}>
                                  {suf === "" ? "None" : suf}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="email" className="text-blue-700">
                              Email Address
                            </Label>
                            <Tooltip
                              title={
                                verifyStatus === "standard" || verifyStatus === "full"
                                  ? "You cannot change your email because it has already been verified with us."
                                  : ""
                              }
                              arrow
                              disableHoverListener={!(verifyStatus === "standard" || verifyStatus === "full")}
                            >
                              <span>
                                <Input
                                  id="email"
                                  value={editProfile.email}
                                  onChange={e => handleProfileChange("email", e.target.value)}
                                  className="border-blue-200 focus:border-blue-400"
                                  disabled={verifyStatus === "standard" || verifyStatus === "full"}
                                />
                              </span>
                            </Tooltip>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="phone" className="text-blue-700">
                              Phone Number
                            </Label>
                            <div className="flex items-center gap-2">
                              <span className="px-3 py-2 bg-blue-50 border border-blue-200 rounded-md text-blue-700 select-none">
                                +63
                              </span>
                              <Input
                                id="phone"
                                value={editProfile.phone}
                                onChange={e => handleProfileChange("phone", e.target.value.replace(/\D/g, ""))}
                                className={`border-blue-200 focus:border-blue-400 ${phoneError ? "border-red-500" : ""}`}
                                style={{ flex: 1 }}
                                maxLength={10}
                              />
                            </div>
                            {phoneError && (
                              <div className="text-red-600 text-sm mt-1">{phoneError}</div>
                            )}
                          </div>
                          <div className="flex justify-end mt-6">
                            <motion.button
                              className="bg-gradient-to-r from-blue-500 to-sky-500 text-white px-8 py-3 rounded-2xl font-medium shadow-lg hover:shadow-blue-200/50 transition-all duration-200 flex items-center justify-center"
                              whileHover={{ scale: 1.05, boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.5)" }}
                              whileTap={{ scale: 0.95 }}
                              type="button"
                              onClick={handleSaveProfile}
                              disabled={saving || !!phoneError || !!firstNameError || !!lastNameError}
                            >
                              <Save className="mr-2 h-5 w-5" />
                              {saving ? "Saving..." : "Save Changes"}
                            </motion.button>
                          </div>
                        </>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {/* Security Tab */}
              {activeTab === "security" && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <Card className="bg-white/80 backdrop-blur-sm border-blue-200 shadow-xl">
                    <CardHeader>
                      <CardTitle className="text-blue-600 flex items-center">
                        <Shield className="h-5 w-5 mr-2" />
                        Security
                      </CardTitle>
                      <CardDescription>Change your password</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="current-password" className="text-blue-700">
                          Current Password
                        </Label>
                        <Input
                          id="current-password"
                          type="password"
                          placeholder="Enter current password"
                          className="border-blue-200 focus:border-blue-400"
                          value={currentPassword}
                          onChange={e => setCurrentPassword(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="new-password" className="text-blue-700">
                          New Password
                        </Label>
                        <Input
                          id="new-password"
                          type="password"
                          placeholder="Enter new password"
                          className={`border-blue-200 focus:border-blue-400 ${passwordError ? "border-red-500" : ""}`}
                          value={newPassword}
                          onChange={e => setNewPassword(e.target.value)}
                        />
                        <div className="mt-2 space-y-1">
                          {passwordChecklist.map((item, idx) => (
                            <div key={idx} className="flex items-center text-sm">
                              <span className={`mr-2 ${item.valid ? "text-green-600" : "text-gray-400"}`}>
                                {item.valid ? "✔" : "✗"}
                              </span>
                              <span className={item.valid ? "text-green-600" : "text-gray-500"}>{item.label}</span>
                            </div>
                          ))}
                        </div>
                        {passwordError && (
                          <div className="text-red-600 text-sm mt-1">{passwordError}</div>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirm-password" className="text-blue-700">
                          Confirm New Password
                        </Label>
                        <Input
                          id="confirm-password"
                          type="password"
                          placeholder="Confirm new password"
                          className={`border-blue-200 focus:border-blue-400 ${confirmPasswordError ? "border-red-500" : ""}`}
                          value={confirmPassword}
                          onChange={e => setConfirmPassword(e.target.value)}
                        />
                        {confirmPasswordError && (
                          <div className="text-red-600 text-sm mt-1">{confirmPasswordError}</div>
                        )}
                      </div>
                      {changePasswordError && (
                        <div className="text-red-600 text-sm mt-1">
                          {changePasswordError === "Current password is incorrect"
                            ? "The current password you entered is incorrect."
                            : changePasswordError}
                        </div>
                      )}
                      {changePasswordSuccess && (
                        <div className="text-green-600 text-sm mt-1">Password changed successfully.</div>
                      )}
                      <div className="flex justify-end mt-6">
                        <motion.button
                          className="bg-gradient-to-r from-blue-500 to-sky-500 text-white px-8 py-3 rounded-2xl font-medium shadow-lg hover:shadow-blue-200/50 transition-all duration-200 flex items-center justify-center"
                          whileHover={{ scale: 1.05, boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.5)" }}
                          whileTap={{ scale: 0.95 }}
                          type="button"
                          onClick={handleChangePassword}
                          disabled={changingPassword || !!passwordError || !!confirmPasswordError}
                        >
                          <Save className="mr-2 h-5 w-5" />
                          {changingPassword ? "Changing..." : "Change Password"}
                        </motion.button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
