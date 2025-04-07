"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronUp } from "lucide-react";

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      setIsVisible(window.scrollY > 50);
    };

    document.addEventListener("scroll", toggleVisibility);

    return () => document.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <AnimatePresence mode="sync">
      {isVisible && (
        <motion.div
          key="scroll-to-top"
          className="fixed bottom-6 right-6 bg-blue-500/90 text-white p-3 md:p-4 rounded-full shadow-lg cursor-pointer flex items-center gap-2 z-[100]"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          onClick={scrollToTop}
        >
          <ChevronUp className="h-5 w-5" />
          <span className="hidden md:inline text-sm">Back to Top</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
