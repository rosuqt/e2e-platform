"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { CheckCircle, Search, Briefcase, GraduationCap, Users, Building, MapPin, ChevronUp } from "lucide-react"
import { IoGlobeOutline } from "react-icons/io5";
import LandingFooter from "../../landing/components/landing-footer"
import JobCard from "../components/job-card"
import JobModal from "../components/job-modal"
import { Button } from "@/components/ui/button"

const fadeInUp = {
  hidden: { opacity: 0, y: 60 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
}

export default function STIHiringPage() {
  type JobType = {
    id: number
    title: string
    department: string
    location: string
    type: string
    salary: string
    posted: string
    description: string
    responsibilities: string[]
    requirements: string[]
    benefits: string[]
    status?: string
    raw: { id: string } & Record<string, unknown>
  }

  const [jobs, setJobs] = useState<JobType[]>([])
  const [selectedJob, setSelectedJob] = useState<JobType | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [filterDepartment, setFilterDepartment] = useState<string>("")
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [showScrollTop, setShowScrollTop] = useState(false)

  useEffect(() => {
    fetch("/api/superadmin/careers/fetch")
      .then(res => res.json())
      .then(({ data }) => {
        if (Array.isArray(data)) {
          setJobs(
            data.map((item, idx) => ({
              id: idx + 1,
              title: item.position_title,
              department: item.department || "",
              location: item.campus || "",
              type: item.employment_type || "",
              salary: item.salary_range || "",
              posted: item.posted_date
                ? new Date(item.posted_date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
                : "",
              description: item.job_description || "",
              responsibilities: Array.isArray(item.responsibilities)
                ? item.responsibilities
                : typeof item.responsibilities === "string" && item.responsibilities.length > 0
                  ? item.responsibilities.split(",").map((s: string) => s.trim()).filter(Boolean)
                  : [],
              requirements: Array.isArray(item.requirements)
                ? item.requirements
                : typeof item.requirements === "string" && item.requirements.length > 0
                  ? item.requirements.split(",").map((s: string) => s.trim()).filter(Boolean)
                  : [],
              benefits: Array.isArray(item.benefits)
                ? item.benefits
                : typeof item.benefits === "string" && item.benefits.length > 0
                  ? item.benefits.split(",").map((s: string) => s.trim()).filter(Boolean)
                  : [],
              status: item.status || "",
              raw: { id: String(item.id ?? idx + 1), ...item },
            }))
          )
        }
      })
  }, [])

  const openJobModal = (job: JobType) => {
    setSelectedJob(job)
    setIsModalOpen(true)
  }

  const closeJobModal = () => {
    setIsModalOpen(false)
  }

  const filteredJobs = jobs.filter((job) => {
    const matchesDepartment = filterDepartment === "" || job.department === filterDepartment
    const matchesSearch =
      searchQuery === "" ||
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesDepartment && matchesSearch
  })

  const departments = Array.from(new Set(jobs.map((job) => job.department).filter(Boolean)))

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section with Navbar */}
      <div className="relative bg-gradient-to-r from-blue-700 to-indigo-800">

        <div className="container mx-auto px-4 py-16 md:py-24 lg:py-32">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
            <motion.div className="lg:w-1/2 text-white" initial="hidden" animate="visible" variants={fadeInUp}>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                Grow your career with <span className="text-yellow-400">STI College</span>
              </h1>
              <h2 className="mt-4 text-2xl font-bold text-yellow-400 md:text-3xl">We&apos;re Hiring</h2>
              <p className="mt-6 text-medium text-blue-100 max-w-xl">
                Join a forward-thinking institution that values innovation and career growth. If you&apos;re talented,
                passionate, and excited about making a difference, there&apos;s a place for you at STI College.
              </p>

              <div className="mt-8">
                <Button
                  className="bg-yellow-400 hover:bg-yellow-500 text-blue-900 font-medium rounded-lg p-6 text-[15px] flex items-center justify-center gap-2 mt-auto"
                  onClick={() => document.getElementById("job-listings")?.scrollIntoView({ behavior: "smooth" })}
                >
                  View Open Positions <IoGlobeOutline className="w-4 h-4" />
                </Button>
              </div>
            </motion.div>

            <motion.div
              className="lg:w-1/2 relative"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7 }}
            >
              <div className="relative w-full h-[400px] md:h-[500px] rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src="https://dbuyxpovejdakzveiprx.supabase.co/storage/v1/object/public/app.images/stiprofs.png"
                  alt="STI College students and professionals"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </motion.div>
          </div>
        </div>

        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 w-full">
          <svg viewBox="0 0 1440 120" className="w-full h-auto">
            <path
              fill="white"
              d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"
            ></path>
          </svg>
        </div>
      </div>

      {/* About STI College */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeInUp}
          >
            <h2 className="text-3xl font-bold mb-4">Innovation and Excellence</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Since 1983, STI College has been shaping future-ready professionals through innovative and industry-driven
              education
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <motion.div
              className="overflow-hidden rounded-lg bg-white p-6 shadow-sm border border-gray-100"
              whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="mb-4 h-40 overflow-hidden rounded-lg">
                <Image
                  src="/images/placeholder/2.jpg"
                  alt="STI Campus"
                  width={320}
                  height={160}
                  className="h-full w-full object-cover"
                />
              </div>
              <h4 className="mb-2 text-lg font-bold text-blue-700">Modern Campuses</h4>
              <p className="text-gray-600">
                Our state-of-the-art facilities are designed to enhance the learning experience.
              </p>
            </motion.div>

            <motion.div
              className="overflow-hidden rounded-lg bg-blue-50 p-6 shadow-sm"
              whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <h4 className="mb-2 text-lg font-bold text-blue-700">Legacy of Excellence</h4>
              <p className="text-gray-600">
                With decades of experience in providing quality education, STI has established itself as a leader in the
                industry.
              </p>
            </motion.div>

            <motion.div
              className="overflow-hidden rounded-lg bg-white p-6 shadow-sm border border-gray-100"
              whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="mb-4 h-40 overflow-hidden rounded-lg">
                <Image
                  src="/images/placeholder/1.jpg"
                  alt="STI Students"
                  width={320}
                  height={160}
                  className="h-full w-full object-cover"
                />
              </div>
              <h4 className="mb-2 text-lg font-bold text-blue-700">Industry-Driven Curriculum</h4>
              <p className="text-gray-600">
                Our programs are designed in collaboration with industry leaders to ensure relevant skills development.
              </p>
            </motion.div>

            <motion.div
              className="overflow-hidden rounded-lg bg-blue-50 p-6 shadow-sm"
              whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <h4 className="mb-2 text-lg font-bold text-blue-700">Nationwide Network</h4>
              <p className="text-gray-600">
                With campuses across the country, STI offers accessibility and consistent quality education nationwide.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Ideal Candidates */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeInUp}
          >
            <h2 className="text-3xl font-bold mb-4">Ideal Candidates for Our Team</h2>
            <p className="mx-auto max-w-2xl text-gray-600">
              Below are the qualities and characteristics we look for in our ideal candidates
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Dedication",
                description: "Committed to delivering quality education and fostering student growth",
                icon: <GraduationCap className="h-6 w-6 text-blue-700" />,
              },
              {
                title: "Integrity",
                description: "Upholding high standards, responsibility and ethical conduct in all interactions",
                icon: <CheckCircle className="h-6 w-6 text-blue-700" />,
              },
              {
                title: "Commitment to Excellence",
                description: "Striving for continuous improvement and maintaining high standards in education",
                icon: <Briefcase className="h-6 w-6 text-blue-700" />,
              },
            ].map((quality, index) => (
              <motion.div
                key={index}
                className="flex flex-col items-center rounded-lg border border-gray-200 bg-white p-8 text-center shadow-sm"
                whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="mb-4 rounded-full bg-blue-100 p-4">{quality.icon}</div>
                <h3 className="mb-3 text-xl font-bold">{quality.title}</h3>
                <p className="text-gray-600">{quality.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Job Section */}
      <section className="py-16 bg-gradient-to-r from-blue-700 to-indigo-800 text-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="md:w-1/2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <span className="inline-block bg-yellow-400 text-blue-900 text-xs font-bold px-3 py-1 rounded-full mb-4">
                  FEATURED POSITION
                </span>
                <h2 className="text-3xl font-bold mb-4">Software Developer</h2>
                <p className="text-blue-100 mb-6">
                  Join our IT team to develop and maintain software applications for academic and administrative use.
                  Contribute to creating innovative solutions that enhance the educational experience.
                </p>
                <div className="flex flex-wrap gap-4 mb-6">
                  <div className="flex items-center text-blue-100">
                    <Building className="h-4 w-4 mr-2 text-yellow-400" />
                    <span>Information Technology</span>
                  </div>
                  <div className="flex items-center text-blue-100">
                    <MapPin className="h-4 w-4 mr-2 text-yellow-400" />
                    <span>STI College Alabang</span>
                  </div>
                </div>
                <Button
                  className="bg-white text-blue-700 hover:bg-blue-50"
                  onClick={() => {
                    const job = jobs.find((j) => j.title === "Software Developer")
                    if (job) {
                      openJobModal(job)
                    }
                  }}
                >
                  View Details
                </Button>
              </motion.div>
            </div>
            <div className="md:w-1/2">
              <motion.div
                className="relative h-[300px] rounded-lg overflow-hidden"
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Image
                  src="/images/placeholder/3.png"
                  alt="Software Development"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-blue-900/70 to-transparent"></div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Job Listings Section */}
      <section id="job-listings" className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeInUp}
          >
            <h2 className="text-3xl font-bold mb-4">
              <span className="text-blue-700">Career</span> <span className="text-yellow-500">Opportunities</span>
            </h2>
            <p className="mx-auto max-w-2xl text-gray-600">
              Discover rewarding positions that align with your skills and passion
            </p>
          </motion.div>

          {/* Job Categories */}
          <div className="mb-10">
            <div className="flex flex-wrap justify-center gap-4">
              {departments.map((dept, index) => (
                <motion.button
                  key={index}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    filterDepartment === dept ? "bg-blue-700 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                  onClick={() => setFilterDepartment(dept === filterDepartment ? "" : dept)}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  {dept}
                </motion.button>
              ))}
              {filterDepartment && (
                <motion.button
                  className="px-4 py-2 rounded-full text-sm font-medium bg-red-100 text-red-700 hover:bg-red-200 transition-all"
                  onClick={() => setFilterDepartment("")}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  Clear Filter
                </motion.button>
              )}
            </div>
          </div>

          {/* Search */}
          <div className="mb-10 max-w-md mx-auto">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search className="w-5 h-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-3"
                placeholder="Search job titles or keywords"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Job Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredJobs.length > 0 ? (
              filteredJobs.map((job) => <JobCard key={job.id} job={job} onClick={() => openJobModal(job)} />)
            ) : (
              <div className="col-span-3 py-16 text-center bg-white rounded-lg shadow-sm">
                <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-xl">No job listings match your search criteria.</p>
                <button
                  className="mt-4 text-blue-700 hover:underline font-medium"
                  onClick={() => {
                    setSearchQuery("")
                    setFilterDepartment("")
                  }}
                >
                  Clear filters
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Employee Testimonials */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeInUp}
          >
            <h2 className="text-3xl font-bold mb-4">What Our Employees Say</h2>
            <p className="mx-auto max-w-2xl text-gray-600">
              Hear from our team members about their experience working at STI College
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                name: "Suzanne Esplana",
                position: "IT Instructor",
                years: "5 years",
                quote:
                  "Working at STI has given me the opportunity to shape the next generation of IT professionals while continuously growing in my own career.",
              },
              {
                name: "Ally Rozu Rose",
                position: "Academic Affairs Manager",
                years: "8 years",
                quote:
                  "The collaborative environment at STI encourages innovation and excellence. I'm proud to be part of an institution that values both student and employee growth.",
              },
              {
                name: "Anna Aleli",
                position: "Student Affairs Coordinator",
                years: "3 years",
                quote:
                  "STI provides a supportive workplace where your contributions are valued. The work-life balance and professional development opportunities are exceptional.",
              },
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                className="bg-white p-6 rounded-lg shadow-sm border border-gray-100"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
              >
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                    <Users className="w-6 h-6 text-blue-700" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{testimonial.name}</h3>
                    <p className="text-gray-600 text-sm">
                      {testimonial.position} • {testimonial.years}
                    </p>
                  </div>
                </div>
                <p className="text-gray-700 italic">{testimonial.quote}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits & Perks */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeInUp}
          >
            <h2 className="text-3xl font-bold mb-4">Benefits & Perks</h2>
            <p className="mx-auto max-w-2xl text-gray-600">
              We offer competitive benefits to support your professional and personal growth
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div
              className="rounded-lg border border-gray-200 bg-white p-6"
              whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h3 className="mb-4 text-xl font-bold text-blue-700">Work-Life Balance</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <CheckCircle className="mr-2 h-5 w-5 text-blue-700 flex-shrink-0 mt-0.5" />
                  <span>Flexible work schedules and remote work options</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="mr-2 h-5 w-5 text-blue-700 flex-shrink-0 mt-0.5" />
                  <span>Paid time off, holidays, and leave benefits</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="mr-2 h-5 w-5 text-blue-700 flex-shrink-0 mt-0.5" />
                  <span>Supportive and healthy work environment</span>
                </li>
              </ul>
            </motion.div>

            <motion.div
              className="rounded-lg bg-blue-700 p-6 text-white"
              whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <h3 className="mb-4 text-xl font-bold">Growth & Development</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <CheckCircle className="mr-2 h-5 w-5 text-blue-300 flex-shrink-0 mt-0.5" />
                  <span>Access to training programs, workshops, and certifications</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="mr-2 h-5 w-5 text-blue-300 flex-shrink-0 mt-0.5" />
                  <span>Career advancement opportunities within the organization</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="mr-2 h-5 w-5 text-blue-300 flex-shrink-0 mt-0.5" />
                  <span>Mentorship and guidance from industry experts</span>
                </li>
              </ul>
            </motion.div>

            <motion.div
              className="rounded-lg border border-gray-200 bg-white p-6"
              whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h3 className="mb-4 text-xl font-bold text-blue-700">Competitive Benefits</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <CheckCircle className="mr-2 h-5 w-5 text-blue-700 flex-shrink-0 mt-0.5" />
                  <span>Competitive salary with performance-based incentives</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="mr-2 h-5 w-5 text-blue-700 flex-shrink-0 mt-0.5" />
                  <span>Comprehensive health coverage, and wellness programs</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="mr-2 h-5 w-5 text-blue-700 flex-shrink-0 mt-0.5" />
                  <span>Employee recognition programs and rewards for achievements</span>
                </li>
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 relative overflow-hidden">
        {/* Background with animated gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-700 via-indigo-600 to-purple-700 background-animate"></div>

        {/* Floating elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="floating-circles">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className={`floating-circle circle-${i + 1}`}
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 5}s`,
                  width: `${Math.random() * 100 + 50}px`,
                  height: `${Math.random() * 100 + 50}px`,
                }}
              ></div>
            ))}
          </div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            className="max-w-4xl mx-auto text-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeInUp}
          >
            <motion.h2
              className="text-5xl md:text-6xl font-bold mb-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="text-white">Start Your </span>
              <motion.span
                className="text-yellow-400 inline-block"
                animate={{
                  scale: [1, 1.1, 1],
                  rotate: [0, 2, 0, -2, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatType: "reverse",
                }}
              >
               Journey
              </motion.span>
              <span className="text-white">With Us</span>
            </motion.h2>

            <motion.p
              className="text-xl text-blue-100 mb-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Join our team of dedicated professionals and be part of a community that values innovation, collaboration, and
              excellence. At STI College, we believe in empowering our employees to reach their full potential.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Button
                className="bg-white text-blue-700 hover:bg-blue-50 px-10 py-4 rounded-lg font-medium text-lg shadow-glow"
                onClick={() => document.getElementById("job-listings")?.scrollIntoView({ behavior: "smooth" })}
              >
                Apply Now
              </Button>

              <Button
                className="bg-transparent border-2 border-white text-white hover:bg-white/10 px-10 py-4 rounded-lg font-medium text-lg"
                onClick={() => document.getElementById("job-listings")?.scrollIntoView({ behavior: "smooth" })}
              >
                View all positions
              </Button>
            </motion.div>
          </motion.div>
        </div>

        {/* Contact Message */}
        <motion.div
          className="absolute bottom-8 left-8 bg-white/10 backdrop-blur-sm p-4 rounded-lg shadow-md"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <p className="text-sm text-blue-100 flex items-center gap-2">
            <IoGlobeOutline className="w-5 h-5 text-yellow-400" />
            Got any questions? Message us at <span className="font-bold">email@example.com</span>
          </p>
          <p className="text-sm text-blue-100 flex items-center gap-2 mt-2">
            <MapPin className="w-5 h-5 text-yellow-400" />
            Contact us at <span className="font-bold">+123-456-7890</span>
          </p>
        </motion.div>
      </section>

      {/* Scroll to Top Icon */}
      {showScrollTop && (
        <motion.button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 bg-blue-700 text-white p-3 rounded-full shadow-lg hover:bg-blue-800 border-2 border-white z-50"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <ChevronUp className="w-6 h-6" />
        </motion.button>
      )}

      {/* Job Modal */}
      {selectedJob && <JobModal job={selectedJob} isOpen={isModalOpen} onClose={closeJobModal} />}

      <LandingFooter />
    </div>
  )
}
