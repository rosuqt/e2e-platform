"use client"
import {
  ArrowRight,
  CheckCircle,
  MapPin,
  Users,
  Mail,
  Bookmark,
  Briefcase,
  Clock,
  DollarSign,
  Calendar,
} from "lucide-react"
import { Divider as Separator } from "@mui/material"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Image from "next/image"
import ReactECharts from "echarts-for-react"
import { useState, useEffect } from "react"
import clsx from "clsx"
import CtaModal from "./cta-modal"

type JobData = {
  id: number
  course: string
  job: string
  company: string
  title: string
  description: string
  match: number
  logo?: string
  salary?: string
  location?: string
  posted?: string
  vacancies?: number
  employmentType?: string
  closesAt?: string
}

const defaultResponsibilities = [
  "Develop and maintain responsive, high-performance web applications using React.js, Next.js, and TailwindCSS.",
  "Collaborate with UI/UX designers to implement beautiful and functional designs.",
  "Optimize web applications for speed, scalability, and accessibility.",
  "Work with backend engineers to integrate APIs and manage data flow efficiently.",
  "Write clean, reusable, and maintainable code while following best practices.",
  "Participate in code reviews and contribute to improving our development workflows.",
]

const defaultQualifications = [
  "2+ years of experience in Frontend Development (React.js, Next.js).",
  "Proficiency in HTML, CSS, JavaScript, and TailwindCSS.",
  "Strong understanding of component-based architecture and state management.",
  "Experience with RESTful APIs & handling asynchronous requests.",
  "Ability to write clean, efficient, and well-documented code.",
  "A good eye for design and attention to detail.",
]

const defaultNiceToHaves = [
  "Experience with TypeScript.",
  "Knowledge of backend technologies (Node.js, Express, Firebase, or similar).",
  "Familiarity with CI/CD and version control (Git, GitHub).",
  "Knowledge of SEO & web performance optimization.",
]

const defaultPerks = [
  "Remote & Flexible Work: Work from anywhere with flexible hours.",
  "Competitive Salary & Bonuses: Performance-based incentives.",
  "Learning & Growth: Access to courses, workshops, and conferences.",
  "Paid Time Off: Generous vacation and sick leave.",
  "Tech Allowance: We provide the tools you need to succeed!",
]

