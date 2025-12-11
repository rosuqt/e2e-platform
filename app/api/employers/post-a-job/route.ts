import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../../lib/authOptions";
import supabase from "../../../../src/lib/supabase";
import { extractSkillsFromJob, buildJobText, getSkillDetails } from "../../../../src/lib/ai";

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
    maxApplicants: string | number | null;
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

        // Fix request body destructuring and usage
        const body = await request.json();
        const action = body.action;
        const data: FormData = body.data;

        if (!data) {
            console.error("No form data provided in request body.");
            return NextResponse.json({ error: "No form data provided." }, { status: 400 });
        }

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

            if (isFormDataEmpty(data)) {
                console.error("Form data is empty or contains only default values. Draft not saved.");
                return NextResponse.json({ error: "Form data is empty or invalid." }, { status: 400 });
            }

            const { data: draftData, error } = await supabase
                .from("job_drafts")
                .upsert({
                    employer_id: employerId,
                    job_title: data.jobTitle,
                    location: data.location,
                    remote_options: data.remoteOptions,
                    work_type: data.workType,
                    pay_type: data.payType,
                    pay_amount: data.payAmount,
                    recommended_course: data.recommendedCourse,
                    job_description: data.jobDescription,
                    job_summary: data.jobSummary,
                    must_have_qualifications: data.mustHaveQualifications,
                    nice_to_have_qualifications: data.niceToHaveQualifications,
                    application_deadline: data.applicationDeadline?.date
                        ? `${data.applicationDeadline.date} ${data.applicationDeadline.time || ""}`
                        : null,
                    max_applicants: data.maxApplicants,
                    application_questions: JSON.stringify(data.applicationQuestions),
                    perks_and_benefits: data.perksAndBenefits,
                    responsibilities: data.responsibilities,
                    verification_tier: data.verificationTier,
                })
                .select()
                .single();

            if (error) {
                console.error("Database error while saving draft:", error.message);
                return NextResponse.json({ error: "Database error", details: error.message }, { status: 500 });
            }

            console.log("Draft saved successfully");
            return NextResponse.json({ message: "Draft saved successfully", data: draftData });
        } else if (action === "publishJob") {
            console.log("Publishing job...");
            console.log("data:", data);

            let maxApplicantsToInsert: number | null = null;
            if (
                data.maxApplicants !== undefined &&
                data.maxApplicants !== null &&
                !(typeof data.maxApplicants === "string" && data.maxApplicants === "")
            ) {
                if (typeof data.maxApplicants === "string") {
                    const parsed = Number(data.maxApplicants);
                    maxApplicantsToInsert = isNaN(parsed) ? null : parsed;
                } else {
                    maxApplicantsToInsert = data.maxApplicants;
                }
            }

            let skillsToInsert: string[] = [];
            if (data.skills && Array.isArray(data.skills) && data.skills.length > 0) {
                skillsToInsert = data.skills.filter(s => typeof s === "string" && s.trim() !== "");
            } else {
                const jobText = buildJobText({
                    job_title: data.jobTitle,
                    job_summary: data.jobSummary,
                    job_description: data.jobDescription,
                    must_have_qualifications: data.mustHaveQualifications,
                    nice_to_have_qualifications: data.niceToHaveQualifications,
                    responsibilities: Array.isArray(data.responsibilities)
                        ? data.responsibilities.join(", ")
                        : data.responsibilities
                });
                try {
                    skillsToInsert = await extractSkillsFromJob(jobText);
                } catch (aiErr) {
                    console.error("AI skill extraction failed:", aiErr);
                }
            }

            for (const skill of skillsToInsert) {
                try {
                    const { data: existingSkill } = await supabase
                        .from("skills_match_booster")
                        .select("id")
                        .eq("name", skill)
                        .limit(1)
                        .single();
                    if (!existingSkill) {
                        const details = await getSkillDetails(skill);
                        await supabase
                            .from("skills_match_booster")
                            .insert({
                                name: skill,
                                description: details.description,
                                course: details.course,
                                resource_titles: details.resource_titles,
                                resource_urls: details.resource_urls,
                                resource_levels: details.resource_levels
                            });
                    }
                } catch {
                    // Swallow error, do nothing
                }
            }

            const jobInsertResult = await supabase
                .from("job_postings")
                .insert({
                    employer_id: employerId,
                    company_id: companyId,
                    job_title: data.jobTitle,
                    location: data.location,
                    remote_options: data.remoteOptions,
                    work_type: data.workType,
                    recommended_course: data.recommendedCourse,
                    job_description: data.jobDescription,
                    job_summary: data.jobSummary,
                    must_have_qualifications: data.mustHaveQualifications,
                    nice_to_have_qualifications: data.niceToHaveQualifications,
                    application_deadline: data.applicationDeadline?.date
                        ? `${data.applicationDeadline.date} ${data.applicationDeadline.time || ""}`
                        : null,
                    max_applicants: maxApplicantsToInsert,
                    perks_and_benefits: data.perksAndBenefits,
                    responsibilities: data.responsibilities,
                    verification_tier: data.verificationTier,
                    ai_skills: skillsToInsert.length > 0 ? skillsToInsert : null,
                })
                .select()
                .single();

            let { data: jobData } = jobInsertResult;
            const { error } = jobInsertResult;
            console.log("Inserted job_postings data:", jobData, "error:", error);

            if (!error && (!jobData || !jobData.id)) {
                console.log("Inserted job_postings did not return id, fetching manually...");
                const { data: fetchedJob, error: fetchError } = await supabase
                    .from("job_postings")
                    .select("id")
                    .eq("employer_id", employerId)
                    .eq("job_title", data.jobTitle)
                    .order("created_at", { ascending: false })
                    .limit(1)
                    .single();
                if (fetchError) {
                    console.error("Failed to fetch job_posting after insert:", fetchError);
                    return NextResponse.json({ error: "Failed to fetch job after insert" }, { status: 500 });
                }
                jobData = { ...jobData, ...fetchedJob };
            }

            if (error) {
                console.error("Database error while publishing job:", error.message);
                return NextResponse.json({ error: "Database error", details: error.message }, { status: 500 });
            }

            if (jobData?.id) {
                const { error: metricsError } = await supabase
                    .from("job_metrics")
                    .insert({
                        job_id: jobData.id,
                        views: 0,
                        total_applicants: 0,
                        qualified_applicants: 0,
                        interviews: 0
                    });

                if (metricsError) {
                    console.error("Error creating job metrics:", metricsError.message);
                }
            }

            let applicationQuestionsArr: ApplicationQuestion[] = []
            if (Array.isArray(data.applicationQuestions)) {
                applicationQuestionsArr = data.applicationQuestions
            } else if (typeof data.applicationQuestions === "string") {
                try {
                    const parsed = JSON.parse(data.applicationQuestions)
                    if (Array.isArray(parsed)) applicationQuestionsArr = parsed
                } catch {
                    applicationQuestionsArr = []
                }
            } else if (data.applicationQuestions) {
                applicationQuestionsArr = [data.applicationQuestions]
            }

            if (applicationQuestionsArr.length > 0 && jobData?.id) {
                const filteredQuestions = applicationQuestionsArr.filter(q => typeof q.question === "string" && q.question.trim() !== "");
                for (const q of filteredQuestions) {
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
                            job_id: jobData.id,
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
            console.log("Returning response to frontend:", { message: "Job posted successfully", data: jobData });
            return NextResponse.json({ message: "Job posted successfully", data: jobData, job_id: jobData?.id });
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
        console.error("Error in API:", (error as Error).message);
        return NextResponse.json({ error: "Internal Server Error", details: (error as Error).message }, { status: 500 });
    }
}
