import { motion } from "framer-motion";
import Image from "next/image";

export default function CandidateMatches() {
  const candidates = [
    { name: "Mandani Pamigay", company: "BS: Information Technology", match: 79 },
    { name: "Zeyners", company: "BS: Tourism", match: 95 },
    { name: "Ally d para sa lahat", company: "BS: Human Resource", match: 88 },
  ];

  return (
    <motion.div
      className="bg-white rounded-2xl shadow-lg mb-6 p-4 border-2 border-blue-200 relative overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-blue-700">Candidate Matches</h3>
        <motion.button
          className="text-blue-500 hover:text-blue-700 transition-colors"
          whileHover={{ scale: 1.1, rotate: 5 }}
          whileTap={{ scale: 0.95 }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-maximize-2"
          >
            <polyline points="15 3 21 3 21 9" />
            <polyline points="9 21 3 21 3 15" />
            <line x1="21" x2="14" y1="3" y2="10" />
            <line x1="3" x2="10" y1="21" y2="14" />
          </svg>
        </motion.button>
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
        >
          View All
        </motion.button>
      </div>
    </motion.div>
  );
}
