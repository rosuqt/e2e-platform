import { NextApiRequest, NextApiResponse } from "next";
import { pool } from "@/lib/db";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

  switch (method) {
    case "POST":
      const { action, formData, employerId } = req.body;

      if (action === "saveDraft") {
        // Save draft to job_drafts table
        await pool.query(
          `INSERT INTO job_drafts (employer_id, form_data, created_at) VALUES ($1, $2, NOW())`,
          [employerId, formData]
        );
        return res.status(200).json({ message: "Draft saved successfully" });
      }

      if (action === "postJob") {
        // Save finalized job to job_postings table
        await pool.query(
          `INSERT INTO job_postings (employer_id, job_title, location, remote_options, work_type, pay_type, pay_amount, recommended_course, job_description, job_summary, must_have_qualifications, nice_to_have_qualifications, application_deadline, max_applicants, application_questions, perks_and_benefits, verification_tier, created_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, NOW())`,
          [
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
            formData.applicationDeadline,
            formData.maxApplicants,
            JSON.stringify(formData.applicationQuestions),
            formData.perksAndBenefits,
            formData.verificationTier,
          ]
        );
        return res.status(200).json({ message: "Job posted successfully" });
      }

      return res.status(400).json({ message: "Invalid action" });

    case "GET":
      const { employerId: id } = req.query;

      // Fetch verification tier
      const result = await pool.query(
        `SELECT verify_status FROM registered_employers WHERE id = $1`,
        [id]
      );
      const verifyStatus = result.rows[0]?.verify_status || "basic";
      return res.status(200).json({ verifyStatus });

    default:
      res.setHeader("Allow", ["POST", "GET"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
