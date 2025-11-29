"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { TextField } from "@mui/material";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [isVisible, setIsVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [canResend, setCanResend] = useState(false);
  const [timer, setTimer] = useState(30);

  useEffect(() => {
    setIsVisible(true);
    const handleDoubleClick = (e: MouseEvent) => {
      e.preventDefault();
    };
    document.addEventListener("dblclick", handleDoubleClick);
    return () => {
      document.removeEventListener("dblclick", handleDoubleClick);
    };
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (submitted && !canResend) {
      setTimer(30);
      interval = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [submitted, canResend]);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError("");
    setSubmitted(false);
    setCanResend(false);

    if (!email) {
      setError("Please enter your email address");
      return;
    }

    const res = await fetch("/api/sign-in/passwordHandler", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const data = await res.json();

    if (!res.ok) {
      setError(data.error || "Something went wrong");
      return;
    }

    setSubmitted(true);
  };

  return (
    <div className="pt-20 flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 to-sky-100 relative overflow-y-auto pb-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-md relative overflow-hidden border-2 border-blue-200 z-10"
      >
        <motion.h2
          className="text-3xl font-bold text-gray-700 mb-6 text-center relative z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <span className="bg-gradient-to-r from-blue-500 to-sky-400 text-transparent bg-clip-text">
            Forgot Password
          </span>
        </motion.h2>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3 mb-4 bg-red-100 text-red-500 rounded-xl text-sm text-center"
          >
            {error}
            {error === "No account found with this email address" && (
              <div className="mt-2">
                <span className="text-gray-700">Don&apos;t have an account yet? </span>
                <Link
                  href="/sign-up"
                  className="text-blue-500 font-medium hover:underline transition-colors cursor-pointer"
                >
                  Sign up now.
                </Link>
              </div>
            )}
          </motion.div>
        )}

        {submitted ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 mb-4 bg-green-100 text-green-600 rounded-xl text-center"
          >
            <span className="font-semibold">{email}</span>, you will receive a password reset email shortly.
            <div className="mt-4">
              {!canResend ? (
                <button
                  disabled
                  className="px-4 py-2 rounded-xl bg-blue-200 text-blue-500 font-medium cursor-not-allowed"
                >
                  Resend in {timer}s
                </button>
              ) : (
                <button
                  onClick={() => handleSubmit()}
                  className="px-4 py-2 rounded-xl bg-blue-500 text-white font-medium hover:bg-blue-600 transition-colors"
                >
                  Resend
                </button>
              )}
            </div>
          </motion.div>
        ) : (
          <motion.form
            onSubmit={handleSubmit}
            className="space-y-4 relative z-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <TextField
              label="Email address"
              variant="outlined"
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              InputLabelProps={{ shrink: true }}
            />

            <motion.button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-500 to-sky-500 text-white py-4 rounded-2xl font-medium shadow-lg hover:shadow-blue-200/50 transition-all duration-200 flex items-center justify-center"
              whileHover={{
                scale: 1.03,
                boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.5)",
              }}
              whileTap={{ scale: 0.97 }}
            >
              <span>Send Reset Link</span>
            </motion.button>
          </motion.form>
        )}

        <motion.p
          className="text-xs text-gray-700 text-center mt-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          Remembered your password?{" "}
          <Link
            href="/sign-in"
            className="text-blue-500 hover:text-blue-700 transition-colors"
          >
            Sign In
          </Link>
        </motion.p>

        <div className="flex items-center my-4">
          <div className="flex-1 h-px bg-blue-200"></div>
          <span className="mx-3 text-gray-700">or</span>
          <div className="flex-1 h-px bg-blue-200"></div>
        </div>

        <motion.p
          className="text-sm text-gray-700 font-medium"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          Need help? Contact{" "}
          <a
            href="mailto:seekr.assist@gmail.com"
            className="text-blue-500 hover:text-blue-700 transition-colors"
          >
            support@testcompany.com
          </a>
        </motion.p>

        <motion.div
          className="flex justify-center mt-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        ></motion.div>
      </motion.div>
      <div className="absolute bottom-4 text-center text-gray-600 text-sm">
        © {new Date().getFullYear()} Seekr. All rights reserved.
      </div>
    </div>
  );
}
