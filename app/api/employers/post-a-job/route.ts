import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../../lib/authOptions";
import supabase from "../../../../src/lib/supabase";
import { extractSkillsFromJob, buildJobText } from "../../../../src/lib/ai";

interface ApplicationQuestion {
    question: string;
    type: string;
    options?: string[];
    autoReject: boolean;
    correctAnswer?: string | string[];
}

interface FormData {
    jobTitle: string;
    location: string;
    remoteOptions: string;
    workType: string;
    payType: string;
    payAmount: string;
    recommendedCourse: string;
    verificationTier: string;
    jobDescription: string;
    mustHaveQualifications: string[];
    niceToHaveQualifications: string[];
    jobSummary: string;
    applicationDeadline: { date: string; time: string };
    maxApplicants: number | null;
    applicationQuestions: ApplicationQuestion[];
    perksAndBenefits: string[];
    responsibilities: string[];
    skills?: string[];
}

function isFormDataEmpty(formData: FormData): boolean {
    return Object.entries(formData).every(([key, value]) => {
        if (Array.isArray(value)) {
            return value.length === 0 || value.every((item) => typeof item === "string" && item.trim() === ""); 
        }
        if (typeof value === "object" && value !== null) {
            return Object.values(value).every(
                (nestedValue) => typeof nestedValue === "string" && nestedValue.trim() === "" 
            );
        }
        if (key === "verificationTier") {
            return value === "basic";
        }
        if (key === "maxApplicants") {
            return value === null;
        }
        return typeof value === "string" && value.trim() === "";
    });
}

