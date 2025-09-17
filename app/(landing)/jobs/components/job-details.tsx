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

  return (
    <>
      <div className="bg-white h-full overflow-y-auto">
        {/* Header Section */}
        <div className="p-6 relative">
          <button onClick={onClose} className="absolute top-4 left-4 bg-gray-100 hover:bg-gray-200 rounded-full p-2">
            <ArrowRight className="w-5 h-5 text-gray-600 rotate-180" />
          </button>
          <div className="mt-12 flex items-start gap-4">
            <div className="bg-black rounded-full w-14 h-14 flex items-center justify-center text-white">
              <span className="font-bold text-sm">{jobData?.company?.slice(0,7) || "Mark-It"}</span>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold">{jobData?.title || "UI/UX Designer"}</h1>
                <CheckCircle className="w-5 h-5 text-primary" />
              </div>
              <div className="text-muted-foreground">{jobData?.company || "Fb Mark-It Place"}</div>
              <div className="text-sm text-muted-foreground flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                <span>9/686 Jumper Road, Fernway Drive, San Jose Del Monte Malancat, Pampanga, NCR</span>
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
              <span className="text-sm">On-the-Job Training</span>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="w-3 h-3 text-muted-foreground" />
              <span className="text-sm">Closes at March 28, 2025</span>
            </div>
            <div className="flex items-center gap-3">
              <DollarSign className="w-3 h-3 text-muted-foreground" />
              <span className="text-sm">800 / Day</span>
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="w-3 h-3 text-muted-foreground" />
              <span className="text-sm">Posted 7 days ago</span>
            </div>
            <div className="flex items-center gap-3">
              <Users className="w-3 h-3 text-muted-foreground" />
              <span className="text-sm">5 vacancies</span>
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
            Passionate about creating beautiful, high-performance web applications? We&apos;re looking for a Frontend
            Developer with experience in React, Next.js, and TailwindCSS to join our fast-growing team. You&apos;ll work
            closely with designers and backend engineers to build sleek, scalable, and user-friendly interfaces. This is a
            remote first role with flexible hours, competitive pay, and opportunities for career growth!
          </p>

          <h3 className="font-semibold mt-6 mb-2">Responsibilities</h3>
          <ul className="text-sm text-muted-foreground space-y-2 list-disc pl-5">
            <li>
              Develop and maintain responsive, high-performance web applications using React.js, Next.js, and TailwindCSS.
            </li>
            <li>Collaborate with UI/UX designers to implement beautiful and functional designs.</li>
            <li>Optimize web applications for speed, scalability, and accessibility.</li>
            <li>Work with backend engineers to integrate APIs and manage data flow efficiently.</li>
            <li>Write clean, reusable, and maintainable code while following best practices.</li>
            <li>Participate in code reviews and contribute to improving our development workflows.</li>
          </ul>

          <h3 className="font-semibold mt-6 mb-2">Qualifications</h3>
          <h4 className="text-sm font-medium mb-2">Must-Haves:</h4>
          <ul className="text-sm text-muted-foreground space-y-2 list-disc pl-5">
            <li>2+ years of experience in Frontend Development (React.js, Next.js).</li>
            <li>Proficiency in HTML, CSS, JavaScript, and TailwindCSS.</li>
            <li>Strong understanding of component-based architecture and state management.</li>
            <li>Experience with RESTful APIs & handling asynchronous requests.</li>
            <li>Ability to write clean, efficient, and well-documented code.</li>
            <li>A good eye for design and attention to detail.</li>
          </ul>

          <h4 className="text-sm font-medium mt-4 mb-2">Nice-to-Haves:</h4>
          <ul className="text-sm text-muted-foreground space-y-2 list-disc pl-5">
            <li>Experience with TypeScript.</li>
            <li>Knowledge of backend technologies (Node.js, Express, Firebase, or similar).</li>
            <li>Familiarity with CI/CD and version control (Git, GitHub).</li>
            <li>Knowledge of SEO & web performance optimization.</li>
          </ul>

          <h3 className="font-semibold mt-6 mb-2">Perks and Benefits</h3>
          <ul className="text-sm text-muted-foreground space-y-2 list-disc pl-5">
            <li>Remote & Flexible Work: Work from anywhere with flexible hours.</li>
            <li>Competitive Salary & Bonuses: Performance-based incentives.</li>
            <li>Learning & Growth: Access to courses, workshops, and conferences.</li>
            <li>Paid Time Off: Generous vacation and sick leave.</li>
            <li>Tech Allowance: We provide the tools you need to succeed!</li>
          </ul>
        </div>

        <Separator />

        {/* Job Posted By */}
        <div className="p-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200">
                <Image
                  src="/placeholder.svg?height=48&width=48"
                  alt="Profile picture"
                  width={48}
                  height={48}
                  className="object-cover"
                />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">Juan Ponce Dionisio</span>
                  <CheckCircle className="w-4 h-4 text-primary" />
                </div>
                <span className="text-xs text-muted-foreground">HR Manager at {jobData?.company || "FB Mark-It Place"}</span>
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
              <div className="w-16 h-16 flex items-center justify-center bg-gray-100 rounded-md overflow-hidden">
                <div className="relative w-12 h-12">
                  <svg viewBox="0 0 100 100" className="w-full h-full">
                    <circle cx="50" cy="25" r="20" fill="#FF4D8D" />
                    <circle cx="25" cy="75" r="20" fill="#4D8DFF" />
                    <circle cx="75" cy="75" r="20" fill="#8DFF4D" />
                    <path d="M50,45 L35,65 L65,65 Z" fill="#8D4DFF" />
                  </svg>
                </div>
              </div>

              <div className="flex-1">
                <h3 className="font-bold">{jobData?.company || "Job-All Tech Solutions"}</h3>
                <div className="text-sm font-medium">Software Development</div>
                <div className="text-xs text-muted-foreground mt-1">San Francisco, USA | Berlin, Germany</div>
                <div className="text-xs text-muted-foreground">Medium (200-500 employees)</div>
              </div>
            </div>

            <p className="text-sm text-muted-foreground mt-4">
              Job-All Tech Solutions is a leading software development company specializing in AI-driven solutions and
              enterprise applications. With a global presence in San Francisco and Berlin, we are committed to innovation,
              efficiency, and excellence...
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

