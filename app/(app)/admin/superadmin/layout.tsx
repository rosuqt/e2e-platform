"use client"

import type React from "react"

import { useState, useEffect, Suspense } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  BarChart3,
  Users,
  FileText,
  LogOut,
  ChevronDown,
  Search,
  Bell,
  Briefcase,
  Settings,
  Shield,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Avatar from "@mui/material/Avatar"
import MenuMUI from "@mui/material/Menu"
import MenuItem from "@mui/material/MenuItem"
import IconButton from "@mui/material/IconButton"
import Divider from "@mui/material/Divider"
import Typography from "@mui/material/Typography"
import Box from "@mui/material/Box"

interface NavItem {
  title: string
  href: string
  icon: React.ElementType
  badge?: number
  submenu?: { title: string; href: string; badge?: number }[]
}

const navItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/superadmin/dashboard",
    icon: BarChart3,
  },
  {
    title: "Account Management",
    href: "#",
    icon: Users,
    badge: 8,
    submenu: [
      { title: "Admins", href: "/superadmin/accounts/admins", badge: 2 },
      { title: "Students", href: "/superadmin/accounts/students", badge: 3 },
      { title: "Employers", href: "/superadmin/accounts/employers", badge: 1 },
      { title: "Companies", href: "/superadmin/accounts/companies", badge: 2 },
    ],
  },
  {
    title: "Hiring Management",
    href: "#",
    icon: Briefcase,
    badge: 5,
    submenu: [
      { title: "Career Opportunities", href: "/superadmin/hiring/opportunities", badge: 3 },
      { title: "Applications", href: "/superadmin/hiring/applications", badge: 2 },
    ],
  },
  {
    title: "Report Management",
    href: "#",
    icon: FileText,
    badge: 15,
    submenu: [
      { title: "Bugs", href: "/superadmin/reports/bugs", badge: 3 },
      { title: "Reported Employers", href: "/superadmin/reports/employers", badge: 3 },
      { title: "Reported Companies", href: "/superadmin/reports/companies", badge: 2 },
      { title: "Reported Listings", href: "/superadmin/reports/listings", badge: 3 },
    ],
  },
]

