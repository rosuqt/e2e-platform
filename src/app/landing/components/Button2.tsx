"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";

export default function HoverImageButton() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="relative flex items-center justify-center">
      <motion.div
        animate={{
          opacity: isHovered ? 1 : 0,
          scale: isHovered ? 1 : 0.5,
          x: isHovered ? -70 : -50,
        }}
        transition={{ type: "spring", stiffness: 150, damping: 10 }}
        className="absolute left-[-30px] top-[-150px] transform -translate-y-1/2 z-[-10] w-[360px] h-[360px]"
      ></motion.div>
      <Link href="/sign-in">
        <motion.button
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          initial={{ backgroundColor: "#2196F3" }}
          whileHover={{
            scale: 1.2,
            backgroundColor: "#F9A825",
            transition: { type: "spring", stiffness: 200, damping: 10 },
          }}
          whileTap={{ scale: 0.9 }}
          className="px-9 py-5 text-white font-bold text-lg rounded-lg shadow-md"
        >
          Sign-up Now
        </motion.button>
      </Link>
    </div>
  );
}
