"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import { Eye, EyeOff } from "lucide-react";
import { TextField, IconButton, InputAdornment, Checkbox, FormControlLabel } from "@mui/material";
import Image from "next/image";
import { signIn } from "next-auth/react";

export default function SignInPage() {
  const [isVisible, setIsVisible] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

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

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("/api/sign-in", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (!response.ok) {
        setError(data.error || "Sign-in failed");
        return;
      }

      localStorage.setItem("token", data.token);

      const decoded: { id: string } = jwtDecode(data.token);
      console.log("Decoded Employer ID after sign-in:", decoded.id);

      router.push("/student/student-dashboard");
    } catch (err) {
      console.error("Sign-in error:", err);
      setError("An unexpected error occurred");
    }
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
          <span className="bg-gradient-to-r from-blue-500 to-sky-400 text-transparent bg-clip-text">Sign in</span>
        </motion.h2>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3 mb-4 bg-red-100 text-red-500 rounded-xl text-sm text-center"
          >
            {error}
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
            onChange={(e) => setEmail(e.target.value)}
            InputLabelProps={{ shrink: true }}
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
                    {showPassword ? <EyeOff /> : <Eye />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            InputLabelProps={{ shrink: true }}
          />

          <div className="flex items-center justify-between">
            <FormControlLabel
              control={
                <Checkbox
                  checked={rememberMe}
                  onChange={() => setRememberMe(!rememberMe)}
                  color="primary"
                />
              }
              label={<span className="text-gray-700">Remember me</span>}
            />
            <Link href="/forgot-password" className="text-blue-500 hover:underline text-sm">
              Forgot password?
            </Link>
          </div>

          <motion.button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-500 to-sky-500 text-white py-4 rounded-2xl font-medium shadow-lg hover:shadow-blue-200/50 transition-all duration-200 flex items-center justify-center"
            whileHover={{ scale: 1.03, boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.5)" }}
            whileTap={{ scale: 0.97 }}
          >
            <span>Sign in</span>
          </motion.button>
        </motion.form>

        <motion.p
          className="text-xs text-gray-700 text-center mt-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          By clicking Sign In, you agree to the
          <a href="#" className="text-blue-500 hover:text-blue-700 transition-colors">
            {" "}
            User Agreement
          </a>
          ,
          <a href="#" className="text-blue-500 hover:text-blue-700 transition-colors">
            {" "}
            Privacy Policy
          </a>
          , and
          <a href="#" className="text-blue-500 hover:text-blue-700 transition-colors">
            {" "}
            Cookie Policy
          </a>
          .
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
          For Student Login
        </motion.p>

        <motion.button
          className="w-full flex items-center justify-center border-2 border-blue-200 py-3 rounded-2xl hover:bg-blue-50 transition-all duration-200 mt-2 text-gray-700"
          whileHover={{ scale: 1.02, boxShadow: "0 5px 15px -5px rgba(59, 130, 246, 0.3)" }}
          whileTap={{ scale: 0.98 }}
          type="button"
          onClick={() => signIn("azure-ad")}
        >
          <Image
            src="https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg"
            alt="Microsoft logo"
            width={20}
            height={20}
            className="w-5 h-5 mr-2"
          />
          Continue with Microsoft
        </motion.button>

        <motion.p
          className="text-center text-gray-700 mt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          New Employer?{" "}
          <Link href="/sign-up" className="text-blue-500 font-medium hover:text-blue-700 transition-colors">
            Sign Up Today
          </Link>
        </motion.p>
      </motion.div>
      <div className="absolute bottom-4 text-center text-gray-600 text-sm">
        © {new Date().getFullYear()} Test Company. All rights reserved.
      </div>
    </div>
  );
}
