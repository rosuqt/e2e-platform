import { motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function CandidateMatches() {
  const candidates = [
    { name: "Man Dani", company: "BS: Information Technology", match: 79 },
    { name: "Ally Rose", company: "BS: Tourism", match: 95 },
    { name: "Zey Ners", company: "BS: Human Resource", match: 88 },
  ];

  const router = useRouter();

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

      <div className="space-y-3">
        {candidates.map((candidate, index) => (
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
                  src={`/placeholder.svg?height=32&width=32&text=${candidate.name.charAt(0)}`}
                  alt={candidate.name}
                  width={32}
                  height={32}
                  className="object-cover"
                />
              </div>
              <div>
                <p className="font-medium text-blue-700">{candidate.name}</p>
                <p className="text-xs text-blue-500">{candidate.company}</p>
              </div>
            </div>
            <motion.div
              className="bg-green-500 text-white text-xs px-2 py-1 rounded-full"
              whileHover={{ scale: 1.1 }}
            >
              {candidate.match}%
            </motion.div>
          </motion.div>
        ))}
      </div>

      <div className="mt-4 text-center">
        <motion.button
          className="text-blue-600 text-sm font-medium hover:text-blue-800 transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => router.push("/employers/people/candidate-matches")}
        >
          View All
        </motion.button>
      </div>
    </motion.div>
  );
}
