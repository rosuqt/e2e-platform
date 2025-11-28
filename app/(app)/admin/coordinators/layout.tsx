"use client"

import type React from "react"
import { useState, useEffect, Suspense } from "react"
import Link from "next/link"
import { usePathname} from "next/navigation"
import {
  BarChart3,
  Users,
  LogOut,
  Menu,
  ChevronDown,
  Search,
  Bell,
  Flag,
  Settings,
  Shield,
  User,
  X,
  MessageCircle,
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { useSession, signOut } from "next-auth/react"

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
    href: "/admin/coordinators/dashboard",
    icon: BarChart3,
  },
  {
    title: "Student Management",
    href: "/admin/coordinators/students",
    icon: Users,
    badge: 3,
  },
  {
    title: "Messaging",
    href: "/admin/coordinators/messages",
    icon: MessageCircle
  },
  {
    title: "Report Management",
    href: "#",
    icon: Flag,
    badge: 12,
    submenu: [
      { title: "Reported Employers", href: "/admin/coordinators/reports/employers", badge: 5 },
      { title: "Reported Companies", href: "/admin/coordinators/reports/companies", badge: 3 },
      { title: "Reported Listings", href: "/admin/coordinators/reports/listings", badge: 2 },
      { title: "Reported Students", href: "/admin/coordinators/reports/students", badge: 2 },
    ],
  },
]

const sidebarVariants = {
  expanded: {
    width: 280,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 40,
      mass: 1,
    },
  },
  collapsed: {
    width: 80,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 40,
      mass: 1,
    },
  },
}

const contentVariants = {
  expanded: {
    opacity: 1,
    x: 0,
    transition: {
      delay: 0.1,
      duration: 0.3,
      ease: "easeOut",
    },
  },
  collapsed: {
    opacity: 0,
    x: -10,
    transition: {
      duration: 0.2,
      ease: "easeIn",
    },
  },
}

function MobileNavigation({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
          />
          <motion.div
            className="fixed left-0 top-0 bottom-0 z-50 w-80 bg-white shadow-2xl lg:hidden"
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 30,
            }}
          >
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between p-6 border-b border-gray-100">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-lg font-bold text-gray-900">Coordinator</h1>
                    <p className="text-xs text-gray-500">Portal</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
                  <X className="w-5 h-5" />
                </Button>
              </div>
              <div className="flex-1 overflow-auto py-4">
                <NavContent onItemClick={onClose} />
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

