"use client"

import { useState, useEffect } from "react"
import Modal from "@mui/material/Modal"
import Box from "@mui/material/Box"
import Tabs from "@mui/material/Tabs"
import Tab from "@mui/material/Tab"
import TextField from "@mui/material/TextField"
import Autocomplete from "@mui/material/Autocomplete"
import Checkbox from "@mui/material/Checkbox"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { FaPlus, FaTrash } from "react-icons/fa"
import { Select, MenuItem, FormControl, InputLabel } from "@mui/material"
import { BookOpen, Award, Briefcase, Bus, UserCheck, ClockIcon } from 'lucide-react';

const courses = [
	{ title: "BSIT - Bachelor of Science in Information Technology", value: "BSIT" },
	{ title: "BSBA - Bachelor of Science in Business Administration", value: "BSBA" },
	{ title: "BSHM - Bachelor of Science in Hospitality Management", value: "BSHM" },
	{ title: "BSTM - Bachelor of Science in Tourism Management", value: "BSTM" },
]

const remoteOptionsList = ["On-site", "Hybrid", "Work from home"]
const workTypes = ["OJT/Internship", "Contract", "Part-time", "Full-time"]
const payTypes = ["No Pay", "Weekly", "Monthly", "Yearly"]
	
const perks = [
    { id: "training", label: "Free Training & Workshops - Skill development", icon: <BookOpen className="h-5 w-5 text-green-500" /> },
    { id: "certification", label: "Certification Upon Completion - Proof of experience", icon: <Award className="h-5 w-5 text-blue-500" /> },
    { id: "potential", label: "Potential Job Offer - Possible full-time employment", icon: <Briefcase className="h-5 w-5 text-yellow-500" /> },
    { id: "transportation", label: "Transportation Allowance - Support for expenses", icon: <Bus className="h-5 w-5 text-purple-500" /> },
    { id: "mentorship", label: "Mentorship & Guidance - Hands-on learning", icon: <UserCheck className="h-5 w-5 text-orange-500" /> },
    { id: "flexible", label: "Flexible Hours - Adjusted schedules for students", icon: <ClockIcon className="h-5 w-5 text-pink-500" /> },
]

interface ApplicationQuestion {
	question: string
	type: string
	options?: string[]
	autoReject: boolean
	correctAnswer?: string | string[]
}

interface ApplicationDeadline {
	date: string
	time: string
}

interface QuickEditModalState {
	jobTitle: string
	location: string
	remoteOptions: string
	workType: string
	payType: string
	payAmount: string
	recommendedCourse: string
	verificationTier: string
	jobDescription: string
	responsibilities: string[]
	mustHaveQualifications: string[]
	niceToHaveQualifications: string[]
	jobSummary: string
	applicationDeadline: ApplicationDeadline
	maxApplicants: string
	applicationQuestions: ApplicationQuestion[]
	perksAndBenefits: string[]
}

interface QuickEditModalProps {
	open: boolean
	job?: Partial<QuickEditModalState> & { id?: number } | null
	onClose: () => void
	onSave: (updatedJob: QuickEditModalState & { id?: number }) => void
}

