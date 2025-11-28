/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useMemo } from "react"
import { motion } from "framer-motion"
import { TrendingUp, AlertCircle, CheckCircle, Clock } from "lucide-react"

type DashboardProps = {
  jobInfo: any
  logs: any[]
  refreshKey: number
}

export default function DTRDashboard({ jobInfo, logs, refreshKey }: DashboardProps) {
  const stats = useMemo(() => {
    const totalHoursLogged = logs.reduce((acc, log) => acc + (log.hours || 0), 0)
    const targetHours = jobInfo.totalHours || 0
    const percentComplete = targetHours > 0 ? (totalHoursLogged / targetHours) * 100 : 0
    const remainingHours = Math.max(0, targetHours - totalHoursLogged)
    const daysLogged = new Set(logs.map((log) => log.date)).size
    const startDate = new Date(jobInfo.startDate)
    const today = new Date()
    const daysSinceStart = Math.floor((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1

    // Detect absents - days without logs
    const allDatesInRange: string[] = []
    const currentDate = new Date(startDate)
    while (currentDate <= today) {
      allDatesInRange.push(currentDate.toISOString().split("T")[0])
      currentDate.setDate(currentDate.getDate() + 1)
    }
    const datesWithLogs = new Set(logs.map((log) => log.date))
    const absentDays = allDatesInRange.filter((date) => !datesWithLogs.has(date))

    return {
      totalHoursLogged,
      percentComplete: Math.min(100, percentComplete),
      remainingHours,
      daysLogged,
      daysSinceStart,
      absentDays: absentDays.length,
      isNearCompletion: percentComplete >= 80,
      isCompleted: percentComplete >= 100,
      targetHours,
    }
  }, [logs, jobInfo, refreshKey])

  const cards = [
    {
      title: "Hours Logged",
      value: `${stats.totalHoursLogged}/${stats.targetHours}`,
      icon: Clock,
      color: "from-blue-500 to-blue-600",
      textColor: "text-blue-600",
    },
    {
      title: "Completion",
      value: `${Math.round(stats.percentComplete)}%`,
      icon: TrendingUp,
      color: "from-sky-500 to-sky-600",
      textColor: "text-sky-600",
    },
    {
      title: "Days Logged",
      value: `${stats.daysLogged}/${stats.daysSinceStart}`,
      icon: CheckCircle,
      color: "from-emerald-500 to-emerald-600",
      textColor: "text-emerald-600",
    },
    {
      title: "Absent Days",
      value: stats.absentDays,
      icon: AlertCircle,
      color: "from-amber-500 to-amber-600",
      textColor: "text-amber-600",
    },
  ]

  return (
    <div className="space-y-6">
      {/* Status Alerts */}
      {stats.isCompleted && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-green-100 to-emerald-100 border border-green-300 rounded-lg p-4 flex items-center gap-3"
        >
          <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
          <div>
            <p className="font-bold text-green-900">Congratulations!</p>
            <p className="text-sm text-green-800">You have completed your required hours.</p>
          </div>
        </motion.div>
      )}

      {stats.isNearCompletion && !stats.isCompleted && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-amber-100 to-orange-100 border border-amber-300 rounded-lg p-4 flex items-center gap-3"
        >
          <TrendingUp className="w-6 h-6 text-amber-600 flex-shrink-0" />
          <div>
            <p className="font-bold text-amber-900">Almost there!</p>
            <p className="text-sm text-amber-800">You need {stats.remainingHours.toFixed(1)} more hours to complete.</p>
          </div>
        </motion.div>
      )}

      {stats.absentDays > 3 && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-red-100 to-rose-100 border border-red-300 rounded-lg p-4 flex items-center gap-3"
        >
          <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0" />
          <div>
            <p className="font-bold text-red-900">Attendance Alert</p>
            <p className="text-sm text-red-800">
              You have {stats.absentDays} days without logged hours. Try to maintain consistency.
            </p>
          </div>
        </motion.div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card, index) => {
          const Icon = card.icon
          return (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-blue-100/50 p-6 hover:shadow-md transition-all"
            >
              <div className={`inline-block p-3 rounded-lg bg-gradient-to-br ${card.color} mb-4`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
              <p className="text-sm text-gray-600 mb-1">{card.title}</p>
              <p className={`text-3xl font-bold ${card.textColor}`}>{card.value}</p>
            </motion.div>
          )
        })}
      </div>

      {/* Progress Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-blue-100/50 p-6"
      >
        <div className="flex items-center justify-between mb-3">
          <p className="font-semibold text-gray-900">Overall Progress</p>
          <p className="text-sm font-bold text-blue-600">{Math.round(stats.percentComplete)}%</p>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${stats.percentComplete}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="h-full bg-gradient-to-r from-blue-500 to-sky-500 rounded-full"
          />
        </div>
        <p className="text-xs text-gray-600 mt-3">
          {stats.remainingHours > 0 ? `${stats.remainingHours.toFixed(1)} hours remaining` : "All hours completed!"}
        </p>
      </motion.div>
    </div>
  )
}
