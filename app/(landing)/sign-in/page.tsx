"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, Sparkles } from "lucide-react";
import { TextField, IconButton, InputAdornment } from "@mui/material";
import Image from "next/image";
import { signIn, useSession } from "next-auth/react";
import LegalModal from "../../../components/legal";
import { IoEnterOutline } from "react-icons/io5";

export default function SignInPage() {
  const [isVisible, setIsVisible] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [adminMode] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showSuccess, setShowSuccess] = useState(false);
  const [adminRedirecting, setAdminRedirecting] = useState(false);
  const { data: session, status } = useSession();

  const handleMicrosoftLogin = async () => {
    await signIn(adminMode ? "azure-ad-admin" : "azure-ad", {
      callbackUrl: adminMode ? "/admin/dashboard" : "/students/after-login"
    });
  };

  useEffect(() => {
    if (status === "loading") return;
    if (session?.user?.role === "employer") {
      router.replace("/employers/dashboard");
      return;
    }
    if (session?.user?.role === "student") {
      router.replace("/students/after-login");
      return;
    }
    if (session?.user?.role === "admin" || session?.user?.role === "superadmin") {
      router.replace("/admin/dashboard");
      return;
    }

    setIsVisible(true);

    if (searchParams?.get("error")) {
      if (searchParams.get("error") === "invalid_domain") {
        setError("Sorry! We're only accepting sign-ins from STI College students. Please use your STI email.");
      } else if (searchParams.get("error") === "admin_not_registered") {
        setError("Access denied. This faculty/teacher account is not registered in the system. Please contact the administrator.");
      } else if (searchParams.get("error") === "admin_check_failed") {
        setError("An error occurred while verifying your account. Please try again later.");
      } else {
        setError("Invalid email or password");
      }
    }

    if (searchParams?.get("success") === "verified") {
      setShowSuccess(true);
      const employerId = searchParams.get("employerId")
      if (employerId) {
        fetch("/api/employers/update-verify-status", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ employerId }),
        })
      }
    } else {
      setShowSuccess(false);
    }

    const handleDoubleClick = (e: MouseEvent) => {
      e.preventDefault();
    };
    document.addEventListener("dblclick", handleDoubleClick);
    return () => {
      document.removeEventListener("dblclick", handleDoubleClick);
    };
  }, [searchParams, session, status]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
      callbackUrl: "/employers/dashboard",
    });

    setLoading(false);

    if (res?.error) {
      setError("Invalid email or password");
      return;
    }

    if (res?.ok && res.url) {
      router.push(res.url);
    }
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  return (
    <div className="pt-20 mt-2 flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 to-sky-100 relative overflow-y-hidden pb-10">
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
          <span className="bg-gradient-to-r from-blue-500 to-sky-400 text-transparent bg-clip-text">Sign in</span>
        </motion.h2>

        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center p-3 mb-4 bg-green-100 text-green-700 rounded-xl text-sm text-left"
          >
            <span className="mr-2">
              <Sparkles className="h-6 w-6 text-green-500" />
            </span>
            <span>You&apos;re all set! Your email has been successfully registered. Please log in again to continue.</span>
          </motion.div>
        )}

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 mb-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-lg text-sm"
            role="alert"
          >
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-500 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3 flex-1">
                <p className="font-medium">{error}</p>
              </div>
            </div>
          </motion.div>
        )}

        <motion.form
          onSubmit={handleSignIn}
          className="space-y-4 relative z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <TextField
            label="Email or phone number"
            variant="outlined"
            fullWidth
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (error) setError("");
            }}
            InputLabelProps={{ shrink: true }}
            error={!!error}
          />

          <TextField
            label="Password"
            variant="outlined"
            fullWidth
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                    {showPassword ? <EyeOff color="gray" /> : <Eye color="gray" />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            InputLabelProps={{ shrink: true }}
          />

          <div className="flex items-center justify-between">
            <Link
              href="/sign-in/forgot-password"
              className="text-blue-500 text-sm font-medium hover:underline transition-colors"
            >
              Forgot password?
            </Link>
          </div>

          <motion.button
            className="w-full bg-gradient-to-r from-blue-500 to-sky-500 text-white py-4 rounded-2xl font-medium shadow-lg hover:shadow-blue-200/50 transition-all duration-200 flex items-center justify-center"
            whileHover={{ scale: 1.03, boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.5)" }}
            whileTap={{ scale: 0.97 }}
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <span className="w-5 h-5 border-2 border-white border-t-blue-400 rounded-full animate-spin mr-2"></span>
                Signing in...
              </span>
            ) : (
              "Sign in as Employer"
            )}
          </motion.button>
        </motion.form>

        <motion.p
          className="text-center text-gray-700 mt-2 text-base"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          New Employer?{" "}
          <Link href="/sign-up" className="text-blue-500 font-medium hover:text-blue-700 transition-colors">
            Sign Up Today
          </Link>
        </motion.p>

        <div className="flex items-center justify-end mb-2">
        </div>

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
          {adminMode ? "For Admin Login" : "For Student Login"}
        </motion.p>

        <motion.button
          className="w-full flex items-center justify-center border-2 border-blue-200 py-3 rounded-2xl hover:bg-blue-50 transition-all duration-200 mt-2 text-gray-700"
          whileHover={{ scale: 1.02, boxShadow: "0 5px 15px -5px rgba(59, 130, 246, 0.3)" }}
          whileTap={{ scale: 0.98 }}
          type="button"
          onClick={handleMicrosoftLogin}
        >
          <Image
            src="https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg"
            alt="Microsoft logo"
            width={20}
            height={20}
            className="w-5 h-5 mr-2"
          />
          {adminMode ? "Continue as Admin" : "Continue with Microsoft"}
        </motion.button>

        <motion.p
          className="text-xs text-gray-700 text-center mt-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          By clicking Sign In, you agree to the
          <button
            type="button"
            className="text-blue-500 hover:text-blue-700 transition-colors  ml-1"
            onClick={handleOpenModal}
          >
            User Agreement
          </button>
          ,
          <button
            type="button"
            className="text-blue-500 hover:text-blue-700 transition-colors  ml-1"
            onClick={handleOpenModal}
          >
            Privacy Policy
          </button>
          , and
          <button
            type="button"
            className="text-blue-500 hover:text-blue-700 transition-colors  ml-1"
            onClick={handleOpenModal}
          >
            Cookie Policy
          </button>
          .
        </motion.p>

        <button
          type="button"
          className="absolute bottom-2 right-4 flex items-center px-2 py-1 rounded cursor-pointer bg-transparent border-none text-sm font-medium text-blue-500 hover:text-purple-600 transition-colors"
          onClick={() => {
            setAdminRedirecting(true);
            router.push("/admin/login");
          }}
          style={{ outline: "none", display: adminRedirecting ? "none" : "flex" }}
          disabled={adminRedirecting}
        >
          <span className="mr-1">Admin Login</span>
          <IoEnterOutline size={20} />
        </button>
        {adminRedirecting && (
          <div className="absolute bottom-2 right-4 flex items-center px-2 py-1">
            <span className="mr-2 text-purple-600 text-sm">Redirecting</span>
            <span className="w-5 h-5 border-2 border-purple-400 border-t-transparent rounded-full animate-spin"></span>
          </div>
        )}
      </motion.div>
      <div className="absolute bottom-4 text-center text-gray-600 text-sm w-full">
        © {new Date().getFullYear()} Seekr. All rights reserved.
      </div>
      <LegalModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
      />
    </div>
  );
}
