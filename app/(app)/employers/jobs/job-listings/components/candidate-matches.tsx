/* eslint-disable @typescript-eslint/no-explicit-any */
import { motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Lock } from "@mui/icons-material";

export default function CandidateMatches() {
  const [candidates, setCandidates] = useState<any[]>([]);
  const router = useRouter();
  const { data: session } = useSession();
  const verifyStatus = session?.user?.verifyStatus;

  useEffect(() => {
    fetch("/api/ai-matches/fetch-current-candidates", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    })
      .then((res) => res.json())
      .then((data) => setCandidates(data.candidates || []));
  }, []);

  return (
    <motion.div
      className="bg-white rounded-2xl shadow-lg mb-3 p-4 border-2 border-blue-200 relative overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-blue-700">Candidate Matches</h3>
      </div>

      <div
        className="space-y-3"
        style={verifyStatus !== "full" ? { filter: "blur(6px)", pointerEvents: "none", userSelect: "none" } : {}}
      >
        {candidates
          .sort((a, b) => b.gpt_score - a.gpt_score)
          .slice(0, 3)
          .map((candidate, index) => (
            <motion.div
              key={index}
              className="flex items-center justify-between p-3 hover:bg-blue-50 rounded-xl cursor-pointer transition-colors"
              whileHover={{
                scale: 1.02,
                backgroundColor: "rgba(219, 234, 254, 0.8)",
              }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.1 * index }}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full overflow-hidden">
                  <Image
                    src={
                      candidate.profile_img_url ||
                      `/placeholder.svg?height=32&width=32&text=${(candidate.first_name || candidate.last_name || "U").charAt(0)}`
                    }
                    alt={candidate.first_name + " " + candidate.last_name}
                    width={32}
                    height={32}
                    className="object-cover"
                  />
                </div>
                <div>
                  <p className="font-medium text-blue-700">
                    {candidate.first_name} {candidate.last_name}
                  </p>
                  <p className="text-xs text-blue-500">
                    {candidate.course || candidate.job_title}
                  </p>
                </div>
              </div>
              <motion.div
                className="bg-green-500 text-white text-xs px-2 py-1 rounded-full"
                whileHover={{ scale: 1.1 }}
              >
                {candidate.gpt_score}%
              </motion.div>
            </motion.div>
          ))}
      </div>

      {verifyStatus !== "full" && (
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none">
          <Lock className="text-blue-600 mb-2" style={{ fontSize: 40 }} />
          <span className="text-blue-700 text-base font-semibold text-center">Verify to unlock Candidate Matches</span>
        </div>
      )}

      <div className="mt-4 text-center">
        <motion.button
          className={`text-blue-600 text-sm font-medium hover:text-blue-800 transition-colors${
            verifyStatus !== "full" ? " opacity-60 cursor-not-allowed" : ""
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          disabled={verifyStatus !== "full"}
          onClick={() => {
            if (verifyStatus === "full") router.push("/employers/jobs/candidate-matches");
          }}
        >
          View All
        </motion.button>
      </div>
    </motion.div>
  );
}
