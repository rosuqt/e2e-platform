"use client"

import { useState } from "react"
import { Menu, X } from "lucide-react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)

  const navItems = [
    { label: "People", href: "/landing/people" },
    { label: "Jobs", href: "#" },
    { label: "Companies", href: "#" },
    { label: "STI Hiring", href: "#" },
    { label: "Employer's Sign-up", href: "/sign-up", highlight: true },
  ]

  return (
    <nav className="py-4 px-6 md:px-10">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-bold text-white">
          InternConnect
        </Link>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center space-x-8">
          {navItems.map((item, index) => (
            <Link
              key={index}
              href={item.href}
              className={`transition-all duration-300 ease-in-out transform hover:scale-105 text-white ${
                item.highlight ? "font-bold" : ""
              }`}
            >
              {item.label}
            </Link>
          ))}

          <Link href="/sign-in">
            <motion.button
              className="bg-white text-blue-700 px-5 py-2 rounded-lg font-medium hover:bg-blue-50 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Sign in
            </motion.button>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="lg:hidden text-white"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
        >
          {menuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

        {/* Mobile Menu */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className="absolute top-16 left-0 w-full bg-blue-800 shadow-lg lg:hidden flex flex-col items-center py-6 space-y-6 z-50"
            >
              {navItems.map((item, index) => (
                <Link
                  key={index}
                  href={item.href}
                  className={`transition-all duration-300 ease-in-out transform hover:scale-105 text-white ${
                    item.highlight ? "font-bold" : ""
                  }`}
                  onClick={() => setMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}

              <Link href="/sign-in" onClick={() => setMenuOpen(false)}>
                <button className="bg-white text-blue-700 px-5 py-2 rounded-lg font-medium">Sign in</button>
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  )
}
