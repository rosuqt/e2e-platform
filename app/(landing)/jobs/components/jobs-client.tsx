"use client"

import { useState, useRef, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import JobCard from "../components/job-card"
import JobDetails from "../components/job-details"
import Link from "next/link"

type JobData = {
	id: number
	course: string
	job: string
	company: string
	title: string
	description: string
	match: number
	logo: string
}

const mockJobs: JobData[] = [
	{
		id: 0,
		course: "BSIT",
		job: "Web Developer",
		company: "Blueberry Labs",
		title: "Web Developer",
		description:
			"Develop and maintain web applications using modern frameworks and technologies.",
		match: 93,
		logo: "/images/star.png",
	},
	{
		id: 1,
		course: "BSIT",
		job: "Software Engineer",
		company: "Quantum Byte",
		title: "Software Engineer",
		description:
			"Design, build, and optimize scalable software solutions for global users.",
		match: 87,
		logo: "/images/logo-test.png",
	},
	{
		id: 2,
		course: "BSIT",
		job: "System Analyst",
		company: "PixelForge",
		title: "System Analyst",
		description:
			"Analyze business requirements and design effective IT systems.",
		match: 85,
		logo: "/images/globe.png",
	},
	{
		id: 3,
		course: "BSIT",
		job: "UI/UX Designer",
		company: "Nebula Studios",
		title: "UI/UX Designer",
		description:
			"Create intuitive and visually appealing user interfaces for web and mobile apps.",
		match: 90,
		logo: "/images/star.png",
	},
	{
		id: 4,
		course: "BSIT",
		job: "Cybersecurity Analyst",
		company: "CyberNest",
		title: "Cybersecurity Analyst",
		description:
			"Monitor, detect, and respond to security threats and vulnerabilities.",
		match: 88,
		logo: "/images/knot.png",
	},
	{
		id: 5,
		course: "BSBA",
		job: "Marketing Manager",
		company: "Lemonade Media",
		title: "Marketing Manager",
		description:
			"Lead marketing campaigns and strategies to boost brand awareness.",
		match: 76,
		logo: "/images/envelope.png",
	},
	{
		id: 6,
		course: "BSBA",
		job: "Financial Analyst",
		company: "Minty Metrics",
		title: "Financial Analyst",
		description:
			"Analyze financial data and trends to support business decisions.",
		match: 95,
		logo: "/images/globe.png",
	},
	{
		id: 7,
		course: "BSBA",
		job: "HR Specialist",
		company: "Orchid People Solutions",
		title: "HR Specialist",
		description:
			"Manage recruitment, onboarding, and employee relations.",
		match: 81,
		logo: "/images/dog.png",
	},
	{
		id: 8,
		course: "BSBA",
		job: "Business Consultant",
		company: "Crimson Advisory",
		title: "Business Consultant",
		description: "Advise organizations on business strategies and improvements.",
		match: 89,
		logo: "/images/grad-globe.png", // Make sure this matches your uploaded file name
	},
	{
		id: 9,
		course: "BSBA",
		job: "Entrepreneur",
		company: "Startup Sprout",
		title: "Entrepreneur in Residence",
		description:
			"Develop and launch innovative business ideas with mentorship.",
		match: 84,
		logo: "/images/grad-globe2.png",
	},
	{
		id: 10,
		course: "BSTM",
		job: "Tour Guide",
		company: "Sunrise Travels",
		title: "Tour Guide",
		description:
			"Lead groups on sightseeing tours and provide information about destinations.",
		match: 82,
		logo: "/images/star.png",
	},
	{
		id: 11,
		course: "BSTM",
		job: "Travel Agent",
		company: "Wanderlust Agency",
		title: "Travel Agent",
		description:
			"Assist clients in planning and booking travel arrangements.",
		match: 80,
		logo: "/images/envelope.png",
	},
	{
		id: 12,
		course: "BSTM",
		job: "Event Planner",
		company: "Eventure",
		title: "Event Planner",
		description:
			"Organize and coordinate events, conferences, and meetings.",
		match: 88,
		logo: "/images/knot.png",
	},
	{
		id: 13,
		course: "BSTM",
		job: "Airline Customer Service",
		company: "Skyline Airways",
		title: "Airline Customer Service Agent",
		description:
			"Assist airline passengers with check-in, boarding, and inquiries.",
		match: 85,
		logo: "/images/globe.png",
	},
	{
		id: 14,
		course: "BSTM",
		job: "Resort Manager",
		company: "Azure Shores Resort",
		title: "Resort Manager",
		description:
			"Manage all aspects of a resort, including operations, staff, and guest relations.",
		match: 90,
		logo: "/images/grad-globe2.png",
	},
	{
		id: 15,
		course: "BSHM",
		job: "Hotel Manager",
		company: "Maple Leaf Hotels",
		title: "Hotel Manager",
		description: "Lead hotel operations and ensure guest satisfaction.",
		match: 90,
		logo: "/images/star.png",
	},
	{
		id: 16,
		course: "BSHM",
		job: "Restaurant Manager",
		company: "Peppercorn Bistro",
		title: "Restaurant Manager",
		description: "Oversee daily restaurant operations and manage staff.",
		match: 83,
		logo: "/images/dog.png",
	},
	{
		id: 17,
		course: "BSHM",
		job: "Chef",
		company: "Saffron Table",
		title: "Chef",
		description: "Prepare and design menu items for a luxury hotel.",
		match: 85,
		logo: "/images/envelope.png",
	},
	{
		id: 18,
		course: "BSHM",
		job: "Food and Beverage Director",
		company: "Olive Grove Hospitality",
		title: "Food and Beverage Director",
		description:
			"Oversee food and beverage operations, ensuring quality and profitability.",
		match: 88,
		logo: "/images/grad-globe.png",
	},
	{
		id: 19,
		course: "BSHM",
		job: "Catering Manager",
		company: "Golden Spoon Events",
		title: "Catering Manager",
		description: "Plan and manage catering services for events and functions.",
		match: 86,
		logo: "/images/knot.png",
	},
]

export default function JobsPage() {
	const [selectedJob, setSelectedJob] = useState<number | null>(null)
	const [showSignInPrompt, setShowSignInPrompt] = useState(false)
	const scrollContainerRef = useRef<HTMLDivElement>(null)
	const searchParams = useSearchParams()
	const course = searchParams?.get("course")
	const job = searchParams?.get("job")

	const filteredJobs = (() => {
		if (course && job) {
			const jobsForCourse = mockJobs.filter(j => j.course === course)
			const exactMatch = jobsForCourse.find(
				j =>
					j.job.toLowerCase() === job.toLowerCase() ||
					j.title.toLowerCase() === job.toLowerCase()
			)
			const related = jobsForCourse.filter(
				j =>
					(j.job.toLowerCase().includes(job.toLowerCase()) ||
						j.title.toLowerCase().includes(job.toLowerCase())) &&
					j !== exactMatch
			)
			const others = jobsForCourse.filter(
				j => j !== exactMatch && !related.includes(j)
			)
			const result = [
				...(exactMatch ? [exactMatch] : []),
				...related,
				...others,
			].slice(0, 3)
			return result
		}
		if (course) return mockJobs.filter(j => j.course === course)
		return mockJobs
	})()

	const handleScroll = () => {
		if (!scrollContainerRef.current) return

		const blurThreshold = 3 * 250

		if (scrollContainerRef.current.scrollTop > blurThreshold) {
			setShowSignInPrompt(true)
		} else {
			setShowSignInPrompt(false)
		}
	}

	useEffect(() => {
		const handleResize = () => {}

		window.addEventListener("resize", handleResize)
		handleResize()

		return () => {
			window.removeEventListener("resize", handleResize)
		}
	}, [selectedJob])

	return (
		<div className="min-h-screen mt-16 bg-gradient-to-br from-blue-50 to-sky-100">
			{/* Main content always rendered before modal so modal is always on top */}
			<div className={showSignInPrompt ? "blur-sm pointer-events-none select-none" : ""}>
				<div className="container mx-auto py-8 px-4">
					<div className="bg-gradient-to-r from-blue-700 to-blue-500 rounded-2xl shadow-xl text-white mb-8 p-8 relative overflow-hidden">
						<div className="relative">
							<h2 className="text-2xl font-bold mb-2">
								Find your perfect job
							</h2>
							<p className="text-blue-100 text-sm mb-6">
								Explore job listings tailored to your skills and interests.
								Find the right opportunity and take the next step in your
								career!
							</p>
						</div>
					</div>

					<div className="mb-6"></div>

					<div className="flex gap-6">
						<div
							className={`${
								selectedJob !== null ? "w-1/2" : "w-full"
							} max-h-[calc(100vh-8rem)] overflow-y-auto pr-2 transition-all duration-300`}
							ref={scrollContainerRef}
							onScroll={handleScroll}
						>
							<div className="space-y-4">
								{filteredJobs.length > 0 ? (
									filteredJobs.map(job => (
										<JobCard
											key={job.id}
											id={job.id}
											isSelected={selectedJob === job.id}
											onSelect={() => setSelectedJob(job.id)}
											jobData={job}
										/>
									))
								) : (
									<div className="text-center text-gray-500 py-12">
										No jobs found for your selection.
									</div>
								)}

								<div className="relative">
									<div className="absolute inset-0 bg-white/50 backdrop-blur-sm z-10 pointer-events-none" />
									<div>
										{mockJobs.filter(
											j => !filteredJobs.some(fj => fj.id === j.id)
										)
											.slice(0, 5)
											.map(job => (
												<div key={job.id} className="mb-4">
													<JobCard
														id={job.id}
														isSelected={selectedJob === job.id}
														onSelect={() => {}}
														jobData={job}
													/>
												</div>
											))}
									</div>
								</div>
							</div>
						</div>

						{selectedJob !== null && (
							<div className="w-1/2 sticky top-8 h-[calc(100vh-8rem)] shadow-lg rounded-lg overflow-hidden">
								<JobDetails
									onClose={() => setSelectedJob(null)}
									jobData={mockJobs.find(j => j.id === selectedJob)}
								/>
							</div>
						)}
					</div>
				</div>
			</div>
			{showSignInPrompt && (
				<motion.div
					className="fixed inset-0 flex items-center justify-center bg-black/60 z-[1000]"
					initial={{ opacity: 0, scale: 0.9 }}
					animate={{ opacity: 1, scale: 1 }}
					exit={{ opacity: 0, scale: 0.9 }}
					transition={{ duration: 0.3 }}
				>
					<div className="p-6 text-center bg-white rounded-xl shadow-2xl max-w-sm w-full z-50">
						<div className="flex justify-center mb-4">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="40"
								height="40"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
								className="text-white"
							>
								<rect
									width="18"
									height="11"
									x="3"
									y="11"
									rx="2"
									ry="2"
								></rect>
								<path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
							</svg>
						</div>
						<h2 className="text-2xl font-bold mb-2">
							This is a preview
						</h2>
						<p className="text-lg mb-6">
							Do you want full access? Sign in and{" "}
							<span className="font-bold">unlock all job listings</span>
						</p>
						<div className="space-y-3 text-left mb-6">
							<div className="flex items-center">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="20"
									height="20"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="2"
									strokeLinecap="round"
									strokeLinejoin="round"
									className="mr-2 text-teal-300"
								>
									<path d="M20 6 9 17l-5-5"></path>
								</svg>
								<span>Access to all job listings</span>
							</div>
							<div className="flex items-center">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="20"
									height="20"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="2"
									strokeLinecap="round"
									strokeLinejoin="round"
									className="mr-2 text-teal-300"
								>
									<path d="M20 6 9 17l-5-5"></path>
								</svg>
								<span>Apply to unlimited jobs</span>
							</div>
							<div className="flex items-center">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="20"
									height="20"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="2"
									strokeLinecap="round"
									strokeLinejoin="round"
									className="mr-2 text-teal-300"
								>
									<path d="M20 6 9 17l-5-5"></path>
								</svg>
								<span>Get personalized job recommendations</span>
							</div>
						</div>
						<div className="flex justify-center">
							<Link href="/sign-in" className="w-1/2">
								<Button className="w-full bg-white hover:bg-yellow-500 border-2 border-blue-500 text-blue-700 font-bold py-7 rounded-full">
									Join us now
								</Button>
							</Link>
						</div>
					</div>
				</motion.div>
			)}
		</div>
	)
}

