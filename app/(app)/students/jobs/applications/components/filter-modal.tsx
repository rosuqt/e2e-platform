"use client"
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
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
function pretty(raw: string) {
  if (!raw) return "(Blank)"
  return toTitleCase(raw)
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
  const [showAdvanced, setShowAdvanced] = useState(false)
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

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl p-0 overflow-hidden">
        <div className="px-6 py-4 border-b bg-white">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold">
              Filters {activeCount ? <span className="ml-2 text-xs bg-blue-100 text-blue-700 rounded-full px-2 py-0.5">{activeCount} active</span> : null}
            </DialogTitle>
          </DialogHeader>
        </div>
        <div className="px-6 py-5 space-y-4 max-h-[70vh] overflow-y-auto bg-white">
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
                <label className="text-xs font-medium text-gray-600">Match Score Min</label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={local.matchScoreMin ?? ""}
                  onChange={e => setLocal({ ...local, matchScoreMin: e.target.value ? Number(e.target.value) : undefined })}
                  className="border rounded px-2 py-1 text-xs"
                  placeholder="0"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs font-medium text-gray-600">Match Score Max</label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={local.matchScoreMax ?? ""}
                  onChange={e => setLocal({ ...local, matchScoreMax: e.target.value ? Number(e.target.value) : undefined })}
                  className="border rounded px-2 py-1 text-xs"
                  placeholder="100"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs font-medium text-gray-600">Applied Date From</label>
                <input
                  type="date"
                  value={local.dateFrom ?? ""}
                  onChange={e => setLocal({ ...local, dateFrom: e.target.value || undefined })}
                  className="border rounded px-2 py-1 text-xs"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs font-medium text-gray-600">Applied Date To</label>
                <input
                  type="date"
                  value={local.dateTo ?? ""}
                  onChange={e => setLocal({ ...local, dateTo: e.target.value || undefined })}
                  className="border rounded px-2 py-1 text-xs"
                />
              </div>
            </div>
          </Collapsible>
        </div>
        <DialogFooter className="px-6 py-4 bg-gray-50 flex gap-2">
          <Button variant="outline" onClick={clearAll} disabled={!activeCount}>Reset</Button>
          <Button variant="outline" onClick={onClose}>Close</Button>
          <Button onClick={() => onApply(local)}>Apply</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

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
    <div className="grid grid-cols-2 gap-2">
      {values.map(v => {
        const active = selected.includes(v)
        return (
          <label
            key={v || "_blank"}
            className={`flex items-center gap-2 rounded-md border px-2 py-1 text-xs cursor-pointer ${
              active ? "bg-blue-600 border-blue-600 text-white" : "bg-white border-gray-300 hover:border-blue-400"
            }`}
          >
            <input
              type="checkbox"
              checked={active}
              onChange={() => onToggle(v)}
              className="accent-blue-600"
            />
            <span>{toTitleCase(v) || "(Blank)"}</span>
          </label>
        )
      })}
    </div>
  )
}
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
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center justify-between px-4 py-2 text-sm font-semibold hover:bg-gray-50"
      >
        <span className="flex items-center gap-2">
          {toTitleCase(label)}
          {count > 0 && (
            <span className="inline-flex items-center justify-center w-5 h-5 text-[10px] font-bold bg-blue-600 text-white rounded-full">
              {count}
            </span>
          )}
        </span>
        <span className={`transition-transform text-gray-500 ${open ? "rotate-180" : ""}`}>⌄</span>
      </button>
      {open && <div className="px-4 py-3 bg-white border-t border-gray-200">{children}</div>}
    </div>
  )
}
