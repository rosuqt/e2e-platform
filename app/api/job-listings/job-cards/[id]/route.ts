import { NextResponse } from "next/server"
import supabase from "@/lib/supabase"
import { getServerSession } from "next-auth"
import { authOptions } from "../../../../../lib/authOptions"

export async function GET(req: Request) {
	try {
		const session = await getServerSession(authOptions)
		let employerId: string | undefined

		if (session?.user && typeof session.user === "object") {
			if ("employerId" in session.user && typeof (session.user as Record<string, unknown>).employerId === "string") {
				employerId = (session.user as Record<string, unknown>).employerId as string
			} else if ("id" in session.user && typeof (session.user as Record<string, unknown>).id === "string") {
				employerId = (session.user as Record<string, unknown>).id as string
			}
		}

		if (!employerId) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
		}

		const url = new URL(req.url)
		const jobId = url.pathname.split("/").filter(Boolean).pop()
		const { data, error } = await supabase
			.from("job_postings")
			.select("*")
			.eq("id", jobId)
			.eq("employer_id", employerId)
			.single()

		if (error || !data) {
			return NextResponse.json({ error: error?.message || "Job not found" }, { status: 404 })
		}

		let companyName = ""
		const { data: employerData, error: employerError } = await supabase
			.from("registered_employers")
			.select("company_name")
			.eq("id", employerId)
			.single()
		if (!employerError && employerData?.company_name) {
			companyName = employerData.company_name
		}
		console.log("Fetched company_name:", companyName)

		const job = {
			jobTitle: data.job_title ?? "",
			location: data.location ?? "",
			remoteOptions: data.remote_options ?? "",
			workType: data.work_type ?? "",
			payType: data.pay_type ?? "",
			payAmount:
				data.pay_amount !== undefined && data.pay_amount !== null && data.pay_amount !== ""
					? String(data.pay_amount)
					: data.payAmount !== undefined && data.payAmount !== null && data.payAmount !== ""
					? String(data.payAmount)
					: "",
			recommendedCourse: data.recommended_course ?? "",
			verificationTier: data.verification_tier ?? "basic",
			jobDescription: data.job_description ?? "",
			responsibilities: Array.isArray(data.responsibilities)
				? data.responsibilities
				: typeof data.responsibilities === "string"
					? data.responsibilities.includes("[") && data.responsibilities.includes("]")
						? JSON.parse(data.responsibilities)
						: data.responsibilities.split("|").map((s: string) => s.trim()).filter(Boolean)
					: [""],
			mustHaveQualifications: data.must_have_qualifications ?? [""],
			niceToHaveQualifications: data.nice_to_have_qualifications ?? [""],
			jobSummary: data.job_summary ?? "",
			applicationDeadline: data.application_deadline
				? {
					date: data.application_deadline.split("T")[0],
					time: data.application_deadline.split("T")[1]?.slice(0, 5) ?? "",
				}
				: { date: "", time: "" },
			maxApplicants: data.max_applicants != null ? String(data.max_applicants) : "",
			applicationQuestions: data.application_questions ?? [],
			perksAndBenefits: data.perks_and_benefits ?? [],
			paused: data.paused ?? false,
			paused_status: data.paused_status ?? (data.paused ? "paused" : "active"),
			closing: (() => {
				if (data.application_deadline) {
					const now = new Date();
					const deadline = new Date(data.application_deadline);
					const diff = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
					return diff > 0 ? `${diff} days left` : "Closed";
				}
				return "";
			})(),
			status: data.status ?? "Active",
			companyName,
			postingDate: data.created_at ?? "",
			tags: data.tags ?? [],
		}

		return NextResponse.json(job)
	} catch (err: unknown) {
		let message = "Unknown error"
		let stack = undefined
		if (err instanceof Error) {
			message = err.message
			stack = err.stack
		}
		return NextResponse.json(
			{ error: "Unexpected error", message, stack },
			{ status: 500 }
		)
	}
}

