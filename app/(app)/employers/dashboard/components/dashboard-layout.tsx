import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

interface DashboardLayoutProps {
  children: ReactNode
  className?: string
}

export function DashboardLayout({ children, className }: DashboardLayoutProps) {
  return (
    <div className={cn("p-6 bg-gradient-to-br from-blue-50 to-blue-100 min-h-screen", className)}>
      <div className="mx-auto max-w-7xl space-y-6">{children}</div>
    </div>
  )
}

interface DashboardHeaderProps {
  children: ReactNode
  className?: string
}

export function DashboardHeader({ children, className }: DashboardHeaderProps) {
  return (
    <header
      className={cn(
        "mt-20 bg-gradient-to-r from-blue-600 to-blue-500 rounded-2xl p-6 shadow-lg",
        className
      )}
    >
      {children}
    </header>
  )
}

interface DashboardMainProps {
  children: ReactNode
  className?: string
}

export function DashboardMain({ children, className }: DashboardMainProps) {
  return <main className={cn("grid grid-cols-1 md:grid-cols-12 gap-6", className)}>{children}</main>
}

interface DashboardSectionProps {
  children: ReactNode
  className?: string
  colSpan?: string
}

export function DashboardSection({
  children,
  className,
  colSpan = "col-span-12 md:col-span-6 lg:col-span-4",
}: DashboardSectionProps) {
  return <section className={cn(colSpan, className)}>{children}</section>
}
