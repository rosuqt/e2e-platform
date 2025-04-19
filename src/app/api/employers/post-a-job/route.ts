import { NextResponse } from "next/server";
import client from "@/app/lib/db";

export async function POST(request: Request) {
    try {
        const { action, formData, employerId } = await request.json();

        console.log("API triggered with action:", action);
        console.log("Received formData:", formData);

        if (action === "saveDraft") {
            console.log("Saving draft...");
            const query = `
                INSERT INTO job_drafts (
                    employer_id, job_title, location, remote_options, work_type, pay_type, pay_amount,
                    recommended_course, job_description, job_summary, must_have_qualifications,
                    nice_to_have_qualifications, application_deadline, max_applicants, application_questions,
                    perks_and_benefits, verification_tier
                ) VALUES (
                    $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17
                ) ON CONFLICT (employer_id) DO UPDATE SET
                    job_title = $2, location = $3, remote_options = $4, work_type = $5, pay_type = $6,
                    pay_amount = $7, recommended_course = $8, job_description = $9, job_summary = $10,
                    must_have_qualifications = $11, nice_to_have_qualifications = $12,
                    application_deadline = $13, max_applicants = $14, application_questions = $15,
                    perks_and_benefits = $16, verification_tier = $17, updated_at = NOW()
            `;
            const values = [
                employerId,
                formData.jobTitle,
                formData.location,
                formData.remoteOptions,
                formData.workType,
                formData.payType,
                formData.payAmount,
                formData.recommendedCourse,
                formData.jobDescription,
                formData.jobSummary,
                formData.mustHaveQualifications,
                formData.niceToHaveQualifications,
                formData.applicationDeadline?.date
                    ? `${formData.applicationDeadline.date} ${formData.applicationDeadline.time || ""}`
                    : null,
                formData.maxApplicants,
                JSON.stringify(formData.applicationQuestions),
                formData.perksAndBenefits,
                formData.verificationTier,
            ];
            try {
                await client.query(query, values);
                console.log("Draft saved successfully");
                return NextResponse.json({ message: "Draft saved successfully" });
            } catch (dbError) {
                const error = dbError as Error; 
                console.error("Database error while saving draft:", error.message);
                return NextResponse.json({ error: "Database error", details: error.message }, { status: 500 });
            }
        } else if (action === "publishJob") {
            console.log("Publishing job...");
            const query = `
                INSERT INTO job_postings (
                    employer_id, job_title, location, remote_options, work_type, pay_type, pay_amount,
                    recommended_course, job_description, job_summary, must_have_qualifications,
                    nice_to_have_qualifications, application_deadline, max_applicants, application_questions,
                    perks_and_benefits, verification_tier
                ) VALUES (
                    $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17
                )
            `;
            const values = [
                employerId,
                formData.jobTitle,
                formData.location,
                formData.remoteOptions,
                formData.workType,
                formData.payType,
                formData.payAmount,
                formData.recommendedCourse,
                formData.jobDescription,
                formData.jobSummary,
                formData.mustHaveQualifications,
                formData.niceToHaveQualifications,
                formData.applicationDeadline?.date
                    ? `${formData.applicationDeadline.date} ${formData.applicationDeadline.time || ""}`
                    : null,
                formData.maxApplicants,
                JSON.stringify(formData.applicationQuestions),
                formData.perksAndBenefits,
                formData.verificationTier,
            ];
            try {
                await client.query(query, values);
                console.log("Job posted successfully");
                return NextResponse.json({ message: "Job posted successfully" });
            } catch (dbError) {
                const error = dbError as Error; 
                console.error("Database error while publishing job:", error.message);
                return NextResponse.json({ error: "Database error", details: error.message }, { status: 500 });
            }
        } else if (action === "fetchVerificationStatus") {
            console.log("Fetching verification status...");
            const query = `SELECT verify_status FROM registered_employers WHERE id = $1`;
            try {
                const { rows } = await client.query(query, [employerId]);
                console.log("Fetched verification status:", rows[0]?.verify_status || "basic");
                return NextResponse.json({ verificationStatus: rows[0]?.verify_status || "basic" });
            } catch (dbError) {
                const error = dbError as Error;
                console.error("Database error while fetching verification status:", error.message);
                return NextResponse.json({ error: "Database error", details: error.message }, { status: 500 });
            }
        }

        console.log("Invalid action received");
        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    } catch (error) {
        const err = error as Error;
        console.error("Error in API:", err.message);
        return NextResponse.json({ error: "Internal Server Error", details: err.message }, { status: 500 });
    }
}
