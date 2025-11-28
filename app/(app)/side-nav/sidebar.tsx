"use client";
import Image from "next/image";
import { HiBadgeCheck } from "react-icons/hi";
import { LuBadgeCheck } from "react-icons/lu";
import { PiWarningFill } from "react-icons/pi";
import Tooltip from "@mui/material/Tooltip";
import Badge from "@mui/material/Badge";

import React, { useState, useEffect, JSX } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../../../src/lib/utils";

import Skeleton from "@mui/material/Skeleton";


interface SidebarProps {
  onToggle?: (expanded: boolean) => void;
  menuItems: {
    icon: React.ComponentType<{ className?: string }>;
    text: string;
    href: string;
    isActive?: boolean;
    render?: () => JSX.Element;
    disabled?: boolean;
    style?: React.CSSProperties;
  }[];
  friendRequestCount?: number;
}

export default function Sidebar({ onToggle, menuItems, friendRequestCount }: SidebarProps) {
  const [expanded, setExpanded] = useState(true);
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

    const handleStorage = (e: StorageEvent) => {
      if (e.key === "sidebarUserData") {
        setRefreshKey((k) => k + 1);
      }
    };
    window.addEventListener("storage", handleStorage);

    return () => {
      window.removeEventListener("profilePictureUpdated", handleProfilePicUpdate);
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  function appendOrUpdateTimestamp(url: string | null): string | null {
    if (!url) return url;
    try {
      const u = new URL(url, window.location.origin);
      u.searchParams.set("t", Date.now().toString());
      return u.toString();
    } catch {

      const [base, query = ""] = url.split("?");
      const params = new URLSearchParams(query);
      params.set("t", Date.now().toString());
      return `${base}?${params.toString()}`;
    }
  }

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
        detailsRes = await fetch("/api/employers/get-employer-details", { credentials: "include", cache: "reload" });
        if (detailsRes.ok) {
          setRole("employer");
          const { first_name, last_name, email, job_title, profile_img, verify_status } = await detailsRes.json();
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
                cache: "reload"
              });
              if (signedRes.ok) {
                const { signedUrl } = await signedRes.json();
                imgUrl = appendOrUpdateTimestamp(signedUrl);
                setProfileImg(imgUrl);
                sessionStorage.setItem(
                  "sidebarUserData",
                  JSON.stringify({
                    role: "employer",
                    studentName,
                    email: email || null,
                    jobTitle: job_title || null,
                    profileImg: imgUrl,
                    course: null,
                    verify_status
                  })
                );
              } else {
                setProfileImg(null);
                sessionStorage.removeItem("sidebarUserData");
              }
            } catch {
              setProfileImg(null);
              sessionStorage.removeItem("sidebarUserData");
            }
          } else {
            imgUrl = `https://dbuyxpovejdakzveiprx.supabase.co/storage/v1/object/public/app.images/default.png?t=${Date.now()}`;
            setProfileImg(imgUrl);
            sessionStorage.removeItem("sidebarUserData");
          }

          setLoading(false);
          return;
        }
      } catch {}
      try {
        detailsRes = await fetch("/api/students/get-student-details", { credentials: "include", cache: "reload" });
        if (detailsRes.ok) {
          setRole("student");
          const { first_name, last_name, course, profile_img } = await detailsRes.json();
          const studentName =
            first_name
              ? last_name
                ? `${first_name} ${last_name}`
                : first_name
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
                cache: "reload"
              });
              if (signedRes.ok) {
                const { signedUrl } = await signedRes.json();
                imgUrl = appendOrUpdateTimestamp(signedUrl); 
                setProfileImg(imgUrl);
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
              } else {
                setProfileImg(null);
                sessionStorage.removeItem("sidebarUserData");
              }
            } catch {
              setProfileImg(null);
              sessionStorage.removeItem("sidebarUserData");
            }
          } else {
            imgUrl = `https://dbuyxpovejdakzveiprx.supabase.co/storage/v1/object/public/app.images/default.png?t=${Date.now()}`;
            setProfileImg(imgUrl);
            sessionStorage.removeItem("sidebarUserData");
          }
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
                    <div className="font-medium flex items-center gap-2">
                      {studentName || "Full Name"}
                      {role === "employer" && (() => {
                        let verifyStatus = null
                        if (!loading) {
                          const cached = sessionStorage.getItem("sidebarUserData")
                          if (cached) {
                            const data = JSON.parse(cached)
                            verifyStatus = data.verify_status
                          }
                        }
                        if (!verifyStatus) return null
                        if (verifyStatus === "full") {
                          return (
                            <Tooltip title="Fully Verified" arrow>
                              <motion.span
                                className="ml-1 flex items-center mr-2"
                                whileHover={{ scale: 1.18 }}
                                transition={{ type: "spring", stiffness: 340, damping: 16 }}
                              >
                                  <HiBadgeCheck className="w-4 h-4 text-blue-50" />
                              </motion.span>
                            </Tooltip>
                          )
                        }
                        if (verifyStatus === "standard") {
                          return (
                            <Tooltip title="Partially Verified" arrow>
                              <motion.span
                                className="flex items-center mr-2"
                                whileHover={{ scale: 1.18 }}
                                transition={{ type: "spring", stiffness: 340, damping: 16 }}
                              >
                                  <LuBadgeCheck className="w-4 h-4 text-purple-100"  />
                              </motion.span>
                            </Tooltip>
                          )
                        }
                        return (
                          <Tooltip title="Unverified" arrow>
                            <motion.span
                              className="ml-1 flex items-center mr-2"
                              whileHover={{ scale: 1.18 }}
                              transition={{ type: "spring", stiffness: 340, damping: 16 }}
                            >
                              <PiWarningFill className="w-4 h-4 text-orange-100" />
                            </motion.span>
                          </Tooltip>
                        )
                      })()}
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

        <div className="mt-12 flex-1 overflow-y-auto relative z-10 scrollbar-thin scrollbar-thumb-blue-300 scrollbar-track-transparent px-2">
          <ul className="space-y-4">
            {menuItems.map((item, index) => (
              <li key={index} className="relative overflow-hidden">
                <Link
                  href={item.href}
                  onClick={e => {
                    if (item.disabled) {
                      e.preventDefault();
                    }
                  }}
                  tabIndex={item.disabled ? -1 : 0}
                  aria-disabled={item.disabled}
                  style={item.style}
                >
                  <motion.div
                    onMouseEnter={() => setHoveredItem(index)}
                    onMouseLeave={() => setHoveredItem(null)}
                    className={cn(
                      "flex items-center h-[46px] transition-all relative z-10 rounded-2xl",
                      expanded ? "pl-6 pr-4" : "px-0 justify-center",
                      hoveredItem === index && !item.isActive ? "scale-105" : "",
                      item.isActive ? "bg-white/20 text-white" : "text-white/70",
                      item.disabled ? "pointer-events-none" : ""
                    )}
                  >
                    {item.render ? (
                      item.render()
                    ) : (
                      <motion.div whileHover={{ rotate: [0, -10, 10, -5, 0] }} transition={{ duration: 0.5 }} layout>
                        <item.icon
                          className={cn(
                            "w-6 h-6 min-w-6 transition-transform",
                            hoveredItem === index ? "scale-105" : "",
                            item.isActive ? "text-white" : "text-white/70",
                          )}
                        />
                      </motion.div>
                    )}
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
                        {item.text === "Connections" && !!friendRequestCount && friendRequestCount > 0 && (
                          <span className="ml-4">
                            <Badge
                              badgeContent={friendRequestCount}
                              sx={{
                                "& .MuiBadge-badge": {
                                  background: "rgba(170, 194, 230, 0.7)",
                                  color: "#eef2ffff",
                                  fontWeight: 700,
                                  minWidth: 16,
                                  height: 16,
                                  fontSize: "0.7rem",
                                  marginLeft: "0px",
                                  boxShadow: "0 2px 8px rgba(37,99,235,0.10)",
                                  backdropFilter: "blur(6px)",
                                },
                              }}
                            />
                          </span>
                        )}
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
