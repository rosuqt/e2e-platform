"use client"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"

type MinimalJobPosting = {
  work_type?: string
  remote_options?: string
  location?: string
  pay_type?: string
  verification_tier?: string
}

type MinimalApplication = {
  status?: string
  job_postings?: MinimalJobPosting
  company_name?: string
  match_score?: string
  applied_at?: string
}

export type Filters = {
  status?: string[]
  workType?: string[]
  remote?: string[]
  location?: string[]
  payType?: string[]
  verification?: string[]
  company?: string[]
  matchScoreMin?: number
  matchScoreMax?: number
  dateFrom?: string
  dateTo?: string
}

type MultiSelectKeys =
  | "status"
  | "workType"
  | "remote"
  | "location"
  | "payType"
  | "verification"
  | "company"

function toTitleCase(raw: string) {
  return raw
    .split(/[\s_-]+/)
    .map(p => p ? p.charAt(0).toUpperCase() + p.slice(1).toLowerCase() : p)
    .join(" ")
}


export function StudentFilterModal({
  open,
  onClose,
  onApply,
  initial,
  sourceApps
}: {
  open: boolean
  onClose: () => void
  onApply: (f: Filters) => void
  initial: Filters
  sourceApps: MinimalApplication[]
}) {
  const statuses = Array.from(new Set(sourceApps.map(a => (a.status || "").toLowerCase()).filter(Boolean)))
  const workTypes = Array.from(new Set(sourceApps.map(a => (a.job_postings?.work_type || "").toLowerCase()).filter(Boolean)))
  const remoteOpts = Array.from(new Set(sourceApps.map(a => (a.job_postings?.remote_options || "").toLowerCase()).filter(Boolean)))
  const locations = Array.from(new Set(sourceApps.map(a => (a.job_postings?.location || "").toLowerCase()).filter(Boolean)))
  const payTypes = Array.from(new Set(sourceApps.map(a => (a.job_postings?.pay_type || "").toLowerCase()).filter(Boolean)))
  const verificationTiers = Array.from(new Set(sourceApps.map(a => (a.job_postings?.verification_tier || "").toLowerCase()).filter(Boolean)))
  const companies = Array.from(new Set(sourceApps.map(a => (a.company_name || "").toLowerCase()).filter(Boolean)))

  const [local, setLocal] = useState<Filters>(initial)
  const [expanded, setExpanded] = useState<Record<string, boolean>>({
    status: true,
    workType: true,
    remote: true,
    location: true,
    payType: true,
    verification: true,
    company: true,
    advanced: true
  })

  function toggle(key: MultiSelectKeys, value: string) {
    const current = (local[key] ?? []) as string[]
    const set = new Set<string>(current)
    if (set.has(value)) set.delete(value); else set.add(value)
    setLocal({ ...local, [key]: Array.from(set) })
  }
  function toggleSection(k: string) {
    setExpanded(e => ({ ...e, [k]: !e[k] }))
  }

  const activeCount = [
    local.status?.length ?? 0,
    local.workType?.length ?? 0,
    local.remote?.length ?? 0,
    local.location?.length ?? 0,
    local.payType?.length ?? 0,
    local.verification?.length ?? 0,
    local.company?.length ?? 0,
    local.matchScoreMin ? 1 : 0,
    local.matchScoreMax ? 1 : 0,
    local.dateFrom ? 1 : 0,
    local.dateTo ? 1 : 0
  ].reduce((acc, val) => acc + val, 0)

  function clearAll() {
    setLocal({})
    onApply({})
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-blue-900/30 backdrop-blur-sm">
      <AnimatePresence>
        <motion.div
          className="bg-white rounded-2xl shadow-2xl ring-1 ring-blue-100 w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <div className="flex justify-between items-center px-8 pt-8 pb-3 border-b border-blue-100">
            <h2 className="text-2xl font-bold text-gray-800">
              Filters {activeCount ? <span className="ml-2 text-xs bg-blue-600/10 text-blue-700 rounded-full px-2 py-0.5">{activeCount} active</span> : null}
            </h2>
            <Button variant="ghost" onClick={onClose} className="text-blue-500 hover:text-blue-600 text-lg px-2 py-1">
              ×
            </Button>
          </div>
          <div className="px-8 pt-3 pb-4 text-xs leading-relaxed text-blue-800 bg-blue-50/60 border-b border-blue-100">
            Refine application results with the filters below. Apply to update the list, or Reset to clear all selections.
          </div>
          <div className="flex-1 px-8 py-4 overflow-y-auto space-y-4">
            <Collapsible
              label="Status"
              count={local.status?.length || 0}
              open={expanded.status}
              onToggle={() => toggleSection("status")}
            >
              <CheckboxGrid
                values={statuses}
                selected={local.status || []}
                onToggle={v => toggle("status", v)}
              />
            </Collapsible>

            <Collapsible
              label="Work Type"
              count={local.workType?.length || 0}
              open={expanded.workType}
              onToggle={() => toggleSection("workType")}
            >
              <CheckboxGrid
                values={workTypes}
                selected={local.workType || []}
                onToggle={v => toggle("workType", v)}
              />
            </Collapsible>

            <Collapsible
              label="Remote Options"
              count={local.remote?.length || 0}
              open={expanded.remote}
              onToggle={() => toggleSection("remote")}
            >
              <CheckboxGrid
                values={remoteOpts}
                selected={local.remote || []}
                onToggle={v => toggle("remote", v)}
              />
            </Collapsible>

            <Collapsible
              label="Location"
              count={local.location?.length || 0}
              open={expanded.location}
              onToggle={() => toggleSection("location")}
            >
              <CheckboxGrid
                values={locations}
                selected={local.location || []}
                onToggle={v => toggle("location", v)}
              />
            </Collapsible>

            <Collapsible
              label="Pay Type"
              count={local.payType?.length || 0}
              open={expanded.payType}
              onToggle={() => toggleSection("payType")}
            >
              <CheckboxGrid
                values={payTypes}
                selected={local.payType || []}
                onToggle={v => toggle("payType", v)}
              />
            </Collapsible>

            <Collapsible
              label="Verification Tier"
              count={local.verification?.length || 0}
              open={expanded.verification}
              onToggle={() => toggleSection("verification")}
            >
              <CheckboxGrid
                values={verificationTiers}
                selected={local.verification || []}
                onToggle={v => toggle("verification", v)}
              />
            </Collapsible>

            <Collapsible
              label="Company"
              count={local.company?.length || 0}
              open={expanded.company}
              onToggle={() => toggleSection("company")}
            >
              <CheckboxGrid
                values={companies}
                selected={local.company || []}
                onToggle={v => toggle("company", v)}
              />
            </Collapsible>

            <Collapsible
              label="Advanced"
              count={
                (local.matchScoreMin ? 1 : 0) +
                (local.matchScoreMax ? 1 : 0) +
                (local.dateFrom ? 1 : 0) +
                (local.dateTo ? 1 : 0)
              }
              open={expanded.advanced}
              onToggle={() => toggleSection("advanced")}
            >
              <div className="grid gap-4 md:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-medium text-blue-800">Match Score Min</label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={local.matchScoreMin ?? ""}
                    onChange={e => setLocal({ ...local, matchScoreMin: e.target.value ? Number(e.target.value) : undefined })}
                    className="h-10 rounded-lg border border-blue-200 bg-white px-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500"
                    placeholder="0"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-medium text-blue-800">Match Score Max</label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={local.matchScoreMax ?? ""}
                    onChange={e => setLocal({ ...local, matchScoreMax: e.target.value ? Number(e.target.value) : undefined })}
                    className="h-10 rounded-lg border border-blue-200 bg-white px-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500"
                    placeholder="100"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-medium text-blue-800">Applied Date From</label>
                  <input
                    type="date"
                    value={local.dateFrom ?? ""}
                    onChange={e => setLocal({ ...local, dateFrom: e.target.value || undefined })}
                    className="h-10 rounded-lg border border-blue-200 bg-white px-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-medium text-blue-800">Applied Date To</label>
                  <input
                    type="date"
                    value={local.dateTo ?? ""}
                    onChange={e => setLocal({ ...local, dateTo: e.target.value || undefined })}
                    className="h-10 rounded-lg border border-blue-200 bg-white px-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500"
                  />
                </div>
              </div>
            </Collapsible>
          </div>

          <div className="flex justify-end items-center px-8 py-6 border-t border-blue-100 bg-blue-50 gap-3">
            <Button
              variant="outline"
              onClick={clearAll}
              disabled={!activeCount}
              className="border-blue-200 text-blue-700 bg-white hover:bg-blue-50 px-8 py-4 rounded-full"
            >
              Reset
            </Button>
            <Button
              variant="outline"
              onClick={onClose}
              className="border-blue-200 text-blue-700 bg-white hover:bg-blue-50 px-8 py-4 rounded-full"
            >
              Close
            </Button>
            <Button
              onClick={() => onApply(local)}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 px-9 py-4 rounded-full"
            >
              Apply
            </Button>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

// Replace checkbox tiles with pill chips
function CheckboxGrid({
  values,
  selected,
  onToggle
}: {
  values: string[]
  selected: string[]
  onToggle: (v: string) => void
}) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
      {values.map(v => {
        const active = selected.includes(v)
        return (
          <button
            key={v || "_blank"}
            type="button"
            onClick={() => onToggle(v)}
            className={`rounded-full border px-4 py-2 text-xs font-medium transition-colors ${
              active
                ? "bg-blue-600 border-blue-600 text-white shadow-sm"
                : "bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100"
            }`}
            aria-pressed={active}
          >
            {toTitleCase(v) || "(Blank)"}
          </button>
        )
      })}
    </div>
  )
}

// Animated collapsible like quick-edit aesthetics
function Collapsible({
  label,
  count,
  open,
  onToggle,
  children
}: {
  label: string
  count: number
  open: boolean
  onToggle: () => void
  children: React.ReactNode
}) {
  return (
    <div className="rounded-xl border border-blue-200 overflow-hidden">
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center justify-between px-5 py-3 text-sm font-medium bg-blue-50 hover:bg-blue-100"
      >
        <span className="flex items-center gap-2 text-blue-900">
          {toTitleCase(label)}
          {count > 0 && (
            <span className="inline-flex items-center justify-center min-w-[20px] h-5 px-2 text-[10px] font-bold bg-blue-600/10 text-blue-700 rounded-full">
              {count}
            </span>
          )}
        </span>
        <svg
          className={`h-4 w-4 text-blue-600 transition-transform ${open ? "rotate-180" : ""}`}
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M5.23 7.21a.75.75 0 011.06.02L10 10.157l3.71-2.926a.75.75 0 11.94 1.172l-4.2 3.313a.75.75 0 01-.94 0l-4.2-3.313a.75.75 0 01-.08-1.172z" />
        </svg>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="border-t border-blue-200 bg-white"
          >
            <div className="px-5 py-4">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