export default function SuperadminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null)

  useEffect(() => {
    const currentSubmenu = navItems.find((item) => item.submenu?.some((subItem) => pathname === subItem.href))
    if (currentSubmenu) {
      setOpenSubmenu(currentSubmenu.title)
    }
  }, [pathname])

  const toggleSubmenu = (title: string) => {
    if (openSubmenu === title) {
      setOpenSubmenu(null)
    } else {
      setOpenSubmenu(title)
    }
  }

  const isActive = (href: string) => {
    return pathname === href
  }

  const isSubmenuActive = (submenu: { title: string; href: string }[]) => {
    return submenu.some((item) => pathname === item.href)
  }

  const handleLogout = () => {
    console.log("Logging out...")
    router.push("/login")
  }

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const openMenu = Boolean(anchorEl)
  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const [sidebarMinimized, setSidebarMinimized] = useState(false)
  const handleSidebarMinimize = () => setSidebarMinimized((prev) => !prev)

  const NavContent = ({ minimized = false }: { minimized?: boolean }) => (
    <div className="flex flex-col h-full">
      <div className={`p-6 border-b border-slate-200 dark:border-slate-700 ${minimized ? "justify-center px-2 py-4" : ""}`}>
        <div className="flex items-center gap-2">
          <Shield className={`h-6 w-6 text-blue-600 dark:text-blue-400 ${minimized ? "mx-auto" : ""}`} />
          {!minimized && (
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent">
              Superadmin Portal
            </h1>
          )}
        </div>
      </div>
      <div className="flex-1 py-6 overflow-auto">
        <nav className={`space-y-2 ${minimized ? "px-1" : "px-3"}`}>
          {navItems.map((item) => (
            <div key={item.title}>
              {item.submenu ? (
                <div className="space-y-1">
                  <button
                    onClick={() => toggleSubmenu(item.title)}
                    className={`flex items-center justify-between w-full px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                      isSubmenuActive(item.submenu)
                        ? "bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-600 dark:from-blue-900/30 dark:to-indigo-900/30 dark:text-blue-400"
                        : "text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
                    } ${minimized ? "justify-center px-2" : ""}`}
                    disabled={minimized}
                  >
                    <div className="flex items-center">
                      <item.icon className="mr-0 h-5 w-5" />
                      {!minimized && (
                        <>
                          <span className="ml-3">{item.title}</span>
                          {item.badge && (
                            <Badge
                              variant="secondary"
                              className="ml-2 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-600 dark:from-blue-900/50 dark:to-indigo-900/50 dark:text-blue-300"
                            >
                              {item.badge}
                            </Badge>
                          )}
                        </>
                      )}
                    </div>
                    {!minimized && (
                      <ChevronDown
                        className={`h-4 w-4 transition-transform duration-200 ${
                          openSubmenu === item.title ? "transform rotate-180" : ""
                        }`}
                      />
                    )}
                  </button>
                  {!minimized && (
                    <div
                      className={`transition-all duration-200 overflow-hidden ${
                        openSubmenu === item.title ? "max-h-96" : "max-h-0"
                      }`}
                    >
                      <div className="pl-10 space-y-1 pt-1">
                        {item.submenu.map((subItem) => (
                          <Link
                            key={subItem.title}
                            href={subItem.href}
                            className={`flex items-center justify-between px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                              isActive(subItem.href)
                                ? "bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-600 dark:from-blue-900/30 dark:to-indigo-900/30 dark:text-blue-400"
                                : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                            }`}
                          >
                            <span>{subItem.title}</span>
                            {subItem.badge && (
                              <Badge
                                variant="outline"
                                className="bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-600 border-blue-200 dark:from-blue-900/30 dark:to-indigo-900/30 dark:text-blue-300 dark:border-blue-800"
                              >
                                {subItem.badge}
                              </Badge>
                            )}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  href={item.href}
                  className={`flex items-center justify-between px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                    isActive(item.href)
                      ? "bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-600 dark:from-blue-900/30 dark:to-indigo-900/30 dark:text-blue-400"
                      : "text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
                  } ${minimized ? "justify-center px-2" : ""}`}
                >
                  <div className="flex items-center">
                    <item.icon className="mr-0 h-5 w-5" />
                    {!minimized && (
                      <>
                        <span className="ml-3">{item.title}</span>
                        {item.badge && (
                          <Badge
                            variant="secondary"
                            className="bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-600 dark:from-blue-900/50 dark:to-indigo-900/50 dark:text-blue-300 ml-2"
                          >
                            {item.badge}
                          </Badge>
                        )}
                      </>
                    )}
                  </div>
                </Link>
              )}
            </div>
          ))}
        </nav>
      </div>
      <div className={`p-4 border-t border-slate-200 dark:border-slate-700 bg-gradient-to-r from-slate-50 to-blue-50 dark:from-slate-800/50 dark:to-blue-900/20 rounded-lg mx-3 mb-3 ${minimized ? "flex justify-center p-2 mx-1" : ""}`}>
        <div className="flex items-center">
          <Avatar
            src="/placeholder.svg?height=40&width=40"
            alt="John Admin"
            sx={{ width: 40, height: 40, bgcolor: "primary.light", color: "primary.main", fontWeight: 700 }}
          >
            JA
          </Avatar>
          {!minimized && (
            <div className="ml-3 flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-700 dark:text-slate-200 truncate">John Admin</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Superadmin</p>
            </div>
          )}
          <IconButton
            onClick={handleLogout}
            sx={{ ml: 1 }}
            size="small"
            aria-label="logout"
          >
            <LogOut className="h-5 w-5 text-slate-600 dark:text-slate-400" />
          </IconButton>
        </div>
      </div>
      {/* Minimize/Expand button */}
      <div className={`flex justify-${minimized ? "center" : "end"} pb-2`}>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full"
          onClick={handleSidebarMinimize}
          aria-label={minimized ? "Expand sidebar" : "Minimize sidebar"}
        >
          {minimized ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
        </Button>
      </div>
    </div>
  )

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Sidebar for desktop */}
      <div
        className={`hidden lg:block transition-all duration-200 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-700 shadow-sm overflow-y-auto
          ${sidebarMinimized ? "w-20" : "w-72"}
        `}
      >
        <NavContent minimized={sidebarMinimized} />
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center w-full max-w-md lg:ml-64">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
                <Input
                  placeholder="Search..."
                  className="pl-10 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 focus-visible:ring-blue-500"
                />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                className="hidden md:flex items-center gap-2 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <Settings className="h-4 w-4" />
                <span>Settings</span>
              </Button>
              <Button variant="ghost" size="icon" className="relative hover:bg-slate-100 dark:hover:bg-slate-800">
                <Bell className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white dark:ring-slate-900"></span>
              </Button>
              {/* MUI Avatar and Dropdown Menu */}
              <IconButton
                onClick={handleMenuOpen}
                size="small"
                sx={{ ml: 1 }}
                aria-controls={openMenu ? "account-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={openMenu ? "true" : undefined}
              >
                <Avatar
                  src="/placeholder.svg?height=32&width=32"
                  alt="John Admin"
                  sx={{ width: 32, height: 32, bgcolor: "primary.light", color: "primary.main", fontWeight: 700 }}
                >
                  JA
                </Avatar>
              </IconButton>
              <MenuMUI
                anchorEl={anchorEl}
                id="account-menu"
                open={openMenu}
                onClose={handleMenuClose}
                onClick={handleMenuClose}
                PaperProps={{
                  elevation: 0,
                  sx: {
                    width: 224,
                    mt: 1.5,
                    overflow: 'visible',
                    filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.12))',
                    bgcolor: "background.paper",
                    border: "1px solid",
                    borderColor: "divider",
                  },
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
              >
                <Box px={2} py={1}>
                  <Typography variant="subtitle2" color="text.primary">
                    John Admin
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    john.admin@example.com
                  </Typography>
                </Box>
                <Divider />
                <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
                <MenuItem onClick={handleMenuClose}>Settings</MenuItem>
                <Divider />
                <MenuItem
                  onClick={() => {
                    handleMenuClose()
                    handleLogout()
                  }}
                  sx={{ color: "error.main" }}
                >
                  Logout
                </MenuItem>
              </MenuMUI>
            </div>
          </div>
        </header>

        {/* Main content area */}
        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-7xl mx-auto">
            <Suspense
              fallback={
                <div className="flex items-center justify-center h-full">
                  <div className="animate-pulse flex flex-col items-center gap-4">
                    <div className="h-12 w-48 bg-slate-200 dark:bg-slate-700 rounded-lg"></div>
                    <div className="h-64 w-full bg-slate-200 dark:bg-slate-700 rounded-lg"></div>
                  </div>
                </div>
              }
            >
              {children}
            </Suspense>
          </div>
        </main>
      </div>
    </div>
  )
}