export async function POST(request: Request) {
    const cookies = request.headers.get("cookie");
    console.log("COOKIES:", cookies);

    const session = await getServerSession(authOptions);
    console.log("SESSION IN ROUTE:", session);

    try {
        let employerId: string | undefined;
        let companyId: string | undefined;

        if (session?.user && typeof session.user === "object") {
            if ("employerId" in session.user && typeof (session.user as Record<string, unknown>).employerId === "string") {
                employerId = (session.user as Record<string, unknown>).employerId as string;
            } else if ("id" in session.user && typeof (session.user as Record<string, unknown>).id === "string") {
                employerId = (session.user as Record<string, unknown>).id as string;
            }
            if ("company_id" in session.user && typeof (session.user as Record<string, unknown>).company_id === "string") {
                companyId = (session.user as Record<string, unknown>).company_id as string;
            }
        }

        if (!employerId) {
            return NextResponse.json({ error: "Session expired" }, { status: 401 });
        }

        const { action, formData }: { action: string; formData: FormData } = await request.json();

        console.log("API triggered with action:", action);

        const { data: employer, error: employerError } = await supabase
            .from("registered_employers")
            .select("id")
            .eq("id", employerId)
            .single();

        console.log("SUPABASE employer:", employer, "employerError:", employerError);

        if (employerError || !employer?.id) {
            return NextResponse.json({ error: "Session expired" }, { status: 401 });
        }

        if (action === "saveDraft") {
            console.log("Saving draft...");

            if (isFormDataEmpty(formData)) {
                console.error("Form data is empty or contains only default values. Draft not saved.");
                return NextResponse.json({ error: "Form data is empty or invalid." }, { status: 400 });
            }

            const { data, error } = await supabase
                .from("job_drafts")
                .upsert({
                    employer_id: employerId,
                    job_title: formData.jobTitle,
                    location: formData.location,
                    remote_options: formData.remoteOptions,
                    work_type: formData.workType,
                    pay_type: formData.payType,
                    pay_amount: formData.payAmount,
                    recommended_course: formData.recommendedCourse,
                    job_description: formData.jobDescription,
                    job_summary: formData.jobSummary,
                    must_have_qualifications: formData.mustHaveQualifications,
                    nice_to_have_qualifications: formData.niceToHaveQualifications,
                    application_deadline: formData.applicationDeadline?.date
                        ? `${formData.applicationDeadline.date} ${formData.applicationDeadline.time || ""}`
                        : null,
                    max_applicants: formData.maxApplicants,
                    application_questions: JSON.stringify(formData.applicationQuestions),
                    perks_and_benefits: formData.perksAndBenefits,
                    responsibilities: formData.responsibilities,
                    verification_tier: formData.verificationTier,
                })
                .select()
                .single();

            if (error) {
                console.error("Database error while saving draft:", error.message);
                return NextResponse.json({ error: "Database error", details: error.message }, { status: 500 });
            }

            console.log("Draft saved successfully");
            return NextResponse.json({ message: "Draft saved successfully", data });
        } else if (action === "publishJob") {
            console.log("Publishing job...");
            console.log("formData:", formData);

            let skillsToInsert: string[] = [];
            if (formData.skills && Array.isArray(formData.skills) && formData.skills.length > 0) {
                skillsToInsert = formData.skills.filter(s => typeof s === "string" && s.trim() !== "");
            } else {
                const jobText = buildJobText({
                    job_title: formData.jobTitle,
                    job_summary: formData.jobSummary,
                    job_description: formData.jobDescription,
                    must_have_qualifications: formData.mustHaveQualifications,
                    nice_to_have_qualifications: formData.niceToHaveQualifications,
                    responsibilities: Array.isArray(formData.responsibilities)
                        ? formData.responsibilities.join(", ")
                        : formData.responsibilities
                });
                try {
                    skillsToInsert = await extractSkillsFromJob(jobText);
                    console.log("AI-extracted skills:", skillsToInsert);
                } catch (aiErr) {
                    console.error("AI skill extraction failed:", aiErr);
                }
            }

            const jobInsertResult = await supabase
                .from("job_postings")
                .insert({
                    employer_id: employerId,
                    company_id: companyId,
                    job_title: formData.jobTitle,
                    location: formData.location,
                    remote_options: formData.remoteOptions,
                    work_type: formData.workType,
                    pay_type: formData.payType,
                    pay_amount: formData.payAmount,
                    recommended_course: formData.recommendedCourse,
                    job_description: formData.jobDescription,
                    job_summary: formData.jobSummary,
                    must_have_qualifications: formData.mustHaveQualifications,
                    nice_to_have_qualifications: formData.niceToHaveQualifications,
                    application_deadline: formData.applicationDeadline?.date
                        ? `${formData.applicationDeadline.date} ${formData.applicationDeadline.time || ""}`
                        : null,
                    max_applicants: formData.maxApplicants,
                    perks_and_benefits: formData.perksAndBenefits,
                    responsibilities: formData.responsibilities,
                    verification_tier: formData.verificationTier,
                    ai_skills: skillsToInsert.length > 0 ? skillsToInsert : null,
                })
                .select()
                .single();

            let { data } = jobInsertResult;
            const { error } = jobInsertResult;
            console.log("Inserted job_postings data:", data, "error:", error);

            if (!error && (!data || !data.id)) {
                console.log("Inserted job_postings did not return id, fetching manually...");
                const { data: fetchedJob, error: fetchError } = await supabase
                    .from("job_postings")
                    .select("id")
                    .eq("employer_id", employerId)
                    .eq("job_title", formData.jobTitle)
                    .order("created_at", { ascending: false })
                    .limit(1)
                    .single();
                if (fetchError) {
                    console.error("Failed to fetch job_posting after insert:", fetchError);
                    return NextResponse.json({ error: "Failed to fetch job after insert" }, { status: 500 });
                }
                data = { ...data, ...fetchedJob };
            }

            if (error) {
                console.error("Database error while publishing job:", error.message);
                return NextResponse.json({ error: "Database error", details: error.message }, { status: 500 });
            }

            if (formData.applicationQuestions && formData.applicationQuestions.length > 0 && data?.id) {
                for (const q of formData.applicationQuestions) {
                    let dbType = q.type;
                    if (dbType === "yesno") dbType = "single";

                    let optionsArr = null;
                    if (Array.isArray(q.options) && q.options.length > 0) {
                        optionsArr = q.options.map((opt, idx) => ({
                            id: `opt${idx + 1}`,
                            question_id: undefined,
                            option_value: opt
                        }));
                    }

                    const { data: insertedQ, error: questionError } = await supabase
                        .from("application_questions")
                        .insert({
                            job_id: data.id,
                            question: q.question,
                            type: dbType,
                            auto_reject: q.autoReject,
                            correct_answer:
                                q.correctAnswer !== undefined && q.correctAnswer !== "" && q.autoReject
                                    ? Array.isArray(q.correctAnswer)
                                        ? (q.correctAnswer.length > 0 ? JSON.stringify(q.correctAnswer) : null)
                                        : (q.correctAnswer ? q.correctAnswer : null)
                                    : null,
                            options: optionsArr ? JSON.stringify(optionsArr) : null
                        })
                        .select()
                        .single();

                    if (questionError) {
                        console.error("Error inserting application_question:", questionError);
                        return NextResponse.json({ error: "Database error", details: questionError.message }, { status: 500 });
                    }

                    if (optionsArr && insertedQ?.id) {
                        const optionsWithQid = optionsArr.map(opt => ({
                            ...opt,
                            question_id: insertedQ.id
                        }));
                        await supabase
                            .from("application_questions")
                            .update({ options: JSON.stringify(optionsWithQid) })
                            .eq("id", insertedQ.id);
                    }
                }
            }

            console.log("Job posted successfully");
            return NextResponse.json({ message: "Job posted successfully", data });
        } else if (action === "fetchVerificationStatus") {
            console.log("Fetching verification status...");
            const { data, error } = await supabase
                .from("registered_employers")
                .select("verify_status")
                .eq("id", employerId)
                .single();

            if (error) {
                console.error("Database error while fetching verification status:", error.message);
                return NextResponse.json({ error: "Database error", details: error.message }, { status: 500 });
            }

            console.log("Fetched verification status:", data?.verify_status || "basic");
            return NextResponse.json({ verificationStatus: data?.verify_status || "basic" });
        }

        console.log("Invalid action received");
        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    } catch (error) {
        const err = error as Error;
        console.error("Error in API:", err.message);
        return NextResponse.json({ error: "Internal Server Error", details: err.message }, { status: 500 });
    }
}
