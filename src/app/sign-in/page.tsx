"use client";


import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Checkbox } from "./components/Checkbox"; 
import RemoveDoubleClick from "../components/RemoveDoubleClick";
import SingleLineFooter from "../components/SingleLineFooter";

export default function SignInPage() {
  const [isVisible, setIsVisible] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    RemoveDoubleClick();
  }, []);

  const [showPassword, setShowPassword] = useState(false);

  return (
    
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
   <div className="absolute top-0 left-0 m-4 text-xl font-bold">Test Logo</div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md"
      >
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
          Sign in
        </h2>
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Email or phone number"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"} 
              placeholder="Password"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoComplete="new-password"
            />
            <button 
            type="button"
            className="absolute inset-y-0 right-3 flex items-center text-blue-500 cursor-pointer"
            onClick={() => setShowPassword(!showPassword)}>
                
            {showPassword ? "Hide" : "Show"}
            </button>
          </div>
          <div className="flex items-center space-x-2">
            <input type="checkbox" className="hidden" />
            <Checkbox checked={rememberMe} onChange={() => setRememberMe(!rememberMe)} />
            <label htmlFor="remember" className="text-gray-700">
              Remember me
            </label>
          </div>
          <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition">
            Sign in
          </button>
          <p className="text-xs text-gray-500 text-center">
            By clicking Sign In, you agree to the
            <a href="#" className="text-blue-500"> User Agreement</a>,
            <a href="#" className="text-blue-500"> Privacy Policy</a>, and
            <a href="#" className="text-blue-500"> Cookie Policy</a>.
          </p>
          <div className="flex items-center my-4">
            <div className="flex-1 h-px bg-gray-300"></div>
            <span className="mx-3 text-gray-500">or</span>
            <div className="flex-1 h-px bg-gray-300"></div>
          </div>
          <p className="text-sm text-gray-600">
            For Student Login
          </p>
          <button className="w-full flex items-center justify-center border py-2 rounded-lg hover:bg-gray-200 transition">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg"
              alt="Microsoft logo"
              className="w-5 h-5 mr-2"
            />
            Continue with Microsoft
          </button>
        </div>
        <p className="text-center text-gray-600 mt-4">
          New Employer? <a href="#" className="text-blue-500">Sign Up Today</a>
        </p>
      </motion.div>

      
    <SingleLineFooter/>
  
    </div>
    
  );
}
