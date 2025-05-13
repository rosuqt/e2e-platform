"use client"

import { Button } from "@/components/ui/button"
import type { JobPostingData } from "../../lib/types"
import { Check, Shield, ShieldCheck, ShieldAlert, Lightbulb } from "lucide-react"
import { motion } from "framer-motion"

interface ValidationStepProps {
  formData: JobPostingData
  updateFormData: (data: Partial<JobPostingData>) => void
}

export function ValidationStep({ formData, updateFormData }: ValidationStepProps) {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center space-x-3 pb-2 border-b border-gray-100">
        <div className="bg-blue-100 p-2 rounded-full">
          <ShieldCheck className="h-5 w-5 text-blue-600" />
        </div>
        <h2 className="text-xl font-semibold text-gray-800">User Verification Tiers</h2>
      </div>

      <p className="text-gray-600">
        Choose your verification level to increase your job posting&apos;s visibility and credibility.
      </p>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {/* Basic Access */}
        <motion.div
          variants={item}
          className={`rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 ${
            formData.verificationTier === "basic"
              ? "border-2 border-blue-500 transform scale-[1.02]"
              : "border border-gray-200"
          }`}
        >
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-5">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <ShieldAlert className="h-5 w-5 text-blue-500" />
                <h3 className="font-semibold text-lg text-gray-800">Basic Access</h3>
              </div>
              {formData.verificationTier === "basic" && (
                <div className="bg-blue-100 text-blue-700 text-xs font-medium px-2 py-1 rounded-full">Current</div>
              )}
            </div>
          </div>

          <div className="p-5 space-y-5">
            <div className="flex items-start gap-3">
              <div className="bg-blue-100 rounded-full p-1 mt-0.5">
                <Check size={14} className="text-blue-600" />
              </div>
              <p className="text-sm text-gray-600">Must sign the Employer Agreement</p>
            </div>

            <div className="border-t border-gray-100 pt-5">
              <h4 className="font-medium text-sm text-gray-700 mb-3">What you get:</h4>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <div className="min-w-4 mt-0.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-gray-400"></div>
                  </div>
                  <span className="text-sm text-gray-600">Job postings has low visibility</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="min-w-4 mt-0.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-gray-400"></div>
                  </div>
                  <span className="text-sm text-gray-600">Has a &quot;Unverified&quot; badge</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="min-w-4 mt-0.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-gray-400"></div>
                  </div>
                  <span className="text-sm text-gray-600">Cannot message applicants</span>
                </li>
              </ul>
            </div>

            <div className="pt-3">
              {formData.verificationTier === "basic" ? (
                <Button className="w-full bg-blue-600 hover:bg-blue-700">Current Tier</Button>
              ) : formData.verificationTier === "standard" || formData.verificationTier === "full" ? null : (
                <Button
                  variant="outline"
                  className="w-full border-blue-200 text-blue-700 hover:bg-blue-50 hover:text-blue-800"
                  onClick={() => updateFormData({ verificationTier: "basic" })}
                >
                  Verify
                </Button>
              )}
            </div>
          </div>
        </motion.div>

        {/* Standard Access */}
        <motion.div
          variants={item}
          className={`rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 ${
            formData.verificationTier === "standard"
              ? "border-2 border-blue-500 transform scale-[1.02]"
              : "border border-gray-200"
          }`}
        >
          <div className="bg-gradient-to-br from-blue-100 to-indigo-100 p-5">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-blue-600" />
                <h3 className="font-semibold text-lg text-gray-800">Standard Access</h3>
              </div>
              {formData.verificationTier === "standard" && (
                <div className="bg-blue-100 text-blue-700 text-xs font-medium px-2 py-1 rounded-full">Current</div>
              )}
            </div>
          </div>

          <div className="p-5 space-y-5">
            <div className="flex items-start gap-3">
              <div className="bg-blue-100 rounded-full p-1 mt-0.5">
                <Check size={14} className="text-blue-600" />
              </div>
              <p className="text-sm text-gray-600">Verify with your company email</p>
            </div>

            <div className="border-t border-gray-100 pt-5">
              <h4 className="font-medium text-sm text-gray-700 mb-3">What you get:</h4>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <div className="min-w-4 mt-0.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                  </div>
                  <span className="text-sm text-gray-600">Job postings gain higher visibility</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="min-w-4 mt-0.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                  </div>
                  <span className="text-sm text-gray-600">Receives a &quot;Partially verified&quot; badge</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="min-w-4 mt-0.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-gray-400"></div>
                  </div>
                  <span className="text-sm text-gray-600">Cannot message applicants</span>
                </li>
              </ul>
            </div>

            <div className="pt-3">
              {formData.verificationTier === "standard" ? (
                <Button className="w-full bg-blue-600 hover:bg-blue-700">Current Tier</Button>
              ) : formData.verificationTier === "full" ? null : (
                <Button
                  variant="outline"
                  className="w-full border-blue-200 text-blue-700 hover:bg-blue-50 hover:text-blue-800"
                  onClick={() => updateFormData({ verificationTier: "standard" })}
                >
                  Verify
                </Button>
              )}
            </div>
          </div>
        </motion.div>

        {/* Full Access */}
        <motion.div
          variants={item}
          className={`rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 ${
            formData.verificationTier === "full"
              ? "border-2 border-blue-500 transform scale-[1.02]"
              : "border border-gray-200"
          }`}
        >
          <div className="bg-gradient-to-br from-blue-200 to-indigo-200 p-5">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-blue-700" />
                <h3 className="font-semibold text-lg text-gray-800">Full Access</h3>
              </div>
              {formData.verificationTier === "full" && (
                <div className="bg-blue-100 text-blue-700 text-xs font-medium px-2 py-1 rounded-full">Current</div>
              )}
            </div>
          </div>

          <div className="p-5 space-y-5">
            <div className="flex items-start gap-3">
              <div className="bg-blue-100 rounded-full p-1 mt-0.5">
                <Check size={14} className="text-blue-600" />
              </div>
              <p className="text-sm text-gray-600">Verify by submitting at least one official document</p>
            </div>

            <div className="border-t border-gray-100 pt-5">
              <h4 className="font-medium text-sm text-gray-700 mb-3">What you get:</h4>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <div className="min-w-4 mt-0.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                  </div>
                  <span className="text-sm text-gray-600">Job postings gain maximum visibility</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="min-w-4 mt-0.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                  </div>
                  <span className="text-sm text-gray-600">Receives a &quot;Verified&quot; badge</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="min-w-4 mt-0.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                  </div>
                  <span className="text-sm text-gray-600">Can message applicants</span>
                </li>
              </ul>
            </div>

            <div className="pt-3">
              {formData.verificationTier === "full" ? (
                <Button className="w-full bg-blue-600 hover:bg-blue-700">Current Tier</Button>
              ) : (
                <Button
                  variant="outline"
                  className="w-full border-blue-200 text-blue-700 hover:bg-blue-50 hover:text-blue-800"
                  onClick={() => updateFormData({ verificationTier: "full" })}
                >
                  Verify
                </Button>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>

      <div className="bg-blue-50 rounded-lg p-4 border border-blue-100 mt-6">
        <p className="text-sm text-blue-700 flex items-center gap-2">
          <Lightbulb className="h-4 w-4 text-blue-500" />
          <span className="font-medium">Pro tip:</span> Higher verification levels increase your job posting&apos;s
          visibility and credibility with applicants.
        </p>
      </div>
    </div>
  )
}
