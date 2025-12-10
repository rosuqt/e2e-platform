"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { TextField, IconButton, InputAdornment, Tooltip } from "@mui/material";
import { Eye, EyeOff } from "lucide-react";
import { motion } from "framer-motion";

export default function PasswordResetPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams?.get("token") || "";
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  const passwordRequirements = [
    "Minimum 8 characters",
    "At least one uppercase letter",
    "At least one special character",
  ];

  function validatePassword(pw: string) {
    const minLength = pw.length >= 8;
    const hasUpper = /[A-Z]/.test(pw);
    const hasSpecial = /[^A-Za-z0-9]/.test(pw);
    return minLength && hasUpper && hasSpecial;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!password || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }
    if (!validatePassword(password)) {
      setError("Password does not meet requirements.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    const res = await fetch("/api/sign-in/passwordHandler", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, newPassword: password }),
    });
    setLoading(false);
    if (res.ok) {
      setSuccess(true);
      setTimeout(() => router.push("/sign-in?success=reset"), 2000);
    } else {
      setError("Failed to reset password. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-sky-100">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-md border-2 border-blue-200"
      >
        <h2 className="text-2xl font-bold text-blue-700 mb-6 text-center">
          Reset Password
        </h2>
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-500 rounded-xl text-sm text-center">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-xl text-sm text-center">
            Password reset successful! Redirecting...
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <Tooltip
            title={
              <div>
                {passwordRequirements.map((req, i) => (
                  <div key={i}>{req}</div>
                ))}
              </div>
            }
            open={showTooltip}
            placement="right"
            arrow
          >
            <TextField
              label="New Password"
              variant="outlined"
              fullWidth
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={() => setShowTooltip(true)}
              onBlur={() => setShowTooltip(false)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <EyeOff color="gray" /> : <Eye color="gray" />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              InputLabelProps={{ shrink: true }}
            />
          </Tooltip>
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
                  <IconButton
                    onClick={() => setShowConfirm(!showConfirm)}
                    edge="end"
                  >
                    {showConfirm ? <EyeOff color="gray" /> : <Eye color="gray" />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            InputLabelProps={{ shrink: true }}
          />
          <motion.button
            className="w-full bg-gradient-to-r from-blue-500 to-sky-500 text-white py-3 rounded-2xl font-medium shadow-lg hover:shadow-blue-200/50 transition-all duration-200"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            disabled={loading || success}
          >
            {loading ? "Resetting..." : "Reset Password"}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}
