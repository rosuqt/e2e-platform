import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function JobMatches() {
  const router = useRouter();

  return (
    <motion.div
      className="bg-white rounded-2xl shadow-lg mb-[30px] p-4 border-2 border-blue-200 relative overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-semibold text-blue-700">Job Matches</h3>
        <motion.button
          className="text-blue-500 hover:text-blue-700 transition-colors"
          whileHover={{ scale: 1.1, rotate: 5 }}
          whileTap={{ scale: 0.95 }}
        >
          
        </motion.button>
      </div>

      <div className="space-y-2">
        {[
          { company: "ABC", name: "Software Engineer", location: "Fb Mark-it Place", match: 96 },
          {
            company: ">",
            name: "Software Engineer",
            location: "Fb Mark-it Place",
            match: 98,
            bgColor: "bg-purple-100",
            textColor: "text-purple-600",
          },
          {
            company: "O",
            name: "Software Engineer",
            location: "Fb Mark-it Place",
            match: 92,
            bgColor: "bg-blue-100",
            textColor: "text-blue-600",
          },
        ].map((job, index) => (
          <motion.div
            key={index}
            className="flex items-center justify-between p-2 hover:bg-blue-50 rounded-xl cursor-pointer transition-colors"
            whileHover={{
              scale: 1.02,
              backgroundColor: "rgba(219, 234, 254, 0.8)",
            }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.1 * index }}
          >
            <div className="flex items-center gap-2">
              <div
                className={`w-7 h-7 ${job.bgColor || "bg-red-100"} rounded-lg flex items-center justify-center ${job.textColor || "text-red-600"} font-bold text-xs`}
              >
                {job.company}
              </div>
              <div>
                <p className="font-medium text-blue-700 text-sm">{job.name}</p>
                <p className="text-xs text-blue-500">{job.location}</p>
              </div>
            </div>
            <motion.div
              className="bg-green-500 text-white text-xs px-2 py-0.5 rounded-full"
              whileHover={{ scale: 1.1 }}
            >
              {job.match}%
            </motion.div>
          </motion.div>
        ))}
      </div>

      <div className="mt-2 text-center">
        <motion.button
          className="text-blue-600 text-sm font-medium hover:text-blue-800 transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => router.push("/students/jobs/job-matches")}
        >
          View All
        </motion.button>
      </div>
    </motion.div>
  )
}
