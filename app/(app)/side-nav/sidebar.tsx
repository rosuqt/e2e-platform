"use client";
import Image from "next/image";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../../../src/lib/utils";
import { StatusDropdown } from "./status-dropdown";
import { StatusIcon } from "./status-icon";
import Skeleton from "@mui/material/Skeleton";

type Status = "active" | "idle" | "unavailable";

interface SidebarProps {
  onToggle?: (expanded: boolean) => void;
  menuItems: { icon: React.ComponentType<{ className?: string }>; text: string; href: string; isActive?: boolean }[];
}

export default function Sidebar({ onToggle, menuItems }: SidebarProps) {
  const [expanded, setExpanded] = useState(true);
  const [status, setStatus] = useState<Status>("active");
  const [hoveredItem, setHoveredItem] = useState<number | null>(null);
  const [studentName, setStudentName] = useState<string | null>(null);
  const [profileImg, setProfileImg] = useState<string | null>(null);
  const [course, setCourse] = useState<string | null>(null);
  const [jobTitle, setJobTitle] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [role, setRole] = useState<"student" | "employer" | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    if (onToggle) {
      onToggle(expanded);
    }
  }, [expanded, onToggle]);

  const toggleSidebar = () => {
    const newExpandedState = !expanded;
    setExpanded(newExpandedState);
    if (onToggle) {
      onToggle(newExpandedState);
    }
  };

  useEffect(() => {
    const handleProfilePicUpdate = () => {
      sessionStorage.removeItem("sidebarUserData");
      setLoading(true);
      setRole(null);
      setStudentName(null);
      setEmail(null);
      setJobTitle(null);
      setProfileImg(null);
      setCourse(null);
      setRefreshKey((k) => k + 1);
    };
    window.addEventListener("profilePictureUpdated", handleProfilePicUpdate);
    return () => window.removeEventListener("profilePictureUpdated", handleProfilePicUpdate);
  }, []);

  useEffect(() => {
    const cached = sessionStorage.getItem("sidebarUserData");
    if (cached) {
      const data = JSON.parse(cached);
      setRole(data.role);
      setStudentName(data.studentName);
      setEmail(data.email);
      setJobTitle(data.jobTitle);
      setProfileImg(data.profileImg);
      setCourse(data.course);
      setLoading(false);
      return;
    }
    (async () => {
      setLoading(true);
      let detailsRes: Response | null = null;
      try {
        detailsRes = await fetch("/api/employers/get-employer-details", { credentials: "include" });
        if (detailsRes.ok) {
          setRole("employer");
          const { first_name, last_name, email, job_title, profile_img } = await detailsRes.json();
          const studentName =
            first_name && last_name
              ? `${first_name} ${last_name}`
              : first_name || last_name || null;
          setStudentName(studentName);
          setEmail(email || null);
          setJobTitle(job_title || null);
          setCourse(null);

          let imgUrl = null;
          if (profile_img) {
            try {
              const signedRes = await fetch("/api/employers/get-signed-url", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ bucket: "user.avatars", path: profile_img }),
                credentials: "include",
              });
              if (signedRes.ok) {
                const { signedUrl } = await signedRes.json();
                imgUrl = signedUrl;
                setProfileImg(signedUrl);
              } else {
                setProfileImg(null);
              }
            } catch {
              setProfileImg(null);
            }
          } else {
            setProfileImg(null);
          }

          sessionStorage.setItem(
            "sidebarUserData",
            JSON.stringify({
              role: "employer",
              studentName,
              email: email || null,
              jobTitle: job_title || null,
              profileImg: imgUrl,
              course: null,
            })
          );
          setLoading(false);
          return;
        }
      } catch {}
      try {
        detailsRes = await fetch("/api/students/get-student-details", { credentials: "include" });
        if (detailsRes.ok) {
          setRole("student");
          const { first_name, last_name, course, profile_img } = await detailsRes.json();
          const studentName =
            first_name && last_name
              ? `${first_name} ${last_name}`
              : null;
          setStudentName(studentName);
          setCourse(course || null);
          setJobTitle(null);
          setEmail(null);

          let imgUrl = null;
          if (profile_img) {
            try {
              const signedRes = await fetch("/api/students/get-signed-url", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ bucket: "user.avatars", path: profile_img }),
                credentials: "include",
              });
              if (signedRes.ok) {
                const { signedUrl } = await signedRes.json();
                imgUrl = signedUrl;
                setProfileImg(signedUrl);
              } else {
                setProfileImg(null);
              }
            } catch {
              setProfileImg(null);
            }
          } else {
            setProfileImg(null);
          }
          sessionStorage.setItem(
            "sidebarUserData",
            JSON.stringify({
              role: "student",
              studentName,
              email: null,
              jobTitle: null,
              profileImg: imgUrl,
              course: course || null,
            })
          );
          setLoading(false);
          return;
        }
      } catch {}
      setRole(null);
      setStudentName(null);
      setEmail(null);
      setJobTitle(null);
      setProfileImg(null);
      setCourse(null);
      setLoading(false);
      sessionStorage.removeItem("sidebarUserData");
    })();
  }, [refreshKey]);

  return (
    <div className="flex">
      <motion.div
        className="text-white flex flex-col h-screen fixed top-0 left-0 shadow-xl z-[21] overflow-hidden"
        initial={false}
        animate={{
          width: expanded ? 280 : 80,
        }}
        transition={{
          duration: 0.5,
          ease: [0.19, 1, 0.22, 1],
        }}
        style={{
          borderTopRightRadius: 24,
          borderBottomRightRadius: 24,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-sky-500 z-0">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.2)_0%,_transparent_50%)]"></div>
        </div>

        <motion.div
          className="absolute top-6 right-4 z-[30]"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <button
            onClick={toggleSidebar}
            className="text-white focus:outline-none flex items-center justify-center p-2 w-8 h-8"
          >
            <motion.div
              className="relative w-4 h-4"
              initial={false}
              animate={{
                rotate: expanded ? 0 : 0,
              }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            >
              <motion.div
                className="absolute w-4 h-0.5 bg-white rounded-full"
                initial={false}
                animate={{
                  y: expanded ? 0 : -4,
                  rotate: expanded ? -45 : 0,
                }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
              />
              <motion.div
                className="absolute w-4 h-0.5 bg-white rounded-full"
                initial={false}
                animate={{
                  opacity: expanded ? 0 : 1,
                }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
              />
              <motion.div
                className="absolute w-4 h-0.5 bg-white rounded-full"
                initial={false}
                animate={{
                  y: expanded ? 0 : 4,
                  rotate: expanded ? 45 : 0,
                }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
              />
            </motion.div>
          </button>
        </motion.div>

        <div className="h-14 relative z-10"></div>

        <div
          className={cn(
            "flex items-center py-3 h-[72px] mt-2 relative z-10",
            "px-6 justify-center"
          )}
        >
          <Link
            href={role === "employer" ? "/employers/profile" : role === "student" ? "/students/profile" : "#"}
            className="flex items-center"
            tabIndex={loading ? -1 : 0}
            aria-disabled={loading}
            style={{ pointerEvents: loading ? "none" : "auto" }}
          >
            <motion.div className="relative" whileHover={{ scale: 1.05 }} layout>
              <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-xl font-bold shadow-lg overflow-hidden">
                {loading ? (
                  <Skeleton variant="circular" width={48} height={48} />
                ) : profileImg ? (
                  <Image
                    src={profileImg}
                    alt="Profile"
                    width={48}
                    height={48}
                    className="w-12 h-12 object-cover rounded-full"
                    onError={() => {}}
                    style={{ objectFit: "cover" }}
                    priority
                  />
                ) : (
                  (studentName
                    ? studentName
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()
                    : "?")
                )}
              </div>
              <motion.div className="absolute -top-1 -right-1" layout>
                <StatusIcon status={status} size="sm" />
              </motion.div>
            </motion.div>

            <AnimatePresence>
              {expanded && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="ml-3 overflow-hidden"
                >
                  {loading ? (
                    <Skeleton variant="text" width={120} height={24} />
                  ) : (
                    <div className="font-medium">
                      {studentName || "Full Name"}
                    </div>
                  )}
                  <div className="text-xs text-white/70">
                    {loading
                      ? <Skeleton variant="text" width={140} height={18} />
                      : role === "employer"
                        ? (jobTitle || email || "Job Title")
                        : (course || "Course")}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </Link>
        </div>

        <div className={cn("h-[42px] flex items-center relative z-30", expanded ? "px-4" : "px-0 justify-center")}>
          {expanded ? (
            <StatusDropdown status={status} onStatusChange={setStatus} expanded={expanded} />
          ) : (
            <motion.div
              className="w-10 h-10 rounded-full flex items-center justify-center cursor-pointer"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {expanded && <StatusIcon status={status} size="sm" />}
            </motion.div>
          )}
        </div>

        <div className="mt-12 flex-1 overflow-y-auto relative z-10 scrollbar-thin scrollbar-thumb-blue-300 scrollbar-track-transparent px-2">
          <ul className="space-y-4">
            {menuItems.map((item, index) => (
              <li key={index} className="relative overflow-hidden">
                <Link href={item.href}>
                  <motion.div
                    onMouseEnter={() => setHoveredItem(index)}
                    onMouseLeave={() => setHoveredItem(null)}
                    className={cn(
                      "flex items-center h-[46px] transition-all relative z-10 rounded-2xl",
                      expanded ? "pl-6 pr-4" : "px-0 justify-center",
                      hoveredItem === index && !item.isActive ? "scale-105" : "",
                      item.isActive ? "bg-white/20 text-white" : "text-white/70"
                    )}
                  >
                    <motion.div whileHover={{ rotate: [0, -10, 10, -5, 0] }} transition={{ duration: 0.5 }} layout>
                      <item.icon
                        className={cn(
                          "w-6 h-6 min-w-6 transition-transform",
                          hoveredItem === index ? "scale-105" : "",
                          item.isActive ? "text-white" : "text-white/70",
                        )}
                      />
                    </motion.div>
                    {expanded && (
                      <motion.span
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                        className={cn(
                          "ml-3 whitespace-nowrap transition-transform",
                          hoveredItem === index ? "scale-105" : "",
                          item.isActive ? "text-white" : "text-white/70",
                        )}
                      >
                        {item.text}
                      </motion.span>
                    )}
                  </motion.div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </motion.div>
    </div>
  );
}