export default function QuickEditModal({
	open,
	job,
	onClose,
	onSave,
}: QuickEditModalProps) {
	const [tab, setTab] = useState(0)
	const [state, setState] = useState<QuickEditModalState>({
		jobTitle: "",
		location: "",
		remoteOptions: "",
		workType: "",
		payType: "",
		payAmount: "",
		recommendedCourse: "",
		verificationTier: "basic",
		jobDescription: "",
		responsibilities: [""],
		mustHaveQualifications: [""],
		niceToHaveQualifications: [""],
		jobSummary: "",
		applicationDeadline: { date: "", time: "" },
		maxApplicants: "",
		applicationQuestions: [],
		perksAndBenefits: [],
	})
	const [loading, setLoading] = useState(false)

	useEffect(() => {
		let ignore = false
		function normalizeArray(val: unknown): string[] {
			if (Array.isArray(val)) {
				return val
					.map(v => (typeof v === "string" ? v.trim() : ""))
					.filter(v => v && v.length > 0)
			}
			if (typeof val === "string") {
				try {
					const parsed = JSON.parse(val)
					if (Array.isArray(parsed)) {
						return parsed
							.map(v => (typeof v === "string" ? v.trim() : ""))
							.filter(v => v && v.length > 0)
					}
				} catch {
					if (val.includes(",")) {
						return val.split(",").map(v => v.trim()).filter(v => v && v.length > 0)
					}
					if (val.trim()) return [val.trim()]
				}
			}
			return []
		}
		function normalizePerks(val: unknown): string[] {
			const arr = normalizeArray(val);
			return arr.filter(k => perks.some(perk => perk.id === k));
		}
		async function fetchJobDetails(id: number) {
			setLoading(true)
			try {
				const res = await fetch(`/api/job-listings/job-cards/${id}`)
				if (!res.ok) throw new Error("Failed to fetch job details")
				const data = await res.json()
				let applicationQuestions: ApplicationQuestion[] = []
				try {
					const qRes = await fetch(`/api/job-listings/job-cards/${id}/questions`)
					if (qRes.ok) {
						const qData = await qRes.json()
						applicationQuestions = Array.isArray(qData)
							? qData.map((q: {
								question: string;
								type: string;
								options?: string[] | string | null;
								auto_reject: boolean;
								correct_answer?: string | null;
							}) => ({
								question: q.question,
								type: q.type,
								options: q.options ? (typeof q.options === "string" ? JSON.parse(q.options) : q.options) : undefined,
								autoReject: q.auto_reject,
								correctAnswer: q.correct_answer ?? undefined,
							}))
							: []
					}
				} catch {}
				if (!ignore && data) {
					setState(prev => ({
						...prev,
						...data,
						payAmount: data.payAmount ?? data.pay_amount ?? "",
						responsibilities: normalizeArray(data.responsibilities),
						mustHaveQualifications: normalizeArray(data.mustHaveQualifications),
						niceToHaveQualifications: normalizeArray(data.niceToHaveQualifications),
						applicationQuestions,
						perksAndBenefits: normalizePerks(data.perksAndBenefits),
						applicationDeadline: data.applicationDeadline ?? { date: "", time: "" },
					}))
				}
			} catch (e) {
				if (!ignore) {
					console.error("Error fetching job details:", e)
					setState(prev => ({ ...prev, jobTitle: "Error loading job" })) 
				}	
			}
			setLoading(false)
		}
		if (open && job?.id) {
			fetchJobDetails(job.id)
		} else if (open && job) {
			setState(prev => ({
				...prev,
				...job,
				responsibilities: normalizeArray(job.responsibilities),
				mustHaveQualifications: normalizeArray(job.mustHaveQualifications),
				niceToHaveQualifications: normalizeArray(job.niceToHaveQualifications),
				applicationQuestions: Array.isArray(job.applicationQuestions) ? job.applicationQuestions : [],
				perksAndBenefits: normalizePerks(job.perksAndBenefits),
				applicationDeadline: job.applicationDeadline ?? { date: "", time: "" },
			}))
		}
		return () => { ignore = true }
	}, [open, job, job?.id])

	const handleArrayChange = (field: keyof Pick<QuickEditModalState, "responsibilities" | "mustHaveQualifications" | "niceToHaveQualifications">, idx: number, value: string) => {
		setState((prev) => {
			const arr = [...(prev[field] || [""])]
			arr[idx] = value
			return { ...prev, [field]: arr }
		})
	}
	const addArrayItem = (field: keyof Pick<QuickEditModalState, "responsibilities" | "mustHaveQualifications" | "niceToHaveQualifications">) => {
		setState((prev) => ({
			...prev,
			[field]: [...(prev[field] || [""]), ""],
		}))
	}
	const removeArrayItem = (field: keyof Pick<QuickEditModalState, "responsibilities" | "mustHaveQualifications" | "niceToHaveQualifications">, idx: number) => {
		setState((prev) => {
			const arr = [...(prev[field] || [""])]
			if (arr.length > 1) arr.splice(idx, 1)
			return { ...prev, [field]: arr }
		})
	}

	// Application Questions
	const [newQuestion, setNewQuestion] = useState("")
	const [newType, setNewType] = useState("text")
	const [newOptions, setNewOptions] = useState("")
	const [newAutoReject, setNewAutoReject] = useState(false)
	const [newCorrectAnswer, setNewCorrectAnswer] = useState<string | string[]>("")
	const [textAutoRejectKeywords, setTextAutoRejectKeywords] = useState("")
	const [editQuestionIdx, setEditQuestionIdx] = useState<number | null>(null)

	const startEditQuestion = (idx: number) => {
		const q = state.applicationQuestions[idx]
		setEditQuestionIdx(idx)
		setNewQuestion(q.question)
		setNewType(q.type)
		setNewOptions(q.options ? q.options.join(", ") : "")
		setNewAutoReject(q.autoReject)
		if (q.type === "multi") {
			setNewCorrectAnswer(Array.isArray(q.correctAnswer) ? q.correctAnswer : (q.correctAnswer ? [q.correctAnswer] : []))
		} else if (q.type === "text" && q.autoReject) {
			let keywords: string[] = []
			if (Array.isArray(q.correctAnswer)) {
				keywords = q.correctAnswer
			} else if (typeof q.correctAnswer === "string") {
				try {
					const arr = JSON.parse(q.correctAnswer)
					if (Array.isArray(arr)) {
						keywords = arr
					} else {
						keywords = [q.correctAnswer]
					}
				} catch {
					if (q.correctAnswer.includes("[") && q.correctAnswer.includes("]")) {
						keywords = []
					} else {
						keywords = q.correctAnswer.split(",").map(k => k.trim()).filter(Boolean)
					}
				}
			}
			setTextAutoRejectKeywords(keywords.join(", "))
			setNewCorrectAnswer("")
		} else {
			setNewCorrectAnswer(typeof q.correctAnswer === "string" ? q.correctAnswer : "")
			setTextAutoRejectKeywords("")
		}
	}

	const addOrEditQuestion = () => {
		if (!newQuestion.trim()) return
		let options: string[] | undefined
		let correctAnswer: string | string[] | undefined

		if (newType === "yesno") {
			options = ["Yes", "No"]
			if (newAutoReject) correctAnswer = newCorrectAnswer
		} else if (newType === "single" || newType === "multi") {
			options = newOptions ? newOptions.split(",").map(o => o.trim()).filter(Boolean) : undefined
			if (newAutoReject) correctAnswer = newCorrectAnswer
		} else if (newType === "text" && newAutoReject) {
			correctAnswer = textAutoRejectKeywords
				.split(",")
				.map(k => k.trim())
				.filter(Boolean)
		}

		if (editQuestionIdx !== null) {
			setState((prev) => ({
				...prev,
				applicationQuestions: prev.applicationQuestions.map((q, i) =>
					i === editQuestionIdx
						? {
							question: newQuestion,
							type: newType,
							options,
							autoReject: newAutoReject,
							correctAnswer,
						}
						: q
				),
			}))
			setEditQuestionIdx(null)
		} else {
			setState((prev) => ({
				...prev,
				applicationQuestions: [
					...(prev.applicationQuestions || []),
					{
						question: newQuestion,
						type: newType,
						options,
						autoReject: newAutoReject,
						correctAnswer,
					},
				],
			}))
		}
		setNewQuestion("")
		setNewType("text")
		setNewOptions("")
		setNewAutoReject(false)
		setNewCorrectAnswer("")
		setTextAutoRejectKeywords("")
	}

	const removeQuestion = (idx: number) => {
		setState((prev) => ({
			...prev,
			applicationQuestions: prev.applicationQuestions.filter((_, i) => i !== idx),
		}))
		if (editQuestionIdx === idx) {
			setEditQuestionIdx(null)
			setNewQuestion("")
			setNewType("text")
			setNewOptions("")
			setNewAutoReject(false)
			setNewCorrectAnswer("")
			setTextAutoRejectKeywords("")
		}
	}

	// Perks
	const handlePerkToggle = (perkKey: string) => {
		setState((prev) => {
			const perks = prev.perksAndBenefits || []
			return {
				...prev,
				perksAndBenefits: perks.includes(perkKey)
					? perks.filter((p) => p !== perkKey)
					: [...perks, perkKey],
			}
		})
	}

	// Save
	const handleSave = async () => {
		if (newQuestion.trim()) {
			let options: string[] | undefined
			let correctAnswer: string | string[] | undefined

			if (newType === "yesno") {
				options = ["Yes", "No"]
				if (newAutoReject) correctAnswer = newCorrectAnswer
			} else if (newType === "single" || newType === "multi") {
				options = newOptions ? newOptions.split(",").map(o => o.trim()).filter(Boolean) : undefined
				if (newAutoReject) correctAnswer = newCorrectAnswer
			} else if (newType === "text" && newAutoReject) {
				correctAnswer = textAutoRejectKeywords
					.split(",")
					.map(k => k.trim())
					.filter(Boolean)
			}

			setState(prev => ({
				...prev,
				applicationQuestions: [
					...(prev.applicationQuestions || []),
					{
						question: newQuestion,
						type: newType,
						options,
						autoReject: newAutoReject,
						correctAnswer,
					},
				],
			}))
			setNewQuestion("")
			setNewType("text")
			setNewOptions("")
			setNewAutoReject(false)
			setNewCorrectAnswer("")
			setTextAutoRejectKeywords("")
			setTimeout(() => handleSaveInternal(), 0)
			return
		}
		handleSaveInternal()
	}

	const handleSaveInternal = async () => {
		if (job?.id) {
			setLoading(true)
			try {
				const res = await fetch(`/api/job-listings/job-cards/${job.id}`, {
					method: "PUT",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ ...job, ...state }),
				})
				if (!res.ok) {
					const err = await res.json()
					console.error("Failed to update job:", err)
					setLoading(false)
					return
				}
			} catch (e) {
				console.error("Failed to update job:", e)
				setLoading(false)
				return
			}
			setLoading(false)
		}
		onSave({ ...job, ...state })
		onClose()
	}

	return (
		<Modal open={open} onClose={onClose}>
			<Box sx={{ outline: "none", border: "none" }}>
				<div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
					<div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden border">
						{/* Header */}
						<div className="bg-gradient-to-r from-blue-600 to-blue-500 p-4 text-white flex justify-between items-center">
							<div>
								<h3 className="font-bold text-xl">Quick Edit Job {state.jobTitle ? `- ${state.jobTitle}` : ""}</h3>
								<p className="text-blue-100 text-sm">Edit all job details and save changes.</p>
							</div>
							<Button
								variant="ghost"
								size="icon"
								className="text-white hover:bg-white/20"
								onClick={onClose}
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="24"
									height="24"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="2"
									strokeLinecap="round"
									strokeLinejoin="round"
									className="lucide lucide-x"
								>
									<path d="M18 6 6 18" />
									<path d="m6 6 12 12" />
								</svg>
								<span className="sr-only">Close</span>
							</Button>
						</div>
						{/* Tabs */}
						<Tabs value={tab} onChange={(_, v) => setTab(v)} variant="scrollable">
							<Tab label="Create" />
							<Tab label="Write" />
							<Tab label="Manage" />
						</Tabs>
						<form
							className="p-6 space-y-5 max-h-[70vh] overflow-y-auto"
							onSubmit={e => {
								e.preventDefault()
								handleSave()
							}}
						>
							{loading ? (
								<div className="flex justify-center items-center min-h-[200px]">
									<div className="w-8 h-8 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin mr-2" />
									<span>Loading...</span>
								</div>
							) : (
								<>
									{/* Job Details */}
									{tab === 0 && (
										<div className="space-y-4">
											<TextField
												label="Job Title"
												value={state.jobTitle}
												onChange={e => setState((p) => ({ ...p, jobTitle: e.target.value }))}
												fullWidth
											/>
											<TextField
												label="Location"
												value={state.location}
												onChange={e => setState((p) => ({ ...p, location: e.target.value }))}
												fullWidth
											/>
											<div className="flex flex-col sm:flex-row gap-2">
												<div className="flex-1">
													<FormControl fullWidth>
														<InputLabel id="work-type-label">Job Type</InputLabel>
														<Select
															labelId="work-type-label"
															value={state.workType || ""}
															onChange={e => setState((p) => ({ ...p, workType: e.target.value }))}
															label="Job Type"
															displayEmpty
															fullWidth
														>
															{workTypes.map(opt => (
																<MenuItem key={opt} value={opt}>{opt}</MenuItem>
															))}
														</Select>
													</FormControl>
												</div>
												<div className="flex-1">
													<FormControl fullWidth>
														<InputLabel id="remote-options-label">Remote Options</InputLabel>
														<Select
															labelId="remote-options-label"
															value={state.remoteOptions || ""}
															onChange={e => setState((p) => ({ ...p, remoteOptions: e.target.value }))}
															label="Remote Options"
															displayEmpty
															fullWidth
														>
															{remoteOptionsList.map(opt => (
																<MenuItem key={opt} value={opt}>{opt}</MenuItem>
															))}
														</Select>
													</FormControl>
												</div>
											</div>
											<div className="flex flex-col sm:flex-row gap-2">
												<div className="flex-1">
													<FormControl fullWidth>
														<InputLabel id="pay-type-label">Pay Type</InputLabel>
														<Select
															labelId="pay-type-label"
															value={state.payType || ""}
															onChange={e => setState((p) => ({ ...p, payType: e.target.value }))}
															label="Pay Type"
															displayEmpty
															fullWidth
														>
															<MenuItem value="">Pay Type</MenuItem>
															{payTypes.map(opt => (
																<MenuItem key={opt} value={opt}>{opt}</MenuItem>
															))}
														</Select>
													</FormControl>
												</div>
												{state.payType && state.payType !== "No Pay" && (
													<div className="flex-1">
														<TextField
															label="Pay Amount"
															value={state.payAmount}
															onChange={e => setState((p) => ({ ...p, payAmount: e.target.value }))}
															fullWidth
															InputLabelProps={{ shrink: true }}
														/>
													</div>
												)}
											</div>
											<Autocomplete
												multiple
												options={courses}
												getOptionLabel={option => option.title}
												value={courses.filter(c => (state.recommendedCourse || "").split(", ").includes(c.title))}
												onChange={(_, newValue) =>
													setState((p) => ({
														...p,
														recommendedCourse: newValue.map(c => c.title).join(", "),
													}))
												}
												renderInput={params => (
													<TextField {...params} label="Recommended Course(s)" placeholder="Select courses" />
												)}
											/>
										</div>
									)}
									{/* Description */}
									{tab === 1 && (
										<div className="space-y-4">
											<TextField
												label="Job Description"
												value={state.jobDescription}
												onChange={e => setState((p) => ({ ...p, jobDescription: e.target.value }))}
												fullWidth
												multiline
												rows={4}
											/>
											<Label className="block mb-1">Responsibilities</Label>
											{state.responsibilities?.map((item, idx) => (
												<div key={idx} className="flex gap-2 mb-2">
													<TextField
														value={item}
														onChange={e => handleArrayChange("responsibilities", idx, e.target.value)}
														fullWidth
														size="small"
													/>
													<Button
														type="button"
														variant="ghost"
														size="icon"
														onClick={() => removeArrayItem("responsibilities", idx)}
														disabled={state.responsibilities.length === 1}
														className="text-red-600 hover:bg-red-100"
													>
														<FaTrash />
													</Button>
												</div>
											))}
											<Button
												type="button"
												variant="outline"
												size="sm"
												onClick={() => addArrayItem("responsibilities")}
												className="text-white bg-blue-600 hover:bg-blue-700"
											>
												<FaPlus className="mr-1" /> Add responsibility
											</Button>
											<Label className="block mb-1 mt-4">Must-have Qualifications</Label>
											{state.mustHaveQualifications?.map((item, idx) => (
												<div key={idx} className="flex gap-2 mb-2">
													<TextField
														value={item}
														onChange={e => handleArrayChange("mustHaveQualifications", idx, e.target.value)}
														fullWidth
														size="small"
													/>
													<Button
														type="button"
														variant="ghost"
													size="icon"
														onClick={() => removeArrayItem("mustHaveQualifications", idx)}
														disabled={state.mustHaveQualifications.length === 1}
														className="text-red-600 hover:bg-red-100"
													>
														<FaTrash />
													</Button>
												</div>
											))}
											<Button
												type="button"
												variant="outline"
											size="sm"
												onClick={() => addArrayItem("mustHaveQualifications")}
												className="text-white bg-blue-600 hover:bg-blue-700"
											>
												<FaPlus className="mr-1" /> Add must-have
											</Button>
											<Label className="block mb-1 mt-4">Nice-to-have Qualifications</Label>
											{state.niceToHaveQualifications?.map((item, idx) => (
												<div key={idx} className="flex gap-2 mb-2">
													<TextField
														value={item}
														onChange={e => handleArrayChange("niceToHaveQualifications", idx, e.target.value)}
														fullWidth
														size="small"
													/>
													<Button
														type="button"
														variant="ghost"
														size="icon"
														onClick={() => removeArrayItem("niceToHaveQualifications", idx)}
														disabled={state.niceToHaveQualifications.length === 1}
														className="text-red-600 hover:bg-red-100"
													>
														<FaTrash />
													</Button>
												</div>
											))}
											<Button
												type="button"
												variant="outline"
												size="sm"
												onClick={() => addArrayItem("niceToHaveQualifications")}
												className="text-white bg-blue-600 hover:bg-blue-700"
											>
												<FaPlus className="mr-1" /> Add nice-to-have
											</Button>
											<TextField
												label="Job Summary"
												value={state.jobSummary}
												onChange={e => setState((p) => ({ ...p, jobSummary: e.target.value }))}
												fullWidth
												multiline
												rows={2}
											/>
										</div>
									)}
									{/* Application Settings */}
									{tab === 2 && (
										<div className="space-y-4">
											<Label className="block mb-1">Application Deadline</Label>
											<div className="flex gap-2">
												<TextField
													label="Date"
													type="date"
													value={state.applicationDeadline?.date || ""}
													onChange={e =>
														setState((p) => ({
															...p,
															applicationDeadline: { ...p.applicationDeadline, date: e.target.value },
														}))
													}
													InputLabelProps={{ shrink: true }}
												/>
												<TextField
													label="Time"
													type="time"
													value={state.applicationDeadline?.time || ""}
													onChange={e =>
														setState((p) => ({
															...p,
															applicationDeadline: { ...p.applicationDeadline, time: e.target.value },
														}))
													}
													InputLabelProps={{ shrink: true }}
												/>
											</div>
											<TextField
												label="Max Applicants"
												type="number"
												value={state.maxApplicants}
												onChange={e => setState((p) => ({ ...p, maxApplicants: e.target.value }))}
												fullWidth
											/>
											<div className="border-b border-gray-300 my-4" />
											<Label className="block mb-1 mt-4">Application Questions</Label>
											{state.applicationQuestions?.map((q, idx) => (
												<div key={idx} className="mb-2 border rounded p-2">
													<div className="flex justify-between items-center">
														<div>
															<div className="font-medium">{q.question}</div>
															<div className="text-xs text-gray-500">{q.type}</div>
															{q.options && (
																<div className="text-xs text-gray-400">
																	Options: {Array.isArray(q.options)
																		? q.options.join(", ")
																		: (() => {
																			try {
																				const arr = JSON.parse(q.options as string)
																				return Array.isArray(arr) ? arr.join(", ") : String(q.options)
																			} catch {
																				return String(q.options)
																			}
																		})()
																	}
																</div>
															)}
															{q.correctAnswer && (
																<div className="text-xs text-green-600">
																	Correct Answer: {Array.isArray(q.correctAnswer)
																		? q.correctAnswer.join(", ")
																		: (() => {
																			if (typeof q.correctAnswer === "string") {
																				try {
																					const arr = JSON.parse(q.correctAnswer as string)
																					return Array.isArray(arr) ? arr.join(", ") : q.correctAnswer
																				} catch {
																					return q.correctAnswer
																				}
																			}
																			return ""
																		})()
																	}
																</div>
															)}
															{q.autoReject && (
																<div className="text-xs text-red-500">Auto-reject enabled</div>
															)}
														</div>
														<div className="flex gap-1">
															<Button
																type="button"
																variant="ghost"
																size="icon"
																onClick={() => startEditQuestion(idx)}
																className="text-blue-600 hover:bg-blue-100"
															>
																<svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
																	<path d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 112.828 2.828L11.828 15.828a4 4 0 01-1.414.828l-4.243 1.415 1.415-4.243a4 4 0 01.828-1.414z"/>
																</svg>
															</Button>
															<Button
																type="button"
																variant="ghost"
																size="icon"
																onClick={() => removeQuestion(idx)}
																className="text-red-600 hover:bg-red-100"
															>
																<FaTrash />
															</Button>
														</div>
													</div>
												</div>
											))}
											<div className="border-b border-gray-300 my-4" />
											<div className="flex flex-col gap-2 mb-2">
												<Label className="block mb-1">{editQuestionIdx !== null ? "Edit Application Question" : "Add New Application Question"}</Label>
												<TextField
													label="Question"
													value={newQuestion}
													onChange={e => setNewQuestion(e.target.value)}
													size="small"
												/>
												<Select
													value={newType}
													onChange={e => {
														setNewType(e.target.value)
														setNewCorrectAnswer("")
														setTextAutoRejectKeywords("")
													}}
													size="small"
												>
													<MenuItem value="text">Text</MenuItem>
													<MenuItem value="single">Single Select</MenuItem>
													<MenuItem value="multi">Multi Select</MenuItem>
													<MenuItem value="yesno">Yes or No</MenuItem>
												</Select>
												{newType !== "text" && newType !== "yesno" && (
													<TextField
														label="Options (comma separated)"
														value={newOptions}
														onChange={e => {
															setNewOptions(e.target.value)
															setNewCorrectAnswer("")
														}}
														size="small"
													/>
												)}
												{newType === "yesno" && (
													<div className="text-xs text-gray-700">Options: Yes, No</div>
												)}
												{newAutoReject && (
													<>
														{newType === "single" && (
															<Select
																value={typeof newCorrectAnswer === "string" ? newCorrectAnswer : ""}
																onChange={e => setNewCorrectAnswer(e.target.value)}
																size="small"
															>
																{newOptions
																	.split(",")
																	.map(opt => opt.trim())
																	.filter(opt => opt)
																	.map((opt, idx) => (
																		<MenuItem key={idx} value={opt}>
																			{opt}
																		</MenuItem>
																	))}
															</Select>
														)}
														{newType === "multi" && (
															<div className="flex flex-wrap gap-2">
																{newOptions
																	.split(",")
																	.map(opt => opt.trim())
																	.filter(opt => opt)
																	.map((opt, idx) => (
																		<label key={idx} className="flex items-center gap-1 text-xs">
																			<Checkbox
																				checked={Array.isArray(newCorrectAnswer) && newCorrectAnswer.includes(opt)}
																				onChange={e => {
																					if (e.target.checked) {
																						setNewCorrectAnswer(prev =>
																							Array.isArray(prev) ? [...prev, opt] : [opt]
																						)
																					} else {
																						setNewCorrectAnswer(prev =>
																							Array.isArray(prev) ? prev.filter(v => v !== opt) : []
																						)
																					}
																				}}
																				size="small"
																			/>
																			{opt}
																		</label>
																	))}
															</div>
														)}
														{newType === "yesno" && (
															<Select
																value={typeof newCorrectAnswer === "string" ? newCorrectAnswer : ""}
																onChange={e => setNewCorrectAnswer(e.target.value)}
																size="small"
															>
																<MenuItem value="Yes">Yes</MenuItem>
																<MenuItem value="No">No</MenuItem>
															</Select>
														)}
														{newType === "text" && (
															<TextField
																label="Auto-reject keywords (comma separated)"
																value={textAutoRejectKeywords}
																onChange={e => setTextAutoRejectKeywords(e.target.value)}
																size="small"
															/>
														)}
													</>
												)}
												<label className="flex items-center gap-1 text-xs">
													<Checkbox
														checked={newAutoReject}
														onChange={e => setNewAutoReject(e.target.checked)}
														size="small"
													/>
													<span className="text-red-600">Auto-reject</span>
												</label>
												<div className="flex gap-2">
													<Button
														type="button"
														variant="outline"
														size="sm"
														onClick={addOrEditQuestion}
														className="text-white bg-blue-600 hover:bg-blue-700"
													>
														<FaPlus /> {editQuestionIdx !== null ? "Save Changes" : "Add Question"}
													</Button>
													{editQuestionIdx !== null && (
														<Button
															type="button"
															variant="outline"
															size="sm"
															onClick={() => {
																setEditQuestionIdx(null)
																setNewQuestion("")
																setNewType("text")
																setNewOptions("")
																setNewAutoReject(false)
																setNewCorrectAnswer("")
																setTextAutoRejectKeywords("")
															}}
														>
															Cancel
														</Button>
													)}
												</div>
											</div>
											<div className="border-b border-gray-300 my-4" />
											<Label className="block mb-1 mt-4">Perks & Benefits</Label>
											<div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
												{perks.map(perk => (
													<Button
														key={perk.id}
														type="button"
														variant={state.perksAndBenefits?.includes(perk.id) ? "default" : "outline"}
														size="sm"
														className={state.perksAndBenefits?.includes(perk.id) ? "bg-blue-600 text-white justify-start" : "justify-start"}
														onClick={() => handlePerkToggle(perk.id)}
													>
														<span className="flex items-center gap-2">
															{perk.label}
														</span>
													</Button>
												))}
											</div>
										</div>
									)}
									{/* Footer */}
									<div className="flex pt-4 border-t border-gray-100 gap-2 justify-end">
										<div className="flex-1 flex justify-start">
											<Button variant="outline" type="button" onClick={onClose}>
												Cancel
											</Button>
										</div>
										<Button
											type="submit"
											className="bg-blue-100 text-blue-700 hover:bg-blue-200"
											disabled={loading}
										>
											Save
										</Button>
										{tab < 2 && (
											<Button
												type="button"
												className="bg-blue-600 hover:bg-blue-700 text-white"
												onClick={() => setTab(tab + 1)}
											>
												Next
											</Button>
										)}
									</div>
								</>
							)}
						</form>
					</div>
				</div>
			</Box>
		</Modal>
	)
}