const companyProfiles: Record<string, { 
  name: string, 
  role: string, 
  profilePic: string, 
  about: string, 
  size: string, 
  locations: string 
}> = {
  "Blueberry Labs": {
    name: "Ava Blueberry",
    role: "HR Manager at Blueberry Labs",
    profilePic: "/images/random-profiles/1.png",
    about: "Blueberry Labs is a creative tech startup building next-gen web platforms for global clients. We value innovation, collaboration, and a fun work environment.",
    size: "Small (10-50 employees)",
    locations: "Cebu City, Philippines",
  },
  "Quantum Byte": {
    name: "Eli Quantum",
    role: "Lead Recruiter at Quantum Byte",
    profilePic: "/images/random-profiles/2.png",
    about: "Quantum Byte specializes in high-performance software engineering and scalable cloud solutions for fintech and e-commerce.",
    size: "Medium (100-300 employees)",
    locations: "Singapore | Manila",
  },
  "PixelForge": {
    name: "Mira Forge",
    role: "Talent Acquisition at PixelForge",
    profilePic: "/images/random-profiles/3.png",
    about: "PixelForge delivers digital transformation and system integration for enterprises, focusing on reliability and security.",
    size: "Large (500+ employees)",
    locations: "Makati, PH | Tokyo, JP",
  },
  "Nebula Studios": {
    name: "Leo Nebula",
    role: "People Ops at Nebula Studios",
    profilePic: "/images/random-profiles/4.png",
    about: "Nebula Studios crafts beautiful, user-centric digital products for startups and established brands worldwide.",
    size: "Small (20-80 employees)",
    locations: "Remote | Davao City",
  },
  "CyberNest": {
    name: "Rina Cyber",
    role: "HR Specialist at CyberNest",
    profilePic: "/images/random-profiles/5.png",
    about: "CyberNest is a cybersecurity firm protecting businesses from digital threats with advanced monitoring and response.",
    size: "Medium (100-200 employees)",
    locations: "Ortigas, PH",
  },
  "Lemonade Media": {
    name: "Sam Lemon",
    role: "HR Partner at Lemonade Media",
    profilePic: "/images/random-profiles/6.png",
    about: "Lemonade Media is a digital marketing agency helping brands grow through creative campaigns and data-driven strategies.",
    size: "Small (15-60 employees)",
    locations: "Quezon City, PH",
  },
  "Minty Metrics": {
    name: "Tina Mint",
    role: "Finance Recruiter at Minty Metrics",
    profilePic: "/images/profile7.png",
    about: "Minty Metrics provides financial analytics and consulting for fast-growing businesses in Southeast Asia.",
    size: "Medium (80-150 employees)",
    locations: "Taguig, PH",
  },
  "Orchid People Solutions": {
    name: "Orly Orchid",
    role: "HR Director at Orchid People Solutions",
    profilePic: "/images/profile8.png",
    about: "Orchid People Solutions offers HR consulting and talent management for modern organizations.",
    size: "Small (10-40 employees)",
    locations: "Remote | BGC",
  },
  "Crimson Advisory": {
    name: "Chris Crimson",
    role: "Consultant Lead at Crimson Advisory",
    profilePic: "/images/profile9.png",
    about: "Crimson Advisory delivers business consulting and transformation services for startups and enterprises.",
    size: "Medium (60-120 employees)",
    locations: "Pasig, PH",
  },
  "Startup Sprout": {
    name: "Sandy Sprout",
    role: "Startup Mentor at Startup Sprout",
    profilePic: "/images/profile10.png",
    about: "Startup Sprout is an incubator supporting entrepreneurs with mentorship, funding, and resources.",
    size: "Small (5-20 employees)",
    locations: "Remote | Cebu",
  },
  "Sunrise Travels": {
    name: "Sunny Day",
    role: "HR at Sunrise Travels",
    profilePic: "/images/profile11.png",
    about: "Sunrise Travels offers unique travel experiences and guided tours across Asia.",
    size: "Medium (50-100 employees)",
    locations: "Manila | Boracay",
  },
  "Wanderlust Agency": {
    name: "Wendy Wander",
    role: "Talent Manager at Wanderlust Agency",
    profilePic: "/images/profile12.png",
    about: "Wanderlust Agency is a travel agency specializing in custom itineraries and travel planning.",
    size: "Small (10-30 employees)",
    locations: "Davao | Online",
  },
  "Eventure": {
    name: "Eve Planner",
    role: "Event Coordinator at Eventure",
    profilePic: "/images/profile13.png",
    about: "Eventure organizes memorable events, conferences, and celebrations for clients nationwide.",
    size: "Small (15-40 employees)",
    locations: "Makati, PH",
  },
  "Skyline Airways": {
    name: "Skye Lin",
    role: "HR at Skyline Airways",
    profilePic: "/images/profile14.png",
    about: "Skyline Airways is a regional airline focused on customer service and safety.",
    size: "Large (300+ employees)",
    locations: "Clark, PH",
  },
  "Azure Shores Resort": {
    name: "Azure Lee",
    role: "HR at Azure Shores Resort",
    profilePic: "/images/profile15.png",
    about: "Azure Shores Resort is a luxury destination offering world-class amenities and hospitality.",
    size: "Medium (80-200 employees)",
    locations: "Palawan, PH",
  },
  "Maple Leaf Hotels": {
    name: "Maple Green",
    role: "HR at Maple Leaf Hotels",
    profilePic: "/images/profile16.png",
    about: "Maple Leaf Hotels is a boutique hotel chain known for comfort and personalized service.",
    size: "Medium (60-150 employees)",
    locations: "Baguio | Tagaytay",
  },
  "Peppercorn Bistro": {
    name: "Pepper Cook",
    role: "HR at Peppercorn Bistro",
    profilePic: "/images/profile17.png",
    about: "Peppercorn Bistro is a modern restaurant serving fusion cuisine in a cozy setting.",
    size: "Small (10-30 employees)",
    locations: "Quezon City, PH",
  },
  "Saffron Table": {
    name: "Saffy Chef",
    role: "HR at Saffron Table",
    profilePic: "/images/profile18.png",
    about: "Saffron Table is a fine dining restaurant specializing in international flavors.",
    size: "Small (10-25 employees)",
    locations: "Makati, PH",
  },
  "Olive Grove Hospitality": {
    name: "Ollie Grove",
    role: "HR at Olive Grove Hospitality",
    profilePic: "/images/profile19.png",
    about: "Olive Grove Hospitality manages hotels and restaurants with a focus on sustainability and guest experience.",
    size: "Medium (70-180 employees)",
    locations: "Cebu | Iloilo",
  },
  "Golden Spoon Events": {
    name: "Goldie Spoon",
    role: "HR at Golden Spoon Events",
    profilePic: "/images/profile20.png",
    about: "Golden Spoon Events provides catering and event management for all occasions.",
    size: "Small (15-40 employees)",
    locations: "Manila, PH",
  },
}

