/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import { useState } from "react"
import { X, ChevronDown } from "lucide-react"
import { TbMailStar } from "react-icons/tb"

const statusOptions = [
  "New", "Shortlisted", "Interview", "Hired", "Rejected", "Waitlisted", "Invited"
]
const experienceOptions = [
  "0-1 years", "2-3 years", "4-5 years", "6+ years", "No experience"
]

export default function FilterModal({
  open,
  onClose,
  onApply,
  skills = [],
  locations = [],
  courses = [],
  years = [],
  initial = {}
}: {
  open: boolean
  onClose: () => void
  onApply: (filters: any) => void
  skills?: string[]
  locations?: string[]
  courses?: string[]
  years?: string[]
  degrees?: string[]
  initial?: any
}) {
  const [selectedStatus, setSelectedStatus] = useState<string[]>(initial.status || [])
  const [selectedExperience, setSelectedExperience] = useState<string[]>(initial.experience || [])
  const [selectedSkills, setSelectedSkills] = useState<string[]>(initial.skills || [])
  const [selectedLocation, setSelectedLocation] = useState<string[]>(initial.location || [])
  const [selectedCourse, setSelectedCourse] = useState<string[]>(initial.course || [])
  const [selectedYear, setSelectedYear] = useState<string[]>(initial.year || [])
  const [dateFrom, setDateFrom] = useState(initial.dateFrom || "")
  const [dateTo, setDateTo] = useState(initial.dateTo || "")
  const [showInvitedOnly, setShowInvitedOnly] = useState(initial.showInvitedOnly || false)


  const [expandedSections, setExpandedSections] = useState({
    status: true,
    experience: true,
    skills: true,
    location: true,
    course: true,
    year: true,
    dateRange: true,
  })

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }))
  }

  const handleApply = () => {
    onApply({
      status: selectedStatus,
      experience: selectedExperience,
      skills: selectedSkills,
      location: selectedLocation,
      course: selectedCourse,
      year: selectedYear,
      dateFrom,
      dateTo,
      showInvitedOnly,
    })
    onClose()
  }

  const handleClear = () => {
    setSelectedStatus([])
    setSelectedExperience([])
    setSelectedSkills([])
    setSelectedLocation([])
    setSelectedCourse([])
    setSelectedYear([])
    setDateFrom("")
    setDateTo("")
    setShowInvitedOnly(false)
  }

  const activeFilterCount =
    selectedStatus.length +
    selectedExperience.length +
    selectedSkills.length +
    selectedLocation.length +
    selectedCourse.length +
    selectedYear.length +
    (dateFrom ? 1 : 0) +
    (dateTo ? 1 : 0) +
    (showInvitedOnly ? 1 : 0)

  if (!open) return null

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Filters</h2>
            {activeFilterCount > 0 && (
              <p className="text-sm text-blue-600 mt-1">
                {activeFilterCount} filter{activeFilterCount !== 1 ? "s" : ""} applied
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5 text-slate-600" />
          </button>
        </div>
        <div className="overflow-y-auto flex-1 p-6 space-y-6">
          <div className="border border-slate-200 rounded-lg overflow-hidden">
            <button
              onClick={() => setShowInvitedOnly((v: boolean) => !v)}
              className="w-full flex items-center justify-between p-4 hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <TbMailStar className="w-5 h-5 text-blue-600" />
                <h3 className="font-semibold text-slate-900">Show Invited Candidates Only</h3>
                {showInvitedOnly && (
                  <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-blue-600 rounded-full">
                    1
                  </span>
                )}
              </div>
              <input
                type="checkbox"
                checked={showInvitedOnly}
                onChange={() => setShowInvitedOnly((v: boolean) => !v)}
                className="w-5 h-5 accent-blue-600"
              />
            </button>
            {showInvitedOnly && (
              <div className="px-4 pb-4 pt-2 border-t border-slate-200 bg-white flex items-center gap-2 text-blue-700 text-sm">
                <TbMailStar className="w-4 h-4" />
                Only applicants who came from your invitation link or email will be shown.
              </div>
            )}
          </div>
          <FilterSection
            title="Status"
            isExpanded={expandedSections.status}
            onToggle={() => toggleSection("status")}
            activeCount={selectedStatus.length}
          >
            <div className="grid grid-cols-2 gap-3">
              {statusOptions.map(option => (
                <label key={option} className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={selectedStatus.includes(option)}
                    onChange={() =>
                      setSelectedStatus(selectedStatus.includes(option)
                        ? selectedStatus.filter(s => s !== option)
                        : [...selectedStatus, option])
                    }
                    className="w-4 h-4 rounded border-slate-300 text-blue-600 cursor-pointer accent-blue-600"
                  />
                  <span className="text-sm text-slate-700 group-hover:text-slate-900">{option}</span>
                </label>
              ))}
            </div>
          </FilterSection>
          <FilterSection
            title="Experience"
            isExpanded={expandedSections.experience}
            onToggle={() => toggleSection("experience")}
            activeCount={selectedExperience.length}
          >
            <div className="space-y-2">
              {experienceOptions.map(option => (
                <label key={option} className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={selectedExperience.includes(option)}
                    onChange={() =>
                      setSelectedExperience(selectedExperience.includes(option)
                        ? selectedExperience.filter(s => s !== option)
                        : [...selectedExperience, option])
                    }
                    className="w-4 h-4 rounded border-slate-300 text-blue-600 cursor-pointer accent-blue-600"
                  />
                  <span className="text-sm text-slate-700 group-hover:text-slate-900">{option}</span>
                </label>
              ))}
            </div>
          </FilterSection>
          <FilterSection
            title="Skills"
            isExpanded={expandedSections.skills}
            onToggle={() => toggleSection("skills")}
            activeCount={selectedSkills.length}
          >
            <div className="grid grid-cols-2 gap-3">
              {skills.map(option => (
                <label key={option} className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={selectedSkills.includes(option)}
                    onChange={() =>
                      setSelectedSkills(selectedSkills.includes(option)
                        ? selectedSkills.filter(s => s !== option)
                        : [...selectedSkills, option])
                    }
                    className="w-4 h-4 rounded border-slate-300 text-blue-600 cursor-pointer accent-blue-600"
                  />
                  <span className="text-sm text-slate-700 group-hover:text-slate-900">{option}</span>
                </label>
              ))}
            </div>
          </FilterSection>
          <FilterSection
            title="Location"
            isExpanded={expandedSections.location}
            onToggle={() => toggleSection("location")}
            activeCount={selectedLocation.length}
          >
            <div className="grid grid-cols-2 gap-3">
              {locations.map(option => (
                <label key={option} className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={selectedLocation.includes(option)}
                    onChange={() =>
                      setSelectedLocation(selectedLocation.includes(option)
                        ? selectedLocation.filter(s => s !== option)
                        : [...selectedLocation, option])
                    }
                    className="w-4 h-4 rounded border-slate-300 text-blue-600 cursor-pointer accent-blue-600"
                  />
                  <span className="text-sm text-slate-700 group-hover:text-slate-900">{option}</span>
                </label>
              ))}
            </div>
          </FilterSection>
          <FilterSection
            title="Course"
            isExpanded={expandedSections.course}
            onToggle={() => toggleSection("course")}
            activeCount={selectedCourse.length}
          >
            <div className="grid grid-cols-2 gap-3">
              {courses.map(option => (
                <label key={option} className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={selectedCourse.includes(option)}
                    onChange={() =>
                      setSelectedCourse(selectedCourse.includes(option)
                        ? selectedCourse.filter(s => s !== option)
                        : [...selectedCourse, option])
                    }
                    className="w-4 h-4 rounded border-slate-300 text-blue-600 cursor-pointer accent-blue-600"
                  />
                  <span className="text-sm text-slate-700 group-hover:text-slate-900">{option}</span>
                </label>
              ))}
            </div>
          </FilterSection>
          <FilterSection
            title="Year"
            isExpanded={expandedSections.year}
            onToggle={() => toggleSection("year")}
            activeCount={selectedYear.length}
          >
            <div className="grid grid-cols-2 gap-3">
              {years.map(option => (
                <label key={option} className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={selectedYear.includes(option)}
                    onChange={() =>
                      setSelectedYear(selectedYear.includes(option)
                        ? selectedYear.filter(s => s !== option)
                        : [...selectedYear, option])
                    }
                    className="w-4 h-4 rounded border-slate-300 text-blue-600 cursor-pointer accent-blue-600"
                  />
                  <span className="text-sm text-slate-700 group-hover:text-slate-900">{option}</span>
                </label>
              ))}
            </div>
          </FilterSection>
          <FilterSection
            title="Application Date Range"
            isExpanded={expandedSections.dateRange}
            onToggle={() => toggleSection("dateRange")}
            activeCount={dateFrom || dateTo ? 1 : 0}
          >
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">From</label>
                <input
                  type="date"
                  value={dateFrom}
                  onChange={e => setDateFrom(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">To</label>
                <input
                  type="date"
                  value={dateTo}
                  onChange={e => setDateTo(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </FilterSection>
        </div>
        <div className="flex gap-3 p-6 border-t border-slate-200 bg-slate-50">
          <button
            onClick={handleClear}
            className="flex-1 px-4 py-2.5 border border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-slate-100 transition-colors"
          >
            Reset
          </button>
          <button
            onClick={handleApply}
            className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  )
}

function FilterSection({
  title,
  isExpanded,
  onToggle,
  activeCount,
  children,
}: {
  title: string
  isExpanded: boolean
  onToggle: () => void
  activeCount: number
  children: React.ReactNode
}) {
  return (
    <div className="border border-slate-200 rounded-lg overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-4 hover:bg-slate-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <h3 className="font-semibold text-slate-900">{title}</h3>
          {activeCount > 0 && (
            <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-blue-600 rounded-full">
              {activeCount}
            </span>
          )}
        </div>
        <ChevronDown className={`w-5 h-5 text-slate-600 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
      </button>
      {isExpanded && <div className="px-4 pb-4 pt-4 border-t border-slate-200 bg-white">{children}</div>}
    </div>
  )
}
