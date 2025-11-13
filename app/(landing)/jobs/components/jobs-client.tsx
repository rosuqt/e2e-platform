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
}

const mockJobs: JobData[] = [
	// BSIT
	{
		id: 0,
		course: "BSIT",
		job: "Web Developer",
		company: "Fb Mark-it Place",
		title: "UI/UX Designer",
		description:
			"Seeking a creative UI/UX Designer to craft intuitive and visually engaging user experiences.",
		match: 93,
	},
	{
		id: 1,
		course: "BSIT",
		job: "Software Engineer",
		company: "Meta",
		title: "Frontend Developer",
		description:
			"Looking for a talented Frontend Developer to build responsive web applications.",
		match: 87,
	},
	{
		id: 2,
		course: "BSIT",
		job: "System Analyst",
		company: "Accenture",
		title: "System Analyst",
		description:
			"Analyze and design information systems to improve efficiency and productivity.",
		match: 85,
	},
	{
		id: 12,
		course: "BSIT",
		job: "Database Administrator",
		company: "Oracle",
		title: "Database Administrator",
		description:
			"Manage and maintain database systems, ensuring their performance, security, and availability.",
		match: 88,
	},
	{
		id: 13,
		course: "BSIT",
		job: "Network Engineer",
		company: "Cisco",
		title: "Network Engineer",
		description:
			"Design, implement, and manage network solutions to ensure reliable connectivity and security.",
		match: 86,
	},
	{
		id: 14,
		course: "BSIT",
		job: "DevOps Engineer",
		company: "AWS",
		title: "DevOps Engineer",
		description:
			"Collaborate with development and operations teams to automate and optimize processes.",
		match: 90,
	},
	// BSBA
	{
		id: 3,
		course: "BSBA",
		job: "Marketing Manager",
		company: "Google",
		title: "Marketing Manager",
		description:
			"Lead marketing campaigns and strategies to boost brand awareness.",
		match: 76,
	},
	{
		id: 4,
		course: "BSBA",
		job: "Financial Analyst",
		company: "Amazon",
		title: "Financial Analyst",
		description:
			"Analyze financial data and trends to support business decisions.",
		match: 95,
	},
	{
		id: 5,
		course: "BSBA",
		job: "HR Specialist",
		company: "Procter & Gamble",
		title: "HR Specialist",
		description:
			"Manage recruitment, onboarding, and employee relations.",
		match: 81,
	},
	{
		id: 15,
		course: "BSBA",
		job: "Sales Executive",
		company: "IBM",
		title: "Sales Executive",
		description:
			"Drive sales growth by identifying and pursuing new business opportunities.",
		match: 84,
	},
	{
		id: 16,
		course: "BSBA",
		job: "Business Analyst",
		company: "Deloitte",
		title: "Business Analyst",
		description:
			"Evaluate business processes and identify opportunities for improvement.",
		match: 89,
	},
	{
		id: 17,
		course: "BSBA",
		job: "Project Manager",
		company: "Accenture",
		title: "Project Manager",
		description:
			"Plan, execute, and close projects according to deadlines and budgets.",
		match: 91,
	},
	// BSTM
	{
		id: 6,
		course: "BSTM",
		job: "Tour Guide",
		company: "Microsoft",
		title: "Tour Guide",
		description:
			"Lead groups on sightseeing tours and provide information about destinations.",
		match: 82,
	},
	{
		id: 7,
		course: "BSTM",
		job: "Event Planner",
		company: "SM Events",
		title: "Event Planner",
		description:
			"Organize and coordinate events, conferences, and meetings.",
		match: 88,
	},
	{
		id: 8,
		course: "BSTM",
		job: "Travel Agent",
		company: "Traveloka",
		title: "Travel Agent",
		description:
			"Assist clients in planning and booking travel arrangements.",
		match: 80,
	},
	{
		id: 18,
		course: "BSTM",
		job: "Cruise Director",
		company: "Royal Caribbean",
		title: "Cruise Director",
		description:
			"Oversee cruise activities and ensure a high level of guest satisfaction.",
		match: 87,
	},
	{
		id: 19,
		course: "BSTM",
		job: "Hotel Concierge",
		company: "Marriott",
		title: "Hotel Concierge",
		description:
			"Provide personalized services and assistance to hotel guests.",
		match: 85,
	},
	{
		id: 20,
		course: "BSTM",
		job: "Resort Manager",
		company: "Hilton",
		title: "Resort Manager",
		description:
			"Manage all aspects of a resort, including operations, staff, and guest relations.",
		match: 90,
	},
	// BSHM
	{
		id: 9,
		course: "BSHM",
		job: "Hotel Manager",
		company: "Hilton",
		title: "Hotel Manager",
		description: "Lead hotel operations and ensure guest satisfaction.",
		match: 90,
	},
	{
		id: 10,
		course: "BSHM",
		job: "Chef",
		company: "Sofitel",
		title: "Chef",
		description: "Prepare and design menu items for a luxury hotel.",
		match: 85,
	},
	{
		id: 11,
		course: "BSHM",
		job: "Restaurant Manager",
		company: "Jollibee Foods",
		title: "Restaurant Manager",
		description: "Oversee daily restaurant operations and manage staff.",
		match: 83,
	},
	{
		id: 21,
		course: "BSHM",
		job: "Catering Manager",
		company: "Accor",
		title: "Catering Manager",
		description:
			"Plan and manage catering services for events and functions.",
		match: 86,
	},
	{
		id: 22,
		course: "BSHM",
		job: "Bar Manager",
		company: "Polo Ralph Lauren",
		title: "Bar Manager",
		description:
			"Manage bar operations, including staff, inventory, and customer service.",
		match: 84,
	},
	{
		id: 23,
		course: "BSHM",
		job: "Food and Beverage Manager",
		company: "Waldorf Astoria",
		title: "Food and Beverage Manager",
		description:
			"Oversee food and beverage operations, ensuring quality and profitability.",
		match: 88,
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
			const related = jobsForCourse.filter(j =>
				j.job.toLowerCase().includes(job.toLowerCase()) ||
				j.title.toLowerCase().includes(job.toLowerCase())
			)
			if (related.length >= 3) return related.slice(0, 3)
			const others = jobsForCourse.filter(j => !related.includes(j))
			return [...related, ...others].slice(0, 3)
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
			<div className="container mx-auto py-8 px-4">
				<div className="bg-gradient-to-r from-blue-700 to-blue-500 rounded-2xl shadow-xl text-white mb-8 p-8 relative overflow-hidden">
					<div className="relative z-10">
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

							<div className="relative pointer-events-none">
								<div className="absolute inset-0 bg-white/50 backdrop-blur-sm z-10" />
								<div className="pointer-events-none">
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

			{showSignInPrompt && (
				<motion.div
					className="fixed bottom-8 left-8 bg-blue-500 text-white rounded-xl shadow-2xl max-w-sm w-full z-50"
					initial={{ opacity: 0, scale: 0.9 }}
					animate={{ opacity: 1, scale: 1 }}
					exit={{ opacity: 0, scale: 0.9 }}
					transition={{ duration: 0.3 }}
				>
					<div className="p-6 text-center">
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

