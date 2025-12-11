"use client"

import { useState, useEffect } from "react"
import { Menu, X } from "lucide-react"
import Link from "next/link"
import { motion, AnimatePresence, useAnimation, useScroll } from "framer-motion"
import Image from "next/image"
import { RiRobot2Fill } from "react-icons/ri"
import supabase from "@/lib/supabase"

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [showFeedback, setShowFeedback] = useState<boolean>(false)
  const controls = useAnimation()
  const { scrollY } = useScroll()

  useEffect(() => {
    const unsubscribe = scrollY.onChange((latest) => {
      if (latest > 100) {
        controls.start("compact")
      } else {
        controls.start("expanded")
      }
    })
    return () => unsubscribe()
  }, [scrollY, controls])

  useEffect(() => {
    const fetchSetting = async () => {
      const { data } = await supabase
        .from("site_settings")
        .select("show_feedback_button")
        .limit(1)
        .single()
      if (data) setShowFeedback(data.show_feedback_button)
    }
    fetchSetting()
  }, [])

  const navVariants = {
    expanded: {
      width: "100%",
      background: "linear-gradient(to right, #1d4ed8, #3730a3)",
      height: "80px",
      top: "0",
      left: "0",
      borderRadius: "0",
      boxShadow: "none",
      transition: { stiffness: 120, damping: 20 },
    },
    compact: {
      width: "80%",
      backgroundColor: "rgba(30, 58, 138, 0.7)", 
      backdropFilter: "blur(15px)",
      height: "64px",
      top: "8px",
      left: "10%",
      borderRadius: "12px",
      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
      transition: { stiffness: 120, damping: 20 },
    },
  }

  const navItems = [
    { label: "Home", href: "/", prefetch: true },
    { label: "People", href: "/people" },
    { label: "Jobs", href: "/jobs" },
    { label: "STI Hiring", href: "/sti-hiring" },
    { label: "Employer's Sign-up", href: "/sign-up", highlight: true },
  ]

  return (
    <motion.nav
      className="fixed z-50"
      variants={navVariants}
      initial="expanded"
      animate={controls}
    >
      <div className="flex justify-between items-center px-6 md:px-10 h-full">
        <div className="flex items-center space-x-2">
          <Link href="/landing" className="text-xl font-bold text-white">
            <Image src="/images/logo.white.png" alt="Seekr Logo" width={100} height={100} />
          </Link>

          {/* Feedback button */}
          {showFeedback && (
            <Link href="/feedback">
              <motion.button
                type="button"
                className="ml-2 px-6 py-2 rounded-full border border-purple-500 bg-black/70 backdrop-blur-sm relative font-bold text-base shadow-lg overflow-hidden"
                style={{
                  backgroundImage: `
                    linear-gradient(90deg, rgba(0,0,0,0.7), rgba(30,41,59,0.7)),
                    url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='20' height='20' fill='black'/%3E%3Ccircle cx='5' cy='5' r='0.5' fill='white' fill-opacity='0.04'/%3E%3Ccircle cx='15' cy='10' r='0.5' fill='white' fill-opacity='0.04'/%3E%3Ccircle cx='10' cy='15' r='0.5' fill='white' fill-opacity='0.04'/%3E%3C/svg%3E")
                  `,
                }}
                whileHover={{
                  scale: 1.08,
                  transition: { duration: 0.2 }
                }}
                initial={false}
              >
                <span
                  className="bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 bg-clip-text text-transparent relative z-10 flex items-center gap-2"
                  style={{
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  Feedback
                  <RiRobot2Fill className="text-purple-500 w-5 h-5" />
                </span>
                {/* Shine animation */}
                <motion.span
                  className="absolute left-0 top-0 h-full w-full pointer-events-none"
                  initial={{ x: "-100%" }}
                  animate={{ x: "100%" }}
                  transition={{
                    repeat: Infinity,
                    duration: 4,
                    ease: "linear"
                  }}
                  style={{
                    background: "linear-gradient(120deg, transparent 0%, rgba(255,255,255,0.3) 50%, transparent 100%)",
                    filter: "blur(1px)",
                    width: "120%",
                  }}
                />
              </motion.button>
            </Link>
          )}
        </div>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center space-x-8">
          {navItems.map((item, index) => (
            <Link
              key={index}
              href={item.href}
              prefetch={item.prefetch || false}
              className={`transition-all duration-300 ease-in-out transform hover:scale-105 text-white ${
                item.highlight ? "font-bold" : ""
              }`}
            >
              {item.label}
            </Link>
          ))}

          <Link href="/sign-in" prefetch={true}>
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
              transition={{ type: "spring", stiffness: 120, damping: 20 }} 
              className="absolute top-16 left-0 w-full bg-blue-800 shadow-lg lg:hidden flex flex-col items-center py-6 space-y-6 z-50"
            >
              {navItems.map((item, index) => (
                <Link
                  key={index}
                  href={item.href}
                  prefetch={item.href === "/sign-up"}
                  className={`transition-all duration-300 ease-in-out transform hover:scale-105 text-white ${
                    item.highlight ? "font-bold" : ""
                  }`}
                  onClick={() => setMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}

              <Link href="/sign-in" prefetch={true} onClick={() => setMenuOpen(false)}>
                <button className="bg-white text-blue-700 px-5 py-2 rounded-lg font-medium">Sign in</button>
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  )
}
