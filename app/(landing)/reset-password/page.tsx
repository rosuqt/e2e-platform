"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { TextField, IconButton, InputAdornment } from "@mui/material";
import { Eye, EyeOff } from "lucide-react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export default function ResetPasswordPage() {
  const [isVisible, setIsVisible] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sessionChecked, setSessionChecked] = useState(false);
  const router = useRouter();
  const supabase = createClientComponentClient();
  const searchParams = useSearchParams();
  const code = searchParams?.get("code");

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
    supabase.auth.getSession().then(({ data }) => {
      setSessionChecked(true);
      if (!data.session) {
        setError("Your reset link is invalid, expired, or the session is missing. Please request a new password reset email and use the link directly from your email.");
      }
    });
  }, [supabase.auth]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (!password || !confirmPassword) {
      setError("Please fill in all fields");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (!code) {
      setError("Invalid or missing reset token");
      return;
    }

    const { data } = await supabase.auth.getSession();
    if (!data.session) {

      setError("Auth session missing! Please use the reset link directly from your email.");
      return;
    }
    setLoading(true);

    const { error } = await supabase.auth.updateUser({ password });

    setLoading(false);
    if (error) {
      if (
        error.message?.toLowerCase().includes("expired") ||
        error.message?.toLowerCase().includes("invalid") ||
        error.message?.toLowerCase().includes("access denied")
      ) {
        setError("Your reset link is invalid or has expired. Please request a new password reset email.");
      } else {
        setError(error.message || "Something went wrong");
      }
      return;
    }
    setSuccess(true);
    setTimeout(() => {
      router.push("/sign-in");
    }, 2500);
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
          <span className="bg-gradient-to-r from-blue-500 to-sky-400 text-transparent bg-clip-text">Reset Password</span>
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

        {!error && !sessionChecked && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3 mb-4 bg-yellow-100 text-yellow-700 rounded-xl text-sm text-center"
          >
            Checking reset link...
          </motion.div>
        )}

        {success ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 mb-4 bg-green-100 text-green-600 rounded-xl text-center"
          >
            Password reset successful! Redirecting to sign in...
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
              label="New Password"
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
            <TextField
              label="Confirm New Password"
              variant="outlined"
              fullWidth
              type={showConfirm ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowConfirm(!showConfirm)} edge="end">
                      {showConfirm ? <EyeOff color="gray" /> : <Eye color="gray" />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              InputLabelProps={{ shrink: true }}
            />
            <motion.button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-500 to-sky-500 text-white py-4 rounded-2xl font-medium shadow-lg hover:shadow-blue-200/50 transition-all duration-200 flex items-center justify-center"
              whileHover={{ scale: 1.03, boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.5)" }}
              whileTap={{ scale: 0.97 }}
              disabled={loading}
            >
              <span>{loading ? "Resetting..." : "Reset Password"}</span>
            </motion.button>
          </motion.form>
        )}
      </motion.div>
      <div className="absolute bottom-4 text-center text-gray-600 text-sm">
        © {new Date().getFullYear()} Seekr. All rights reserved.
      </div>
    </div>
  );
}