function NavContent({ minimized = false, onItemClick }: { minimized?: boolean; onItemClick?: () => void }) {
  const pathname = usePathname()
  // const router = useRouter() // Remove unused router
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null)
  const { data: session } = useSession()

  useEffect(() => {
    const currentSubmenu = navItems.find((item) => item.submenu?.some((subItem) => pathname === subItem.href))
    if (currentSubmenu) {
      setOpenSubmenu(currentSubmenu.title)
    }
  }, [pathname])

  const toggleSubmenu = (title: string) => {
    if (minimized) return
    setOpenSubmenu(openSubmenu === title ? null : title)
  }

  const isActive = (href: string) => pathname === href
  const isSubmenuActive = (submenu: { title: string; href: string }[]) => submenu.some((item) => pathname === item.href)

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/admin/login" })
  }

  return (
    <div className="flex flex-col h-full">
      <nav className={cn("space-y-2", minimized ? "px-3" : "px-6")}>
        {navItems.map((item, index) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            {item.submenu ? (
              <div className="space-y-1">
                <button
                  onClick={() => toggleSubmenu(item.title)}
                  className={cn(
                    "flex items-center justify-between w-full px-4 py-3 text-sm font-medium rounded-2xl transition-all duration-300 group relative overflow-hidden",
                    isSubmenuActive(item.submenu)
                      ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-indigo-500/25"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50",
                    minimized && "justify-center px-3",
                  )}
                >
                  <div className="flex items-center space-x-3">
                    <item.icon className={cn("w-5 h-5 transition-transform duration-300", minimized && "w-6 h-6")} />
                    <AnimatePresence>
                      {!minimized && (
                        <motion.div
                          variants={contentVariants}
                          initial="collapsed"
                          animate="expanded"
                          exit="collapsed"
                          className="flex items-center space-x-2"
                        >
                          <span className="font-medium">{item.title}</span>
                          {item.badge && (
                            <Badge
                              variant="secondary"
                              className={cn(
                                "text-xs px-2 py-0.5 rounded-full",
                                isSubmenuActive(item.submenu)
                                  ? "bg-white/20 text-white"
                                  : "bg-indigo-100 text-indigo-600",
                              )}
                            >
                              {item.badge}
                            </Badge>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  <AnimatePresence>
                    {!minimized && (
                      <motion.div variants={contentVariants} initial="collapsed" animate="expanded" exit="collapsed">
                        <ChevronDown
                          className={cn(
                            "w-4 h-4 transition-transform duration-300",
                            openSubmenu === item.title && "rotate-180",
                          )}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </button>
                <AnimatePresence>
                  {!minimized && openSubmenu === item.title && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{
                        height: { duration: 0.3, ease: "easeInOut" },
                        opacity: { duration: 0.2, delay: 0.1 },
                      }}
                      className="overflow-hidden"
                    >
                      <div className="pl-6 pr-4 py-2 space-y-1">
                        {item.submenu.map((subItem, subIndex) => (
                          <motion.div
                            key={subItem.title}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: subIndex * 0.05 }}
                          >
                            <Link
                              href={subItem.href}
                              onClick={onItemClick}
                              className={cn(
                                "flex items-center justify-between px-4 py-2.5 text-sm font-medium rounded-xl transition-all duration-200",
                                isActive(subItem.href)
                                  ? "bg-gradient-to-r from-blue-50 to-purple-50 text-indigo-600 border border-indigo-100"
                                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50",
                              )}
                            >
                              <span>{subItem.title}</span>
                              {subItem.badge && (
                                <Badge
                                  variant="outline"
                                  className={cn(
                                    "text-xs px-2 py-0.5 rounded-full border",
                                    isActive(subItem.href)
                                      ? "bg-indigo-100 text-indigo-600 border-indigo-200"
                                      : "bg-gray-100 text-gray-600 border-gray-200",
                                  )}
                                >
                                  {subItem.badge}
                                </Badge>
                              )}
                            </Link>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link
                href={item.href}
                onClick={onItemClick}
                className={cn(
                  "flex items-center space-x-3 px-4 py-3 text-sm font-medium rounded-2xl transition-all duration-300 group relative overflow-hidden",
                  isActive(item.href)
                    ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-indigo-500/25"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50",
                  minimized && "justify-center px-3",
                )}
              >
                <item.icon className={cn("w-5 h-5 transition-transform duration-300", minimized && "w-6 h-6")} />
                <AnimatePresence>
                  {!minimized && (
                    <motion.div
                      variants={contentVariants}
                      initial="collapsed"
                      animate="expanded"
                      exit="collapsed"
                      className="flex items-center space-x-2"
                    >
                      <span className="font-medium">{item.title}</span>
                      {item.badge && (
                        <Badge
                          variant="secondary"
                          className={cn(
                            "text-xs px-2 py-0.5 rounded-full",
                            isActive(item.href) ? "bg-white/20 text-white" : "bg-indigo-100 text-indigo-600",
                          )}
                        >
                          {item.badge}
                        </Badge>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </Link>
            )}
          </motion.div>
        ))}
      </nav>

      <div className="mt-auto p-6">
        <div
          className={cn(
            "flex items-center space-x-3 p-4 rounded-2xl bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200",
            minimized && "justify-center space-x-0",
          )}
        >
          <Avatar className="w-10 h-10 ring-2 ring-white shadow-sm">
            <AvatarImage
              src="/placeholder.svg?height=40&width=40"
              alt={
                (session?.user && typeof session.user === "object" && "firstName" in session.user
                  ? (session.user as { firstName?: string }).firstName
                  : "") || ""
              }
            />
            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold">
              {(session?.user && typeof session.user === "object" && "firstName" in session.user
                ? ((session.user as { firstName?: string }).firstName?.[0] || "")
                : "")}
              {(session?.user && typeof session.user === "object" && "lastName" in session.user
                ? ((session.user as { lastName?: string }).lastName?.[0] || "")
                : "")}
            </AvatarFallback>
          </Avatar>
          <AnimatePresence>
            {!minimized && (
              <motion.div
                variants={contentVariants}
                initial="collapsed"
                animate="expanded"
                exit="collapsed"
                className="flex-1 min-w-0"
              >
                <p className="text-sm font-semibold text-gray-900 truncate">
                  {(session?.user && typeof session.user === "object" && "firstName" in session.user
                    ? (session.user as { firstName?: string }).firstName
                    : "")}
                  {" "}
                  {(session?.user && typeof session.user === "object" && "lastName" in session.user
                    ? (session.user as { lastName?: string }).lastName
                    : "")}
                </p>
                <p className="text-xs text-gray-500">
                  {(() => {
                    const role = (session?.user && typeof session.user === "object" && "role" in session.user
                      ? (session.user as { role?: string }).role
                      : "");
                    return role ? role.charAt(0).toUpperCase() + role.slice(1) : "";
                  })()}
                </p>
                <p className="text-xs text-gray-500">
                  {(() => {
                    const dept = (session?.user && typeof session.user === "object" && "department" in session.user
                      ? (session.user as { department?: string }).department
                      : "");
                    if (!dept) return "";
                    if (dept.includes("Information Technology")) return "BSIT Department";
                    if (dept.includes("Business Administration")) return "BSBA Department";
                    if (dept.includes("Hospitality Management")) return "BSHM Department";
                    if (dept.includes("Tourism Management")) return "BSTM Department";
                    if (dept.includes("ABM")) return "ABM Department";
                    if (dept.includes("HUMSS")) return "HUMSS Department";
                    if (dept.includes("IT Mobile app and Web Development")) return "ICT Department";
                    
                    return dept;
                  })()}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
          <AnimatePresence>
            {!minimized && (
              <motion.div variants={contentVariants} initial="collapsed" animate="expanded" exit="collapsed">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleLogout}
                  className="w-8 h-8 rounded-xl hover:bg-red-50 hover:text-red-600 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)
  const { data: session } = useSession()

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/admin/login" })
  }

  return (
    <Suspense fallback={null}>
      <div className="flex h-screen bg-gray-50">
        <MobileNavigation isOpen={mobileSidebarOpen} onClose={() => setMobileSidebarOpen(false)} />

        <motion.div
          className="hidden lg:flex flex-col bg-white border-r border-gray-200 shadow-sm relative z-10"
          variants={sidebarVariants}
          animate={sidebarCollapsed ? "collapsed" : "expanded"}
        >
          <div className="flex items-center justify-between p-6 border-b border-gray-100">
            <AnimatePresence>
              {!sidebarCollapsed && (
                <motion.div
                  variants={contentVariants}
                  initial="collapsed"
                  animate="expanded"
                  exit="collapsed"
                  className="flex items-center space-x-3"
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-lg font-bold text-gray-900">Coordinator</h1>
                    <p className="text-xs text-gray-500">Portal</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            {sidebarCollapsed && (
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto">
                <Shield className="w-6 h-6 text-white" />
              </div>
            )}
          </div>

          <div className="flex-1 overflow-hidden py-6">
            <NavContent minimized={sidebarCollapsed} />
          </div>

          <div className="p-4 border-t border-gray-100">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="w-full h-10 rounded-xl hover:bg-gray-100 transition-colors"
            >
              <motion.div
                animate={{ rotate: sidebarCollapsed ? 180 : 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                <ChevronDown className="w-4 h-4 rotate-90" />
              </motion.div>
            </Button>
          </div>
        </motion.div>

        <div className="flex-1 flex flex-col overflow-hidden">
          <header className="bg-white border-b border-gray-200 shadow-sm">
            <div className="flex items-center justify-between px-6 py-4">
              <div className="flex items-center space-x-4">
                <Button
                  variant="ghost"
                  size="icon"
                  className="lg:hidden rounded-xl"
                  onClick={() => setMobileSidebarOpen(true)}
                >
                  <Menu className="w-5 h-5" />
                </Button>
                <div className="relative w-full max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search..."
                    className="pl-10 bg-gray-50 border-gray-200 focus:border-indigo-300 focus:ring-indigo-200 rounded-xl"
                  />
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Button variant="ghost" size="icon" className="relative rounded-xl hover:bg-gray-100 transition-colors">
                  <Bell className="w-5 h-5 text-gray-600" />
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full ring-2 ring-white"></span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="hidden md:flex items-center space-x-2 rounded-xl border-gray-200 hover:bg-gray-50"
                >
                  <Settings className="w-4 h-4" />
                  <span>Settings</span>
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative w-10 h-10 rounded-xl">
                      <Avatar className="w-8 h-8 ring-2 ring-white shadow-sm">
                        <AvatarImage
                          src="/placeholder.svg?height=32&width=32"
                          alt={
                            `${(session?.user as { firstName?: string })?.firstName ?? ""} ${(session?.user as { lastName?: string })?.lastName ?? ""} ${(session?.user as { id?: string })?.id ?? ""}`.trim()
                          }
                        />
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-sm font-semibold">
                          {`${(session?.user as { firstName?: string })?.firstName?.[0] ?? ""}${(session?.user as { lastName?: string })?.lastName?.[0] ?? ""}${(session?.user as { id?: string })?.id?.slice(0, 2) ?? ""}`}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56 rounded-2xl shadow-xl border-gray-200" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {`${(session?.user as { firstName?: string })?.firstName ?? ""} ${(session?.user as { lastName?: string })?.lastName ?? ""}`.trim()}
                        </p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {(session?.user as { username?: string })?.username ?? ""}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="rounded-xl">
                      <User className="mr-2 w-4 h-4" />
                      Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem className="rounded-xl">
                      <Settings className="mr-2 w-4 h-4" />
                      Settings
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={handleLogout}
                      className="rounded-xl text-red-600 focus:text-red-600"
                    >
                      <LogOut className="mr-2 w-4 h-4" />
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </header>
          <main className="flex-1 overflow-auto">
            <div className="p-8">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
                <Suspense
                  fallback={
                    <div className="flex items-center justify-center h-full">
                      <div className="animate-pulse flex flex-col items-center gap-4">
                        <div className="h-12 w-48 bg-gray-200 rounded-lg"></div>
                        <div className="h-64 w-full bg-gray-200 rounded-lg"></div>
                      </div>
                    </div>
                  }
                >
                  {children}
                </Suspense>
              </motion.div>
            </div>
          </main>
        </div>
      </div>
    </Suspense>
  )
}


