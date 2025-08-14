"use client";
import SignUpForm from "../sign-up/components/sign-up-form";
import { motion } from "framer-motion";
import Link from "next/link";
import { LogIn } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 to-sky-100 relative">
      <Link href="/" className="absolute top-6 left-4 text-xl font-bold text-blue-600 z-10 flex items-center">
        <motion.div
          className="mr-2 bg-blue-500 text-white p-2 rounded-lg shadow-lg"
          whileHover={{ rotate: [0, -10, 10, -10, 0], scale: 1.1 }}
          transition={{ duration: 0.5 }}
        >
          <LogIn size={20} />
        </motion.div>
      </Link>
      <div className="w-full max-w-4xl mx-auto flex justify-center mt-[70px]">
        <SignUpForm />
      </div>
    </main>
  );
}

