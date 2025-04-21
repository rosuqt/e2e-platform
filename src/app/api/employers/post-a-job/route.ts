import { NextResponse } from "next/server";
import supabase from "../../../lib/supabase";

export async function POST(request: Request) {
    try {
        const { action, formData, employerId } = await request.json();

        console.log("API triggered with action:", action);
        console.log("Received formData:", formData);

        if (action === "saveDraft") {
            console.log("Saving draft...");
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
            const { data, error } = await supabase
                .from("job_postings")
                .insert({
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
                    verification_tier: formData.verificationTier,
                })
                .select()
                .single();

            if (error) {
                console.error("Database error while publishing job:", error.message);
                return NextResponse.json({ error: "Database error", details: error.message }, { status: 500 });
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
