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
import { Select, MenuItem } from "@mui/material"

const courses = [
	{ title: "BSIT - Bachelor of Science in Information Technology", value: "BSIT" },
	{ title: "BSBA - Bachelor of Science in Business Administration", value: "BSBA" },
	{ title: "BSHM - Bachelor of Science in Hospitality Management", value: "BSHM" },
	{ title: "BSTM - Bachelor of Science in Tourism Management", value: "BSTM" },
]

const remoteOptionsList = ["On-site", "Hybrid", "Work from home"]
const workTypes = ["OJT", "Internship", "Part-time", "Full-time"]
const payTypes = ["No Pay", "Weekly", "Monthly", "Yearly"]
const perksList = [
	"Free Training & Workshops",
	"Certification Upon Completion",
	"Potential Job Offer",
	"Transportation Allowance",
	"Mentorship & Guidance",
	"Flexible Hours",
]

interface ApplicationQuestion {
	question: string
	type: string
	options?: string[]
	autoReject: boolean
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

	useEffect(() => {
		if (job) setState(prev => ({ ...prev, ...job }))
	}, [job])

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

	const addQuestion = () => {
		if (!newQuestion.trim()) return
		setState((prev) => ({
			...prev,
			applicationQuestions: [
				...(prev.applicationQuestions || []),
				{
					question: newQuestion,
					type: newType,
					options: newType !== "text" && newOptions ? newOptions.split(",").map((o) => o.trim()) : undefined,
					autoReject: newAutoReject,
				},
			],
		}))
		setNewQuestion("")
		setNewType("text")
		setNewOptions("")
		setNewAutoReject(false)
	}
	const removeQuestion = (idx: number) => {
		setState((prev) => ({
			...prev,
			applicationQuestions: prev.applicationQuestions.filter((_, i) => i !== idx),
		}))
	}

	// Perks
	const handlePerkToggle = (perk: string) => {
		setState((prev) => {
			const perks = prev.perksAndBenefits || []
			return {
				...prev,
				perksAndBenefits: perks.includes(perk)
					? perks.filter((p) => p !== perk)
					: [...perks, perk],
			}
		})
	}

	// Save
	const handleSave = () => {
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
								<h3 className="font-bold text-xl">Quick Edit Job {job?.id ? `#${job.id}` : ""}</h3>
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
									<Select
										value={state.remoteOptions || ""}
										onChange={e => setState((p) => ({ ...p, remoteOptions: e.target.value }))}
										displayEmpty
										fullWidth
									>
										<MenuItem value="">Remote Options</MenuItem>
										{remoteOptionsList.map(opt => (
											<MenuItem key={opt} value={opt}>{opt}</MenuItem>
										))}
									</Select>
									<Select
										value={state.workType || ""}
										onChange={e => setState((p) => ({ ...p, workType: e.target.value }))}
										displayEmpty
										fullWidth
									>
										<MenuItem value="">Work Type</MenuItem>
										{workTypes.map(opt => (
											<MenuItem key={opt} value={opt}>{opt}</MenuItem>
										))}
									</Select>
									<Select
										value={state.payType || ""}
										onChange={e => setState((p) => ({ ...p, payType: e.target.value }))}
										displayEmpty
										fullWidth
									>
										<MenuItem value="">Pay Type</MenuItem>
										{payTypes.map(opt => (
											<MenuItem key={opt} value={opt}>{opt}</MenuItem>
										))}
									</Select>
									{state.payType && state.payType !== "No Pay" && (
										<TextField
											label="Pay Amount"
											value={state.payAmount}
											onChange={e => setState((p) => ({ ...p, payAmount: e.target.value }))}
											fullWidth
										/>
									)}
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
											>
												<FaTrash />
											</Button>
										</div>
									))}
									<Button type="button" variant="outline" size="sm" onClick={() => addArrayItem("responsibilities")}>
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
											>
												<FaTrash />
											</Button>
										</div>
									))}
									<Button type="button" variant="outline" size="sm" onClick={() => addArrayItem("mustHaveQualifications")}>
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
											>
												<FaTrash />
											</Button>
										</div>
									))}
									<Button type="button" variant="outline" size="sm" onClick={() => addArrayItem("niceToHaveQualifications")}>
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
									<Label className="block mb-1 mt-4">Application Questions</Label>
									{state.applicationQuestions?.map((q, idx) => (
										<div key={idx} className="mb-2 border rounded p-2">
											<div className="flex justify-between items-center">
												<div>
													<div className="font-medium">{q.question}</div>
													<div className="text-xs text-gray-500">{q.type}</div>
													{q.options && (
														<div className="text-xs text-gray-400">
															Options: {q.options.join(", ")}
														</div>
													)}
													{q.autoReject && (
														<div className="text-xs text-red-500">Auto-reject enabled</div>
													)}
												</div>
												<Button
													type="button"
													variant="ghost"
													size="icon"
													onClick={() => removeQuestion(idx)}
												>
													<FaTrash />
												</Button>
											</div>
										</div>
									))}
									<div className="flex gap-2 mb-2">
										<TextField
											label="Question"
											value={newQuestion}
											onChange={e => setNewQuestion(e.target.value)}
											size="small"
										/>
										<Select
											value={newType}
											onChange={e => setNewType(e.target.value)}
											size="small"
										>
											<MenuItem value="text">Text</MenuItem>
											<MenuItem value="single">Single Select</MenuItem>
											<MenuItem value="multi">Multi Select</MenuItem>
										</Select>
										{newType !== "text" && (
											<TextField
												label="Options (comma separated)"
												value={newOptions}
												onChange={e => setNewOptions(e.target.value)}
												size="small"
											/>
										)}
										<label className="flex items-center gap-1 text-xs">
											<Checkbox
												checked={newAutoReject}
												onChange={e => setNewAutoReject(e.target.checked)}
												size="small"
											/>
											Auto-reject
										</label>
										<Button type="button" variant="outline" size="sm" onClick={addQuestion}>
											<FaPlus />
										</Button>
									</div>
									<Label className="block mb-1 mt-4">Perks & Benefits</Label>
									<div className="flex flex-wrap gap-2">
										{perksList.map(perk => (
											<Button
												key={perk}
												type="button"
												variant={state.perksAndBenefits?.includes(perk) ? "default" : "outline"}
												size="sm"
												className={state.perksAndBenefits?.includes(perk) ? "bg-blue-600 text-white" : ""}
												onClick={() => handlePerkToggle(perk)}
											>
												{perk}
											</Button>
										))}
									</div>
								</div>
							)}
							{/* Footer */}
							<div className="flex justify-end gap-2 pt-4 border-t border-gray-100">
								<Button variant="outline" type="button" onClick={onClose}>
									Cancel
								</Button>
								<Button className="bg-blue-600 hover:bg-blue-700" type="submit">
									Save
								</Button>
							</div>
						</form>
					</div>
				</div>
			</Box>
		</Modal>
	)
}
