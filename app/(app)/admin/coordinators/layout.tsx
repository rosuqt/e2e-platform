"use client"

import type React from "react"

import { useState, useEffect, Suspense } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { BarChart3, Users, LogOut, Menu, ChevronDown, Search, Bell, Flag, Settings } from "lucide-react"
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
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"

interface NavItem {
  title: string
  href: string
  icon: React.ElementType
  badge?: number
  submenu?: { title: string; href: string; badge?: number }[]
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024)
    }
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  useEffect(() => {
    const currentSubmenu = navItems.find((item) => item.submenu?.some((subItem) => pathname === subItem.href))
    if (currentSubmenu) {
      setOpenSubmenu(currentSubmenu.title)
    }
  }, [pathname])

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
    // In a real application, you would clear authentication tokens/cookies here
    console.log("Logging out...")

    // Redirect to login page
    router.push("/login")
  }

  const NavContent = () => (
    <div className="flex flex-col h-full">
      <div className="p-6 border-b border-slate-200 dark:border-slate-700">
        <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
          Coordinator Portal
        </h1>
      </div>
      <div className="flex-1 py-6 overflow-auto">
        <nav className="space-y-2 px-3">
          {navItems.map((item) => (
            <div key={item.title}>
              {item.submenu ? (
                <div className="space-y-1">
                  <button
                    onClick={() => toggleSubmenu(item.title)}
                    className={`flex items-center justify-between w-full px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                      isSubmenuActive(item.submenu)
                        ? "bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
                        : "text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
                    }`}
                  >
                    <div className="flex items-center">
                      <item.icon className="mr-3 h-5 w-5" />
                      {item.title}
                      {item.badge && (
                        <Badge
                          variant="secondary"
                          className="ml-2 bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300"
                        >
                          {item.badge}
                        </Badge>
                      )}
                    </div>
                    <ChevronDown
                      className={`h-4 w-4 transition-transform duration-200 ${
                        openSubmenu === item.title ? "transform rotate-180" : ""
                      }`}
                    />
                  </button>
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
                              ? "bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
                              : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                          }`}
                        >
                          <span>{subItem.title}</span>
                          {subItem.badge && (
                            <Badge
                              variant="outline"
                              className="bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800"
                            >
                              {subItem.badge}
                            </Badge>
                          )}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <Link
                  href={item.href}
                  className={`flex items-center justify-between px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                    isActive(item.href)
                      ? "bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
                      : "text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
                  }`}
                >
                  <div className="flex items-center">
                    <item.icon className="mr-3 h-5 w-5" />
                    {item.title}
                  </div>
                  {item.badge && (
                    <Badge
                      variant="secondary"
                      className="bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300"
                    >
                      {item.badge}
                    </Badge>
                  )}
                </Link>
              )}
            </div>
          ))}
        </nav>
      </div>
      <div className="p-4 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 rounded-lg mx-3 mb-3">
        <div className="flex items-center">
          <Avatar className="h-10 w-10 border-2 border-white shadow-sm">
            <AvatarImage src="/placeholder.svg?height=40&width=40" alt="Jane Smith" />
            <AvatarFallback className="bg-blue-100 text-blue-600">JS</AvatarFallback>
          </Avatar>
          <div className="ml-3 flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-700 dark:text-slate-200 truncate">Jane Smith</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">IT Department</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full hover:bg-slate-200 dark:hover:bg-slate-700"
            onClick={handleLogout}
          >
            <LogOut className="h-5 w-5 text-slate-600 dark:text-slate-400" />
          </Button>
        </div>
      </div>
    </div>
  )

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
      {/* Sidebar for desktop */}
      <div className="hidden lg:block w-72 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-700 shadow-sm overflow-y-auto">
        <NavContent />
      </div>

      {/* Mobile sidebar */}
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="lg:hidden absolute top-4 left-4 z-50">
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-72 border-r border-slate-200 dark:border-slate-700">
          <NavContent />
        </SheetContent>
      </Sheet>

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
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    <Avatar className="h-8 w-8 border-2 border-white dark:border-slate-700 shadow-sm">
                      <AvatarImage src="/placeholder.svg?height=32&width=32" alt="Jane Smith" />
                      <AvatarFallback className="bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300">
                        JS
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-56 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
                >
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Jane Smith</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">jane.smith@example.com</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-slate-200 dark:bg-slate-700" />
                  <DropdownMenuItem className="cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800">
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800">
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-slate-200 dark:bg-slate-700" />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="cursor-pointer text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 focus:bg-red-50 dark:focus:bg-red-900/20"
                  >
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
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
