"use client";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { JobPostingData } from "../lib/types";
import JobCard from "../../../../students/jobs/job-listings/components/job-cards";

export default function JobPreviewModal({
  open,
  onClose,
  formData,
}: {
  open: boolean;
  onClose: () => void;
  formData: JobPostingData;
}) {
  const [companyName, setCompanyName] = useState<string>("Your Company");
  const [companyLogoImagePath, setCompanyLogoImagePath] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    async function fetchCompanyDetails() {
      setLoading(true);
      try {
        const res = await fetch(
          "/api/employers/get-employer-details",
          { credentials: "include" }
        );
        if (res.ok) {
          const data = await res.json();
          setCompanyName(data.company_name || "Your Company");
          setCompanyLogoImagePath(data.company_logo_image_path || null);
        }
      } catch {}
      setLoading(false);
    }
    fetchCompanyDetails();
  }, []);

  const jobCardData = {
    id: "preview",
    job_title: formData.jobTitle,
    title: formData.jobTitle,
    location: formData.location,
    work_type: formData.workType,
    pay_type: formData.payType,
    pay_amount: formData.payAmount,
    job_summary: formData.jobSummary,
    remote_options: formData.remoteOptions,
    application_deadline: formData.applicationDeadline?.date || "",
    must_have_qualifications: formData.mustHaveQualifications,
    nice_to_have_qualifications: formData.niceToHaveQualifications,
    perks_and_benefits: formData.perksAndBenefits,
    recommended_course: formData.recommendedCourse,
    employers: {
      first_name: "You",
      last_name: "",
      company_name: companyName,
    },
    registered_employers: {
      company_name: companyName,
    },
    created_at: new Date().toISOString(),
    company_id: "preview", 
  };

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  const modalContent = (
    <AnimatePresence>
      {open && (
        loading ? (
          <div className="flex items-center justify-center min-h-[300px]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 border-solid" />
          </div>
        ) : (
        <motion.div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="relative max-w-3xl w-full mx-auto bg-white rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-y-auto min-h-0"
            initial={{ y: 60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 60, opacity: 0 }}
            transition={{ type: "spring", stiffness: 80, damping: 18 }}
          >
            <div className="flex items-center justify-between px-8 py-6 border-b border-gray-100">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Preview Job Posting
                </h2>
                <p className="text-gray-500 text-sm mt-1">
                  See how your job will appear to candidates before publishing.
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full"
                onClick={onClose}
              >
                <X className="w-6 h-6" />
              </Button>
            </div>
          
            <div className="px-8 py-8 overflow-y-auto min-h-[400px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key="dashboard"
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -40 }}
                  transition={{ duration: 0.35, type: "spring" }}
                >
                  <div className="border border-gray-200 rounded-2xl p-2">
                    <JobCard
                      id={jobCardData.id}
                      isSelected={false}
                      onSelect={() => {}}
                      onQuickApply={() => {}}
                      job={jobCardData}
                      companyLogoImagePath={companyLogoImagePath}
                    />
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
            <div className="px-8 pb-8 flex text-blue-500 hover:text-blue-600 justify-end">
                <Button
                onClick={onClose}
                variant="outline"
                className="border-blue-500 text-blue-500 hover:bg-blue-50 hover:border-blue-600 hover:text-blue-600"
                >
                Close Preview
                </Button>
            </div>
          </motion.div>
        </motion.div>
        )
      )}
    </AnimatePresence>
  );

  if (!mounted || typeof window === "undefined") return null;
  return createPortal(modalContent, document.body);
}