export async function PUT(req: Request) {
	try {
		const session = await getServerSession(authOptions)
		let employerId: string | undefined

		if (session?.user && typeof session.user === "object") {
			if ("employerId" in session.user && typeof (session.user as Record<string, unknown>).employerId === "string") {
				employerId = (session.user as Record<string, unknown>).employerId as string
			} else if ("id" in session.user && typeof (session.user as Record<string, unknown>).id === "string") {
				employerId = (session.user as Record<string, unknown>).id as string
			}
		}

		if (!employerId) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
		}

		const url = new URL(req.url)
		const jobId = url.pathname.split("/").filter(Boolean).pop()
		const body = await req.json()

		const updateFields: Record<string, unknown> = {
			job_title: typeof body.jobTitle === "string" ? body.jobTitle : "",
			location: typeof body.location === "string" ? body.location : "",
			remote_options: typeof body.remoteOptions === "string" ? body.remoteOptions : "",
			work_type: typeof body.workType === "string" ? body.workType : "",
			pay_type: typeof body.payType === "string" ? body.payType : "",
			pay_amount: body.payAmount !== "" && body.payAmount != null && !isNaN(Number(body.payAmount)) ? Number(body.payAmount) : null,
			recommended_course: typeof body.recommendedCourse === "string" ? body.recommendedCourse : "",
			verification_tier: typeof body.verificationTier === "string" ? body.verificationTier : "basic",
			job_description: typeof body.jobDescription === "string" ? body.jobDescription : "",
			responsibilities: Array.isArray(body.responsibilities)
				? body.responsibilities.join(" | ")
				: typeof body.responsibilities === "string"
				? body.responsibilities
				: "",
			must_have_qualifications: Array.isArray(body.mustHaveQualifications) ? body.mustHaveQualifications : [],
			nice_to_have_qualifications: Array.isArray(body.niceToHaveQualifications) ? body.niceToHaveQualifications : [],
			job_summary: typeof body.jobSummary === "string" ? body.jobSummary : "",
			application_deadline: body.applicationDeadline?.date
				? `${body.applicationDeadline.date}T${body.applicationDeadline.time || "00:00"}:00`
				: null,
			max_applicants: body.maxApplicants !== "" && body.maxApplicants != null && !isNaN(Number(body.maxApplicants)) ? Number(body.maxApplicants) : null,
			perks_and_benefits: Array.isArray(body.perksAndBenefits) ? body.perksAndBenefits : [],
		}

		const { error: updateError } = await supabase
			.from("job_postings")
			.update(updateFields)
			.eq("id", jobId)
			.eq("employer_id", employerId)

		if (updateError) {
			return NextResponse.json({ error: updateError.message }, { status: 400 })
		}

		if (Array.isArray(body.applicationQuestions)) {
			await supabase
				.from("application_questions")
				.delete()
				.eq("job_id", jobId)

			if (body.applicationQuestions.length > 0) {
				type ApplicationQuestion = {
					question: string
					type: string
					options?: string[]
					autoReject: boolean
					correctAnswer?: string | string[] | null
				}
				const questionsToInsert = (body.applicationQuestions as ApplicationQuestion[]).map(q => ({
					job_id: jobId,
					question: q.question,
					type: q.type,
					options: q.options ? JSON.stringify(q.options) : null,
					auto_reject: !!q.autoReject,
					correct_answer: Array.isArray(q.correctAnswer)
						? JSON.stringify(q.correctAnswer)
						: q.correctAnswer ?? null,
				}))
				console.log("Questions to insert:", questionsToInsert)
				const { error: insertError } = await supabase
					.from("application_questions")
					.insert(questionsToInsert)
				if (insertError) {
					console.error("Insert error:", insertError)
					return NextResponse.json({ error: insertError.message }, { status: 400 })
				}
			}
		}

		return NextResponse.json({ success: true })
	} catch (err: unknown) {
		let message = "Unknown error"
		let stack = undefined
		if (err instanceof Error) {
			message = err.message
			stack = err.stack
		}
		return NextResponse.json(
			{ error: "Unexpected error", message, stack },
			{ status: 500 }
		)
	}
}
