"use client";
import Link from "next/link";
import EmployerSignup from "./components/EmployerSignup";
import { motion } from "framer-motion";

export default function EmployerSignupPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 relative">
      <Link href="/" className="absolute top-0 left-0 m-4 text-xl font-bold">
        Test Logo
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-4xl h-[700px] flex items-center bg-white p-8 rounded-lg shadow-md"
      >
        <EmployerSignup />
      </motion.div>
    </div>
  );
}