const JobDetails = ({ onClose, jobData }: { onClose: () => void; jobData?: JobData }) => {
  const [currentState, setCurrentState] = useState(0)
  const [showText, setShowText] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const states = [
    { value: jobData?.match || 15, color: "#22c55e", label: jobData?.match ? `${jobData.match}%` : "15%" },
    { value: 36, color: "#f97316", label: "36%" },
    { value: 98, color: "#22c55e", label: "98%" },
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentState((prev) => (prev + 1) % states.length)
    }, 2000)
    return () => clearInterval(interval)
  }, [states.length])

  useEffect(() => {
    const timeout = setTimeout(() => setShowText(true), 500)
    return () => clearTimeout(timeout)
  }, [])

  const chartOptions = {
    series: [
      {
        type: "pie",
        radius: ["70%", "100%"],
        avoidLabelOverlap: false,
        label: { show: false },
        data: [
          { value: states[currentState].value, itemStyle: { color: states[currentState].color } },
          { value: 100 - states[currentState].value, itemStyle: { color: "#e5e7eb" } },
        ],
      },
    ],
  }

  // Example dynamic fields, fallback to defaults if not present
  const salary = jobData?.salary || "800 / Day"
  const location = jobData?.location || "Muntinlupa"
  const posted = jobData?.posted || "Posted 7 days ago"
  const vacancies = jobData?.vacancies || 5
  const employmentType = jobData?.employmentType || "Full-time"
  const closesAt = jobData?.closesAt || "March 28, 2025"

  const company = jobData?.company || "Blueberry Labs"
  const companyProfile = companyProfiles[company] || {
    name: "Juan Ponce Dionisio",
    role: `HR Manager at ${company}`,
    profilePic: "/images/random-profiles/1.png",
    about: "A leading company in its field.",
    size: "Medium (200-500 employees)",
    locations: "Philippines",
  }

  return (
    <>
      <div className="bg-white h-full overflow-y-auto">
        {/* Header Section */}
        <div className="p-6 relative">
          <button onClick={onClose} className="absolute top-4 left-4 bg-gray-100 hover:bg-gray-200 rounded-full p-2">
            <ArrowRight className="w-5 h-5 text-gray-600 rotate-180" />
          </button>
          <div className="mt-12 flex items-start gap-4">
            <div className="w-14 h-14 rounded-full flex items-center justify-center overflow-hidden text-white bg-blue-100">
              {jobData?.logo ? (
                <Image
                  src={
                    jobData.logo.startsWith("/images/")
                      ? jobData.logo
                      : `/images/${jobData.logo.replace(/^\//, "")}`
                  }
                  alt="Company logo"
                  width={56}
                  height={56}
                  className="object-cover"
                  unoptimized
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/images/placeholder.png"
                  }}
                />
              ) : (
                <span className="font-bold text-sm">{jobData?.company?.slice(0,7) || "Mark-It"}</span>
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold">{jobData?.title || "UI/UX Designer"}</h1>
                <CheckCircle className="w-5 h-5 text-primary" />
              </div>
              <div className="text-muted-foreground">{jobData?.company || "Fb Mark-It Place"}</div>
              <div className="text-sm text-muted-foreground flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                <span>{location}</span>
              </div>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-4">
          </div>

          <div className="mt-4 flex gap-3">
            <Button className="gap-2 rounded-full" onClick={() => setIsModalOpen(true)}>
              <Mail className="w-4 h-4" />
              <span className="text-white px-3">Apply</span>
            </Button>
            <Button
              variant="outline"
              className="gap-2 rounded-full border-blue-600 text-blue-600 hover:bg-blue-50 px-5"
              onClick={() => setIsModalOpen(true)}
            >
              <Bookmark className="w-4 h-4" />
              <span>Save</span>
            </Button>
          </div>

          <p className="mt-4 text-sm text-muted-foreground">
            {jobData?.description ||
              "Seeking a creative UI/UX Designer to craft intuitive and visually engaging user experiences. You will design user-friendly interfaces that enhance functionality and aesthetics."}
          </p>
        </div>

        <Separator />

        {/* Job Details Section */}
        <div className="p-6">
          <h2 className="text-lg font-semibold mb-4">Job Details</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <Briefcase className="w-3 h-3 text-muted-foreground" />
              <span className="text-sm">{employmentType}</span>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="w-3 h-3 text-muted-foreground" />
              <span className="text-sm">Closes at {closesAt}</span>
            </div>
            <div className="flex items-center gap-3">
              <DollarSign className="w-3 h-3 text-muted-foreground" />
              <span className="text-sm">{salary}</span>
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="w-3 h-3 text-muted-foreground" />
              <span className="text-sm">{posted}</span>
            </div>
            <div className="flex items-center gap-3">
              <Users className="w-3 h-3 text-muted-foreground" />
              <span className="text-sm">{vacancies} vacancies</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="w-3 h-3 text-muted-foreground" />
              <span className="text-sm">Recommended for {jobData?.course || "BSIT"} Students</span>
            </div>
          </div>
        </div>

        <Separator />

        {/* Match Percentage */}
        <div className="p-6">
          <div className="flex items-start gap-4">
            <div className="relative w-20 h-20">
              <ReactECharts option={chartOptions} style={{ height: "100%", width: "100%" }} />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xl font-bold">{states[currentState].label}</span>
              </div>
            </div>
            <div className="flex-1">
              <h3
                className={clsx(
                  "text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500 font-semibold text-lg",
                  "animate-shiny",
                  { "opacity-0": !showText, "opacity-100 transition-opacity duration-500": showText }
                )}
              >
                Get a Personalized Job Match Percentage
              </h3>
              <p className="text-xs text-muted-foreground mt-1">
                Job match percentage indicates how well a job aligns with your profile, skills, and resume—helping you find roles tailored to your qualifications and experience.
              </p>
              <div className="mt-4 flex justify-end">
  
              </div>
            </div>
          </div>
        </div>

        <Separator />

        {/* About the Job */}
        <div className="p-6">
          <h2 className="text-lg font-semibold mb-4">About the Job</h2>
          <p className="text-sm text-muted-foreground mb-4">
            {jobData?.description ||
              "Passionate about creating beautiful, high-performance web applications? We're looking for a Frontend Developer with experience in React, Next.js, and TailwindCSS to join our fast-growing team. You'll work closely with designers and backend engineers to build sleek, scalable, and user-friendly interfaces. This is a remote first role with flexible hours, competitive pay, and opportunities for career growth!"}
          </p>

          <h3 className="font-semibold mt-6 mb-2">Responsibilities</h3>
          <ul className="text-sm text-muted-foreground space-y-2 list-disc pl-5">
            {(jobData?.job === "Web Developer" || jobData?.job === "Software Engineer" || jobData?.job === "UI/UX Designer")
              ? defaultResponsibilities.map((r, i) => <li key={i}>{r}</li>)
              : defaultResponsibilities.map((r, i) => <li key={i}>{r}</li>)
            }
          </ul>

          <h3 className="font-semibold mt-6 mb-2">Qualifications</h3>
          <h4 className="text-sm font-medium mb-2">Must-Haves:</h4>
          <ul className="text-sm text-muted-foreground space-y-2 list-disc pl-5">
            {defaultQualifications.map((q, i) => <li key={i}>{q}</li>)}
          </ul>

          <h4 className="text-sm font-medium mt-4 mb-2">Nice-to-Haves:</h4>
          <ul className="text-sm text-muted-foreground space-y-2 list-disc pl-5">
            {defaultNiceToHaves.map((n, i) => <li key={i}>{n}</li>)}
          </ul>

          <h3 className="font-semibold mt-6 mb-2">Perks and Benefits</h3>
          <ul className="text-sm text-muted-foreground space-y-2 list-disc pl-5">
            {defaultPerks.map((p, i) => <li key={i}>{p}</li>)}
          </ul>
        </div>

        <Separator />

        {/* Job Posted By */}
        <div className="p-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200">
                <Image
                  src={companyProfile.profilePic}
                  alt="Profile picture"
                  width={48}
                  height={48}
                  className="object-cover"
                />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">{companyProfile.name}</span>
                  <CheckCircle className="w-4 h-4 text-primary" />
                </div>
                <span className="text-xs text-muted-foreground">{companyProfile.role}</span>
              </div>
            </div>
            <Button variant="outline" className="rounded-full" onClick={() => setIsModalOpen(true)}>
              Message
            </Button>
          </div>
        </div>

        <Separator />

        {/* About the Company */}
        <Card className="m-6">
          <div className="p-6">
            <h2 className="text-xl font-bold mb-6">About the Company</h2>
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 flex items-center justify-center bg-blue-100 rounded-md overflow-hidden">
                {jobData?.logo ? (
                  <Image
                    src={
                      jobData.logo.startsWith("/images/")
                        ? jobData.logo
                        : `/images/${jobData.logo.replace(/^\//, "")}`
                    }
                    alt="Company logo"
                    width={48}
                    height={48}
                    className="object-cover"
                    unoptimized
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "/images/placeholder.png"
                    }}
                  />
                ) : (
                  <div className="relative w-12 h-12">
                    <svg viewBox="0 0 100 100" className="w-full h-full">
                      <circle cx="50" cy="25" r="20" fill="#FF4D8D" />
                      <circle cx="25" cy="75" r="20" fill="#4D8DFF" />
                      <circle cx="75" cy="75" r="20" fill="#8DFF4D" />
                      <path d="M50,45 L35,65 L65,65 Z" fill="#8D4DFF" />
                    </svg>
                  </div>
                )}
              </div>
              <div className="flex-1">
                <h3 className="font-bold">{company}</h3>
                <div className="text-sm font-medium">{jobData?.job || "Software Development"}</div>
                <div className="text-xs text-muted-foreground mt-1">{companyProfile.locations}</div>
                <div className="text-xs text-muted-foreground">{companyProfile.size}</div>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mt-4">
              {companyProfile.about}
            </p>
            <div className="mt-2 text-right">
              <Button variant="link" className="p-0 h-auto text-primary" onClick={() => setIsModalOpen(true)}>
                View company
              </Button>
            </div>
          </div>
        </Card>
      </div>
      <CtaModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  )
}

export default JobDetails

