"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Eye, EyeOff, Lock, User, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import MuiAlert from "@mui/material/Alert"
import MuiAlertTitle from "@mui/material/AlertTitle"

export default function LoginPage() {
  const router = useRouter()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  // Mock admin credentials
  const validCredentials = [
    { username: "admin", password: "admin123", role: "superadmin" },
    { username: "johndoe", password: "password123", role: "admin" },
  ]

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    // Simulate API call delay
    setTimeout(() => {
      const user = validCredentials.find((cred) => cred.username === username && cred.password === password)

      if (user) {
        // In a real app, you would set authentication tokens/cookies here
        console.log("Login successful:", user)

        // Redirect based on role
        if (user.role === "superadmin") {
          router.push("/superadmin/dashboard")
        } else {
          router.push("/admin/dashboard")
        }
      } else {
        setError("Invalid username or password")
        setIsLoading(false)
      }
    }, 1000)
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left side - Visual section */}
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-blue-600 to-blue-800 text-white p-12 flex-col justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Welcome to the Seekr Admin Portal</h1>
          <p className="text-blue-100 text-lg">Manage your organization efficiently</p>
        </div>

        <div className="space-y-8">
          <div className="bg-white/10 p-6 rounded-lg backdrop-blur-sm">
            <h2 className="text-xl font-semibold mb-2">Streamlined Administration</h2>
            <p className="text-blue-100">Access all your administrative tools in one centralized dashboard.</p>
          </div>

          <div className="flex items-center space-x-4">
            <div className="h-1 w-8 bg-blue-400 rounded"></div>
            <div className="h-1 w-8 bg-white/50 rounded"></div>
            <div className="h-1 w-8 bg-white/50 rounded"></div>
          </div>
        </div>

        <div className="text-sm text-blue-100">© {new Date().getFullYear()} Admin System. All rights reserved.</div>
      </div>

      {/* Right side - Login form */}
      <div className="flex-1 flex items-center justify-center p-6 bg-gray-50">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center md:text-left">
            <h2 className="text-2xl font-bold text-gray-900">Sign in to your account</h2>
            <p className="text-gray-600 mt-1">Enter your credentials to access the admin portal</p>
          </div>

          <Card className="border-0 shadow-md">
            <CardContent className="pt-6">
              {error && (
                <MuiAlert severity="error" className="mb-4">
                  <MuiAlertTitle>Error</MuiAlertTitle>
                  {error}
                </MuiAlert>
              )}
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <Input
                      id="username"
                      placeholder="Enter your username"
                      className="pl-10"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="password">Password</Label>
                    <Link href="#" className="text-sm text-blue-600 hover:text-blue-800">
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      className="pl-10"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-1 top-1/2 transform -translate-y-1/2"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400" />
                      )}
                      <span className="sr-only">{showPassword ? "Hide password" : "Show password"}</span>
                    </Button>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="remember"
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <Label htmlFor="remember" className="text-sm font-normal">
                    Remember me
                  </Label>
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    "Signing in..."
                  ) : (
                    <span className="flex items-center justify-center">
                      Sign In <ArrowRight className="ml-2 h-4 w-4" />
                    </span>
                  )}
                </Button>
              </form>
            </CardContent>
            <CardFooter className="flex justify-center border-t p-4 bg-gray-50 text-center rounded-b-lg">
              <div className="text-sm text-gray-500">
                <p>Use these demo credentials:</p>
                <p className="font-medium">Username: admin | Password: admin123</p>
              </div>
            </CardFooter>
          </Card>

          <div className="mt-6 text-center md:hidden">
            <p className="text-sm text-gray-600">
              Having trouble logging in?{" "}
              <Link href="#" className="font-medium text-blue-600 hover:text-blue-800">
                Contact support
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
