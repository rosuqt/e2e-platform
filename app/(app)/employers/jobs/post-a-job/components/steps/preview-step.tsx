"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import { motion } from "framer-motion";
import { Card, CardContent } from "../ui/card";
import { Briefcase, MapPin, Calendar, Users, Award, Eye, CheckCircle, MessageSquare } from "lucide-react";
import { PiNotepadBold } from "react-icons/pi";
import type { JobPostingData } from "../../lib/types";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

interface PreviewStepProps {
  formData: JobPostingData;
  onPreview: () => void;
}

function capitalizeWords(str: string) {
  if (!str) return str;
  return str.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.slice(1).toLowerCase());
}

export function PreviewStep({ formData /*, onPreview */ }: PreviewStepProps) {
  const router = useRouter();

  const handlePreview = async () => {
    try {
      const isSuccessful = true; 
      if (isSuccessful) {
        router.push("/employers/post-a-job/components/steps/job-posting-live");
      } else {
        throw new Error("Failed to post the job.");
      }
    } catch (error) {
      const errorMessage = typeof error === "string" ? error : (error as Error).message;

      if (errorMessage.includes("Invalid EmployerID")) {
        Swal.fire({
          icon: "warning",
          title: "Session Expired",
          text: "Your session has expired. Please sign in again to continue.",
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: errorMessage || "Something went wrong!",
        });
      }
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center space-x-3 pb-2 border-b border-gray-100">
        <div className="bg-blue-100 p-2 rounded-full">
          <CheckCircle className="h-5 w-5 text-blue-600" />
        </div>
        <h2 className="text-xl font-semibold text-gray-800">You&apos;re almost there!</h2>
      </div>

      <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg border border-green-100 flex items-center gap-2">
        <PiNotepadBold className="h-5 w-5 text-green-600" />
        <p className="text-green-800">
          Review your job details before finalizing your job posting. Make sure all information is accurate.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-gray-200 shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-center gap-2 mb-4 pb-2 border-b border-blue-100">
              <Briefcase className="h-5 w-5 text-blue-500" />
              <h3 className="font-medium text-gray-800">Job Details</h3>
            </div>

            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <div className="w-5 h-5 mt-0.5 flex-shrink-0">
                  <Briefcase className="h-4 w-4 text-gray-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Job Title</p>
                  <p className="text-gray-800">{capitalizeWords(formData.jobTitle) || "[Position Name]"}</p>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <div className="w-5 h-5 mt-0.5 flex-shrink-0">
                  <MapPin className="h-4 w-4 text-gray-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Location</p>
                  <p className="text-gray-800">{capitalizeWords(formData.location) || "[Location]"}</p>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <div className="w-5 h-5 mt-0.5 flex-shrink-0">
                  <MapPin className="h-4 w-4 text-gray-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Remote Options</p>
                  <p className="text-gray-800">{capitalizeWords(formData.remoteOptions) || "[Remote Options]"}</p>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <div className="w-5 h-5 mt-0.5 flex-shrink-0">
                  <Briefcase className="h-4 w-4 text-gray-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Work Type</p>
                  <p className="text-gray-800">{capitalizeWords(formData.workType) || "[Work Type]"}</p>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <div className="w-5 h-5 mt-0.5 flex-shrink-0">
                  <Briefcase className="h-4 w-4 text-gray-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Recommended Course</p>
                  <p className="text-gray-800">{capitalizeWords(formData.recommendedCourse) || "[Course]"}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-gray-200 shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-100">
              <PiNotepadBold className="h-5 w-5 text-blue-500" />
              <h3 className="font-medium text-gray-800">Job Description</h3>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Description</p>
                <p className="text-gray-800 text-sm">{capitalizeWords(formData.jobDescription) || "[Job Description]"}</p>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Summary</p>
                <p className="text-gray-800 text-sm">{capitalizeWords(formData.jobSummary) || "[Job Summary]"}</p>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Must-Have Qualifications</p>
                <ul className="list-disc pl-5 text-sm text-gray-800 space-y-1">
                  {formData.mustHaveQualifications.map((qual, index) => (
                    <li key={index}>{capitalizeWords(qual) || "[Qualification]"}</li>
                  ))}
                </ul>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Nice-to-Have Qualifications</p>
                <ul className="list-disc pl-5 text-sm text-gray-800 space-y-1">
                  {formData.niceToHaveQualifications.map((qual, index) => (
                    <li key={index}>{capitalizeWords(qual) || "[Qualification]"}</li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-gray-200 shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-100">
              <Calendar className="h-5 w-5 text-blue-500" />
              <h3 className="font-medium text-gray-800">Application Settings</h3>
            </div>

            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <div className="w-5 h-5 mt-0.5 flex-shrink-0">
                  <Calendar className="h-4 w-4 text-gray-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Application Deadline</p>
                  <p className="text-gray-800">
                    {formData.applicationDeadline?.date
                      ? `${capitalizeWords(formData.applicationDeadline.date)} ${formData.applicationDeadline.time ? capitalizeWords(formData.applicationDeadline.time) : ""}`
                      : "[No deadline set]"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <div className="w-5 h-5 mt-0.5 flex-shrink-0">
                  <Users className="h-4 w-4 text-gray-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Max Applicants</p>
                  <p className="text-gray-800">{formData.maxApplicants ? capitalizeWords(formData.maxApplicants.toString()) : "[No limit set]"}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-gray-200 shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-100">
              <MessageSquare className="h-5 w-5 text-blue-500" />
              <h3 className="font-medium text-gray-800">Application Questions</h3>
            </div>
            {formData.applicationQuestions && formData.applicationQuestions.length > 0 ? (
              <div className="space-y-3">
                {formData.applicationQuestions.map((q, idx) => (
                  <div key={idx} className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                    <div className="font-medium text-gray-800">{q.question}</div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                        {q.type === "text"
                          ? "Text"
                          : q.type === "single"
                          ? "Single select"
                          : q.type === "multi"
                          ? "Multi select"
                          : "Yes/No"}
                      </span>
                      {q.autoReject && (
                        <span className="text-xs bg-red-100 text-red-800 px-2 py-0.5 rounded-full">
                          Auto-reject
                        </span>
                      )}
                    </div>
                    {q.options && (
                      <div className="mt-2">
                        <span className="text-xs text-gray-500">Options: </span>
                        <span className="text-xs text-gray-700">
                          {q.options.join(", ")}
                        </span>
                      </div>
                    )}
                    {q.autoReject && q.correctAnswer && (
                      <div className="mt-1 text-xs text-red-700">
                        Auto-reject criteria:{" "}
                        {Array.isArray(q.correctAnswer)
                          ? q.correctAnswer.join(", ")
                          : q.correctAnswer}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">[No questions added]</p>
            )}
          </CardContent>
        </Card>

        <Card className="border-gray-200 shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-100">
              <Award className="h-5 w-5 text-blue-500" />
              <h3 className="font-medium text-gray-800">Perks & Benefits</h3>
            </div>

            {formData.perksAndBenefits?.length ? (
              <div className="flex flex-wrap gap-2">
                {formData.perksAndBenefits.map((perk) => (
                  <span key={perk} className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm">
                    {capitalizeWords(perk)}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">[No perks selected]</p>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col items-center justify-center py-8 space-y-6">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, type: "spring" }}
        >
          <Image
            src="https://img.freepik.com/free-vector/copywriting-social-media-post-content-marketing-internet-commercial-cartoon-character-writing-text-advertising-promotional-strategy-concept-illustration_335657-2066.jpg?semt=ais_hybrid&w=740"
            alt="Job posting illustration"
            width={200}
            height={150}
            className="mx-auto"
          />
        </motion.div>

        <div className="text-center space-y-2">
          <h3 className="font-semibold text-lg text-gray-800">Looks good!</h3>
          <p className="text-gray-600 max-w-md mx-auto">
            Your job post is ready to go live. Preview it one last time before posting to make sure everything looks
            perfect.
          </p>
        </div>

        <Button
          onClick={handlePreview}
          className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 gap-2 text-white"
        >
          <Eye size={18} />
          Preview Job Posting
        </Button>
      </div>
    </div>
  );
}
