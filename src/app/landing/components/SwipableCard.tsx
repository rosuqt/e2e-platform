import { useState } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";

const questions = [
  "Tell me about yourself.",
  "What are your strengths and weaknesses?",
  "Where do you see yourself in five years?",
  "Why should we hire you?",
];

export default function InterviewPrep() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [exitX, setExitX] = useState(0);

  const x = useMotionValue(0);
  const scale = useTransform(x, [-150, 0, 150], [0.8, 1, 0.8]);
  const rotate = useTransform(x, [-150, 0, 150], [-10, 0, 10], { clamp: false });

  const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: { offset: { x: number } }) => {
    if (info.offset.x < -100) {
      setExitX(-200);
      setCurrentQuestion((prev) => (prev + 1) % questions.length);
    } else if (info.offset.x > 100) {
      setExitX(200);
      setCurrentQuestion((prev) => (prev + 1) % questions.length);
    }
  };

  return (
    <div className="relative w-[400px] h-[250px] flex items-center justify-center overflow-visible">
      <AnimatePresence mode="wait">

        {/* Shadow */}
        <motion.div
          key={`shadow-${currentQuestion}`}
          initial={{ y: 15, opacity: 0.5 }}
          animate={{ y: -5, opacity: 1 }}
          exit={{ y: -10, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="absolute w-[90%] h-[110%] bg-gray-400 rounded-3xl mt-32"
        />

        {/* Card */}
        <motion.div
          key={currentQuestion}
          style={{ x, rotate, scale }}
          initial={{ x: 0, opacity: 1 }}
          animate={{ x: [0, -10, 10, 0], transition: { repeat: 90, duration: 2, ease: "easeInOut" } }} 
          exit={{ x: exitX, opacity: 0, scale: 0.8, transition: { duration: 0.3 } }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.5}
          onDragEnd={handleDragEnd}
          className="absolute w-[100%] h-[120%] bg-white text-black flex items-center justify-center text-xl rounded-3xl p-6 shadow-lg cursor-grab active:cursor-grabbing"
        >
          {questions[currentQuestion]}
        </motion.div>

      </AnimatePresence>
    </div>
  );
}
