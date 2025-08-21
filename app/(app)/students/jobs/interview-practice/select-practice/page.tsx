"use client"
import Link from "next/link"
import { ArrowLeft, Briefcase, Users } from "lucide-react"
import { useEffect, useState } from "react"
import Button from "@mui/material/Button"
import Menu from "@mui/material/Menu"
import MenuItem from "@mui/material/MenuItem"
import ListSubheader from "@mui/material/ListSubheader"
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown"
import { TiChevronRight } from "react-icons/ti"

const techJobs = [
  "Software Engineer",
  "Frontend Developer",
  "Backend Developer",
  "IT Support Specialist",
  "Data Analyst"
]
const hospitalityJobs = [
  "Hotel Manager",
  "Front Desk Agent",
  "Housekeeping Supervisor",
  "Food and Beverage Manager",
  "Event Coordinator"
]
const tourismJobs = [
  "Tour Guide",
  "Travel Consultant",
  "Reservation Agent",
  "Tourism Marketing Specialist",
  "Cruise Staff"
]
const businessJobs = [
  "Business Analyst",
  "Marketing Manager",
  "Sales Representative",
  "Accountant",
  "Human Resources Coordinator"
]

export default function SelectPractice() {
  const [jobTitles, setJobTitles] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [selected, setSelected] = useState<string>("")
  const open = Boolean(anchorEl)

  useEffect(() => {
    fetch("/api/interview-practice/fetchApplications")
      .then(res => res.json())
      .then(data => {
        setJobTitles(data.jobTitles || [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const handleSelect = (title: string) => {
    setSelected(title)
    setAnchorEl(null)
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-sky-50 to-indigo-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <Link
          href="/students/jobs/interview-practice"
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium mb-8 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Home
        </Link>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-1"></div>
          <div className="p-8 md:p-12">
            <h1 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-4">
              What Do You Want to Practice?
            </h1>
            <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
              Choose the type of interview practice that best fits your needs. We&apos;ll tailor the experience to help you
              succeed.
            </p>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Specific Job Option */}
              <div className="bg-white border border-gray-100 rounded-xl p-8 flex flex-col items-center text-center hover:shadow-lg transition-all group">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Briefcase className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">Job-Specific Practice</h3>
                <p className="text-gray-600 mb-8">
                  Choose a specific job title to get interview questions tailored to that role&apos;s requirements and
                  expectations.
                </p>
                <div className="relative w-full flex flex-col items-center">
                  <div className="flex w-full gap-4 justify-center px-4">
                    <Button
                      variant="outlined"
                      color="primary"
                      endIcon={<KeyboardArrowDownIcon />}
                      onClick={handleMenuClick}
                      className="!justify-between !rounded-xl !shadow-sm"
                      disabled={loading && jobTitles.length === 0}
                      sx={{
                        minWidth: 220,
                        borderRadius: 3,
                        borderColor: "#2563eb",
                        bgcolor: "#f8fafc",
                        color: "#2563eb",
                        fontWeight: 600,
                        fontSize: "16px",
                        px: 3,
                        py: 1.7,
                        textTransform: "none",
                        boxShadow: "0 2px 8px 0 rgba(37,99,235,0.06)",
                        '&:hover': {
                          bgcolor: "#e0edff",
                          borderColor: "#2563eb"
                        }
                      }}
                    >
                      {loading
                        ? "Loading..."
                        : selected
                          ? selected
                          : "Select a Job Title"}
                    </Button>
                    {selected && (
                      <Button
                        variant="contained"
                        color="primary"
                        sx={{
                          minWidth: 110,
                          borderRadius: 3,
                          fontWeight: 600,
                          fontSize: "16px",
                          textTransform: "none",
                          bgcolor: "#2563eb",
                          boxShadow: "0 2px 8px 0 rgba(37,99,235,0.12)",
                          '&:hover': { bgcolor: "#1746a2" }
                        }}
                        href={`interview/job-specific?title=${encodeURIComponent(selected)}`}
                      >
                        Start <span className="ml-2"><TiChevronRight  size={20} /></span>
                      </Button>
                    )}
                  </div>
                  <Menu
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleMenuClose}
                    PaperProps={{
                      style: {
                        width: "100%",
                        maxWidth: 340,
                        maxHeight: 320,
                        marginTop: 8
                      }
                    }}
                    anchorOrigin={{
                      vertical: "bottom",
                      horizontal: "left"
                    }}
                    transformOrigin={{
                      vertical: "top",
                      horizontal: "left"
                    }}
                  >
                    <ListSubheader
                      disableSticky
                      sx={{
                        bgcolor: "#e0edff",
                        color: "#2563eb",
                        fontWeight: 700,
                        borderRadius: 1,
                        mx: 1,
                        my: 1,
                        py: 0.5,
                        px: 2,
                        fontSize: "0.95rem"
                      }}
                    >
                      Job titles you&apos;ve applied for
                    </ListSubheader>
                    {jobTitles.length === 0 && !loading ? (
                      <MenuItem disabled>You havent applied to any jobs yet.</MenuItem>
                    ) : (
                      jobTitles.map(title => (
                        <MenuItem
                          key={"your-" + title}
                          selected={selected === title}
                          onClick={() => handleSelect(title)}
                        >
                          {title}
                        </MenuItem>
                      ))
                    )}
                    <ListSubheader
                      disableSticky
                      sx={{
                        bgcolor: "#e0edff",
                        color: "#2563eb",
                        fontWeight: 700,
                        borderRadius: 1,
                        mx: 1,
                        my: 1,
                        py: 0.5,
                        px: 2,
                        fontSize: "0.95rem"
                      }}
                    >
                      Technology
                    </ListSubheader>
                    {techJobs.map(title => (
                      <MenuItem
                        key={"tech-" + title}
                        selected={selected === title}
                        onClick={() => handleSelect(title)}
                      >
                        {title}
                      </MenuItem>
                    ))}
                    <ListSubheader
                      disableSticky
                      sx={{
                        bgcolor: "#e0edff",
                        color: "#2563eb",
                        fontWeight: 700,
                        borderRadius: 1,
                        mx: 1,
                        my: 1,
                        py: 0.5,
                        px: 2,
                        fontSize: "0.95rem"
                      }}
                    >
                      Hospitality
                    </ListSubheader>
                    {hospitalityJobs.map(title => (
                      <MenuItem
                        key={"hosp-" + title}
                        selected={selected === title}
                        onClick={() => handleSelect(title)}
                      >
                        {title}
                      </MenuItem>
                    ))}
                    <ListSubheader
                      disableSticky
                      sx={{
                        bgcolor: "#e0edff",
                        color: "#2563eb",
                        fontWeight: 700,
                        borderRadius: 1,
                        mx: 1,
                        my: 1,
                        py: 0.5,
                        px: 2,
                        fontSize: "0.95rem"
                      }}
                    >
                      Tourism
                    </ListSubheader>
                    {tourismJobs.map(title => (
                      <MenuItem
                        key={"tour-" + title}
                        selected={selected === title}
                        onClick={() => handleSelect(title)}
                      >
                        {title}
                      </MenuItem>
                    ))}
                    <ListSubheader
                      disableSticky
                      sx={{
                        bgcolor: "#e0edff",
                        color: "#2563eb",
                        fontWeight: 700,
                        borderRadius: 1,
                        mx: 1,
                        my: 1,
                        py: 0.5,
                        px: 2,
                        fontSize: "0.95rem"
                      }}
                    >
                      Business
                    </ListSubheader>
                    {businessJobs.map(title => (
                      <MenuItem
                        key={"biz-" + title}
                        selected={selected === title}
                        onClick={() => handleSelect(title)}
                      >
                        {title}
                      </MenuItem>
                    ))}
                  </Menu>
                </div>
              </div>

              {/* Generic Interview Option */}
              <div className="bg-white border border-gray-100 rounded-xl p-8 flex flex-col items-center text-center hover:shadow-lg transition-all group">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Users className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">Generic Interview</h3>
                <p className="text-gray-600 mb-8">
                  Practice with a variety of common interview questions that apply to any job and help build core
                  interview skills.
                </p>
                <Link
                  href="interview/generic"
                  className="inline-flex items-center gap-2 bg-white border-2 border-blue-500 text-blue-600 hover:bg-blue-50 font-medium px-6 py-3 rounded-xl transition-all w-full max-w-xs justify-center shadow-sm hover:shadow-md"
                >
                  Start Generic Practice <span className="text-lg">✨</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
