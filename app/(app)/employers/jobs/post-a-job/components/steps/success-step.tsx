"use client";
import { CheckCircle, ExternalLink, Share2, Plus } from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { ConfettiCustomShapes } from "@/components/magicui/shapes";
import { useEffect, useState } from "react";
import { ShareModal } from "../share-modal";

export default function JobPostingLive({ onPostAnotherJob, jobId }: { onPostAnotherJob?: () => void, jobId?: string }) {
  const router = useRouter();
  const [showShare, setShowShare] = useState(false);
  const shareUrl = typeof window !== "undefined"
    ? `${window.location.origin}/students/jobs/job-listings?jobId=${jobId ?? "job-slug"}`
    : "https://example.com/share-link";

  useEffect(() => {
    window.scrollTo(0, 320); 
  }, []);

  const handleViewJobPost = () => {
    router.push("/employers/jobs/job-listings");
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <ShareModal open={showShare} onClose={() => setShowShare(false)} shareUrl={shareUrl} />
      <div className="bg-white rounded-3xl p-12 md:p-16 max-w-[70rem] w-full mx-auto mt-[-50px]">
        <ConfettiCustomShapes />

        <div className="flex flex-col items-center text-center">
          {/* Success Icon */}
          <motion.div
            className="w-32 h-32 rounded-full bg-blue-50 flex items-center justify-center mb-6"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              type: "spring",
              stiffness: 200,
              damping: 15,
              delay: 0.5,
            }}
          >
            <motion.div
              animate={{
                scale: [1, 1.1, 1],
                rotate: [0, 5, 0, -5, 0],
              }}
              transition={{
                duration: 3,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
            >
              <div className="relative">
                <div className="absolute inset-0 rounded-full bg-blue-500 opacity-20 animate-ping" />
                <CheckCircle size={120} className="text-blue-500 mb-10" />
              </div>
            </motion.div>
          </motion.div>

          {/* Congratulations Text */}
          <motion.h1
            className="text-4xl md:text-5xl font-bold text-blue-600 mb-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.5 }}
          >
            Your job posting is now live
          </motion.h1>

          <motion.p
            className="text-gray-700 text-medium max-w-2xl mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1, duration: 0.5 }}
          >
            Your job posting has been successfully published and is now visible to potential candidates. You can start
            receiving applications and manage them from your dashboard.
          </motion.p>

          {/* Next Steps Section */}
          <motion.div
            className="w-full"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.3, duration: 0.5 }}
          >
            <h3 className="text-xl font-bold text-blue-700 mb-6">Next Steps</h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* View Job Post */}
              <motion.div
                whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.5)" }}
                className="bg-gradient-to-br from-blue-50 to-sky-50 rounded-2xl p-6 transition-all duration-300"
              >
                <button
                  type="button"
                  onClick={handleViewJobPost}
                  className="flex flex-col items-center text-center w-full"
                >
                  <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                    <ExternalLink size={28} className="text-blue-500" />
                  </div>
                  <h4 className="font-bold text-blue-700 mb-2">View Job Post</h4>
                  <p className="text-blue-600 text-sm">See how your job posting appears to candidates</p>
                </button>
              </motion.div>

              {/* Post Another Job */}
              <motion.div
                whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.5)" }}
                className="bg-gradient-to-br from-blue-50 to-sky-50 rounded-2xl p-6 transition-all duration-300"
              >
                <button
                  type="button"
                  onClick={onPostAnotherJob}
                  className="flex flex-col items-center text-center w-full"
                >
                  <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                    <Plus size={28} className="text-blue-500" />
                  </div>
                  <h4 className="font-bold text-blue-700 mb-2">Post Another Job</h4>
                  <p className="text-blue-600 text-sm">Create a new job posting</p>
                </button>
              </motion.div>

              {/* Share Job Post */}
              <motion.div
                whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.5)" }}
                className="bg-gradient-to-br from-blue-50 to-sky-50 rounded-2xl p-6 transition-all duration-300"
              >
                <button
                  type="button"
                  onClick={() => setShowShare(true)}
                  className="flex flex-col items-center text-center w-full"
                >
                  <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                    <Share2 size={28} className="text-blue-500" />
                  </div>
                  <h4 className="font-bold text-blue-700 mb-2">Share Job Post</h4>
                  <p className="text-blue-600 text-sm">Share your job posting on social media</p>
                </button>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
