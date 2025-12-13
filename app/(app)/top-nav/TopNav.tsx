/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { usePathname, useRouter } from 'next/navigation';
import { Home, Users, Briefcase, MessageCircle, Bell, User } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { ProfileModal } from '../students/profile/components/profile-modal';
import { NotificationsModal } from '../students/notifications/components/notifications-modal';
import { RiRobot2Fill } from "react-icons/ri";
import { motion, AnimatePresence } from "framer-motion";
import Link from 'next/link';
import supabase from "@/lib/supabase";
import { TbCards, TbFileStar, TbUsers, TbUserStar, TbUserCheck, TbUserHeart } from "react-icons/tb";
import { HiOutlineClipboardDocumentList } from "react-icons/hi2";
import { FaEarthAmericas } from "react-icons/fa6";
import { BsBuildingCheck } from "react-icons/bs";
import { MdAddCircleOutline } from "react-icons/md";
import { TbMailStar } from "react-icons/tb";
import { Lock } from "@mui/icons-material";
import { Tooltip } from "@mui/material";
import { IconType } from "react-icons";
import { useSession } from "next-auth/react";

interface TopNavProps {
  className?: string;
  iconColor?: string;
  labelColor?: string;
  isSidebarMinimized?: boolean;
  topNavStyle?: React.CSSProperties;
}

type DropdownMenuItem = {
  icon: IconType;
  text: string;
  href: string;
  style?: React.CSSProperties;
  disabled?: boolean;
  render?: (() => React.ReactNode);
};

const TopNav: React.FC<TopNavProps> = ({
  className,
  iconColor = 'gray',
  labelColor = 'gray',
  isSidebarMinimized,
  topNavStyle,
}) => {
  const pathname = usePathname() ?? "";
  const router = useRouter();
  const { data: session, status } = useSession();
  const [isProfileModalOpen, setProfileModalOpen] = useState(false);
  const [isNotificationsModalOpen, setNotificationsModalOpen] = useState(false);
  const [showFeedback, setShowFeedback] = useState<boolean>(false);
  const [openPeople, setOpenPeople] = useState(false);
  const [openJobs, setOpenJobs] = useState(false);
  const messagesRef = useRef<HTMLAnchorElement | null>(null); 

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

  const verifyStatus = session?.user?.verifyStatus;

  const studentPeopleMenu: DropdownMenuItem[] = [
    { icon: TbUserStar, text: "Suggestions", href: "/students/people/suggestions" },
    { icon: TbUserHeart, text: "Connections", href: "/students/people/connections" },
    { icon: TbUserCheck, text: "Following", href: "/students/people/following" },
    { icon: BsBuildingCheck, text: "Companies", href: "/students/people/companies" },
  ];

  const studentJobsMenu: DropdownMenuItem[] = [
    { icon: TbCards, text: "Job Listings", href: "/students/jobs/job-listings" },
    { icon: HiOutlineClipboardDocumentList, text: "My Applications", href: "/students/jobs/applications" },
    { icon: TbFileStar, text: "Job Matches", href: "/students/jobs/job-matches" },
    { icon: TbUsers, text: "Interview Practice", href: "/students/jobs/interview-practice" },
    { icon: FaEarthAmericas, text: "Community Jobs", href: "/students/community-page" },
  ];

  const employerJobsMenu: DropdownMenuItem[] = [
    { icon: MdAddCircleOutline, text: "Post a Job", href: "/employers/jobs/post-a-job" },
    { icon: TbCards, text: "Job Listings", href: "/employers/jobs/job-listings" },
    { icon: HiOutlineClipboardDocumentList, text: "Applications", href: "/employers/jobs/applications" },
    {
      icon: TbMailStar,
      text: "Invited Candidates",
      href: verifyStatus !== "full" ? "#" : "/employers/jobs/invited-candidates",
      render: verifyStatus !== "full"
        ? () => (
            <Tooltip title="Verify to access Invited Candidates" arrow>
              <span style={{ display: "flex", alignItems: "center", cursor: "not-allowed", opacity: 0.7 }}>
                <span style={{ flex: 1 }} />
                <Lock fontSize="small" style={{ marginLeft: "auto" }} />
              </span>
            </Tooltip>
          )
        : undefined,
      disabled: verifyStatus !== "full",
      style: verifyStatus !== "full" ? { cursor: "not-allowed", opacity: 0.7 } : {},
    },
    {
      icon: TbUserStar,
      text: "Candidate Matches",
      href: verifyStatus !== "full" ? "#" : "/employers/jobs/candidate-matches",
      render: verifyStatus !== "full"
        ? () => (
            <Tooltip title="Verify to access Candidate Matches" arrow>
              <span style={{ display: "flex", alignItems: "center", cursor: "not-allowed", opacity: 0.7 }}>
                <span style={{ flex: 1 }} />
                <Lock fontSize="small" style={{ marginLeft: "auto" }} />
              </span>
            </Tooltip>
          )
        : undefined,
      disabled: verifyStatus !== "full",
      style: verifyStatus !== "full" ? { cursor: "not-allowed", opacity: 0.7 } : {},
    },
  ];

  // Remove useMemo for navItems and just define it inline for students
  const handleProfileClick = () => setProfileModalOpen((prev) => !prev);
  const handleNotificationsClick = () => setNotificationsModalOpen((prev) => !prev);
  // Remove modal open for messages, instead navigate directly
  const handleMessagesClick = () => {
    if (session?.user?.role === "employer") {
      router.push("/employers/messages");
    } else {
      router.push("/students/messages");
    }
  };

  // Always check role in session.user
  const getRole = () => session?.user?.role;
  console.log("TOPNAV session:", session);
  console.log("TOPNAV session.user.role:", getRole());

  // Use getRole() everywhere for clarity and reliability
  const navItems =
    getRole() === "employer"
      ? [
          { path: '/employers/dashboard', label: 'Home', icon: Home },
          { path: '/employers/jobs/job-listings', label: 'Jobs', icon: Briefcase, dropdown: employerJobsMenu },
          { path: '/employers/messages', label: 'Messages', icon: MessageCircle, onClick: handleMessagesClick, ref: messagesRef },
          ...(showFeedback ? [{ path: '/feedback', label: '', icon: RiRobot2Fill, isRobot: true }] : []),
          { path: '/employers/notifications', label: 'Notifications', icon: Bell, onClick: handleNotificationsClick },
          { path: '/employers/profile', label: 'Me', icon: User, onClick: handleProfileClick },
        ]
      : [
          { path: '/students/dashboard', label: 'Home', icon: Home },
          { path: '/students/people/suggestions', label: 'People', icon: Users, dropdown: studentPeopleMenu },
          { path: '/students/jobs/job-listings', label: 'Jobs', icon: Briefcase, dropdown: studentJobsMenu },
          { path: '/students/messages', label: 'Messages', icon: MessageCircle, onClick: handleMessagesClick, ref: messagesRef },
          ...(showFeedback ? [{ path: '/feedback', label: '', icon: RiRobot2Fill, isRobot: true }] : []),
          { path: '/students/notifications', label: 'Notifications', icon: Bell, onClick: handleNotificationsClick },
          { path: '/students/profile', label: 'Me', icon: User, onClick: handleProfileClick },
        ];

  const getHomePath = () =>
    getRole() === "employer"
      ? "/employers/dashboard"
      : "/students/dashboard";

  if (status === "loading") {
    return (
      <header
        className={`fixed top-0 z-[5] bg-white border-b border-gray-200 py-2 px-4 transition-all duration-200 ease-in-out ${className}`}
        style={{
          ...topNavStyle,
          left: isSidebarMinimized ? '80px' : '280px',
          right: 0,
          height: '64px',
        }}
      >
        <div className="flex justify-between items-center px-6 md:px-10 h-full">
          <div className="flex items-center">
            <Image src="/images/logo.blue3.png" alt="Seekr Logo" width={100} height={100} />
          </div>
          <div className="flex items-center mr-8" style={{ gap: isSidebarMinimized ? '112px' : '96px' }}>
            {/* Skeleton loader */}
            <div className="flex gap-8">
              <div className="flex flex-col items-center">
                <div className="w-6 h-6 rounded-full bg-gray-200 animate-pulse mb-1" />
                <div className="w-10 h-3 rounded bg-gray-200 animate-pulse" />
              </div>
              <div className="flex flex-col items-center">
                <div className="w-6 h-6 rounded-full bg-gray-200 animate-pulse mb-1" />
                <div className="w-12 h-3 rounded bg-gray-200 animate-pulse" />
              </div>
              <div className="flex flex-col items-center">
                <div className="w-6 h-6 rounded-full bg-gray-200 animate-pulse mb-1" />
                <div className="w-8 h-3 rounded bg-gray-200 animate-pulse" />
              </div>
              <div className="flex flex-col items-center">
                <div className="w-6 h-6 rounded-full bg-gray-200 animate-pulse mb-1" />
                <div className="w-14 h-3 rounded bg-gray-200 animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </header>
    );
  }

  // Only render TopNav if authenticated and session.user exists
  if (status !== "authenticated" || !session?.user) {
    return null;
  }

  return (
    <>
      <header
        className={`fixed top-0 z-[5] bg-white border-b border-gray-200 py-2 px-4 transition-all duration-200 ease-in-out ${className}`}
        style={{
          ...topNavStyle,
          left: isSidebarMinimized ? '80px' : '280px',
          right: 0,
          height: '64px',
        }}
      >
        <div
          className="flex justify-between items-center px-6 md:px-10 h-full"
        >
          <div className="flex items-center">
             <Link
               href={getHomePath()}
               className="text-xl font-bold text-white"
             >
               <Image src="/images/logo.blue3.png" alt="Seekr Logo" width={100} height={100} />
             </Link>

             {/* Feedback button (robot) */}
             {showFeedback && (
               <motion.a
                 href="/feedback"
                 target="_blank"
                 rel="noopener noreferrer"
                 className="ml-3 relative border border-purple-500 rounded-full shadow-lg overflow-hidden flex items-center justify-center"
                 style={{
                   background: "black",
                   width: 40,
                   height: 40,
                   padding: 0,
                   display: "flex"
                 }}
                 whileHover={{ scale: 1.08 }}
                 initial={false}
                 aria-label="Robot"
               >
                 <span className="relative z-10 flex items-center justify-center w-full h-full">
                   <RiRobot2Fill className="text-purple-500 w-5 h-5" />
                 </span>
               </motion.a>
             )}
          </div>
          <div
            className="flex items-center mr-8"
            style={{ gap: isSidebarMinimized ? '112px' : '96px' }}
          >
            {navItems.map((item, index) => {
              let isActive = false;
              if (item.dropdown) {
                isActive = item.dropdown.some((menu) => pathname === menu.href);
              } else {
                isActive = pathname === item.path;
              }
              const Icon = item.icon;

              if (item.isRobot) {
                return null;
              }

              // Dropdown for People: only for students
              if (item.label === "People" && getRole() !== "employer" && item.dropdown) {
                return (
                  <div
                    key={index}
                    className="relative flex flex-col items-center group"
                  >
                    <button
                      className="flex flex-col items-center focus:outline-none"
                      style={{
                        color: isActive ? '#1551a9' : labelColor,
                        fontWeight: 600,
                        fontSize: 15,
                        letterSpacing: 0.2
                      }}
                      onClick={e => {
                        e.preventDefault();
                        setOpenPeople((v) => !v);
                        setOpenJobs(false);
                      }}
                      onBlur={() => setTimeout(() => setOpenPeople(false), 150)}
                    >
                      <Icon size={22} color={isActive ? '#1551a9' : iconColor} />
                      <span className="text-xs mt-1">{item.label}</span>
                    </button>
                    <AnimatePresence>
                      {openPeople && (
                        <motion.div
                          initial={{ opacity: 0, y: -16, scale: 0.97 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -16, scale: 0.97 }}
                          transition={{ duration: 0.19, type: "spring", bounce: 0.18 }}
                          className="absolute top-12 left-1/2 -translate-x-1/2 min-w-[270px] bg-white border border-gray-100 rounded-2xl shadow-2xl py-2 ring-1 ring-blue-100"
                          style={{
                            boxShadow: '0 8px 32px 0 rgba(60,60,120,0.14), 0 1.5px 6px 0 rgba(60,60,120,0.10)',
                            zIndex: 9999
                          }}
                        >
                          {item.dropdown.map((menu, i) => (
                            <motion.a
                              key={i}
                              href={menu.href}
                              whileHover={{ scale: 1.045 }}
                              className="flex items-center px-6 py-3 gap-3 rounded-xl transition-all font-semibold text-[15px] group hover:bg-blue-50/70 hover:text-blue-700"
                              style={{
                                color: pathname === menu.href ? '#1551a9' : '#23272f',
                                background: pathname === menu.href ? '#f0f6ff' : 'transparent',
                                boxShadow: pathname === menu.href ? '0 2px 8px 0 rgba(21,81,169,0.04)' : undefined
                              }}
                              onClick={e => {
                                e.preventDefault();
                                setOpenPeople(false);
                                router.push(menu.href);
                              }}
                            >
                              <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-blue-50 group-hover:bg-blue-100 transition-colors">
                                <menu.icon size={18} className="opacity-80" />
                              </span>
                              <span>{menu.text}</span>
                            </motion.a>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              }

              // Dropdown for Jobs
              if (item.label === "Jobs" && item.dropdown) {
                return (
                  <div
                    key={index}
                    className="relative flex flex-col items-center group"
                  >
                    <button
                      className="flex flex-col items-center focus:outline-none"
                      style={{
                        color: isActive ? '#1551a9' : labelColor,
                        fontWeight: 600,
                        fontSize: 15,
                        letterSpacing: 0.2
                      }}
                      onClick={e => {
                        e.preventDefault();
                        setOpenJobs((v) => !v);
                        setOpenPeople(false);
                      }}
                      onBlur={() => setTimeout(() => setOpenJobs(false), 150)}
                    >
                      <Icon size={22} color={isActive ? '#1551a9' : iconColor} />
                      <span className="text-xs mt-1">{item.label}</span>
                    </button>
                    <AnimatePresence>
                      {openJobs && (
                        <motion.div
                          initial={{ opacity: 0, y: -16, scale: 0.97 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -16, scale: 0.97 }}
                          transition={{ duration: 0.19, type: "spring", bounce: 0.18 }}
                          className="absolute top-12 left-1/2 -translate-x-1/2 min-w-[270px] bg-white border border-gray-100 rounded-2xl shadow-2xl py-2 ring-1 ring-blue-100"
                          style={{
                            boxShadow: '0 8px 32px 0 rgba(60,60,120,0.14), 0 1.5px 6px 0 rgba(60,60,120,0.10)',
                            zIndex: 9999
                          }}
                        >
                          {item.dropdown.map((menu, i) => (
                            <motion.a
                              key={i}
                              href={menu.href}
                              whileHover={menu.disabled ? {} : { scale: 1.045 }}
                              className={`flex items-center px-6 py-3 gap-3 rounded-xl transition-all font-semibold text-[15px] group hover:bg-blue-50/70 hover:text-blue-700${menu.disabled ? " pointer-events-none" : ""}`}
                              style={{
                                color: pathname === menu.href ? '#1551a9' : '#23272f',
                                background: pathname === menu.href ? '#f0f6ff' : 'transparent',
                                boxShadow: pathname === menu.href ? '0 2px 8px 0 rgba(21,81,169,0.04)' : undefined,
                                ...(menu.style || {})
                              }}
                              onClick={e => {
                                if (menu.disabled) {
                                  e.preventDefault();
                                  return;
                                }
                                e.preventDefault();
                                setOpenJobs(false);
                                router.push(menu.href);
                              }}
                            >
                              <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-blue-50 group-hover:bg-blue-100 transition-colors">
                                <menu.icon size={18} className="opacity-80" />
                              </span>
                              <span>{menu.text}</span>
                              {menu.render && menu.render()}
                            </motion.a>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              }

              return (
                <a
                  key={index}
                  href={
                    item.label === 'Home'
                      ? getHomePath()
                      : item.path
                  }
                  ref={item.label === 'Messages' ? messagesRef : undefined}
                  className="flex flex-col items-center"
                  style={{ color: isActive ? '#1551a9' : labelColor }}
                  // Only override onClick for Messages
                  onClick={item.label === 'Messages'
                    ? (e) => { e.preventDefault(); handleMessagesClick(); }
                    : item.onClick
                      ? (e) => { e.preventDefault(); item.onClick(); }
                      : undefined
                  }
                >
                  <Icon size={20} color={isActive ? '#1551a9' : iconColor} />
                  <span className="text-xs mt-1">{item.label}</span>
                </a>
              );
            })}
          </div>
        </div>
      </header>
      {isProfileModalOpen && (
        <ProfileModal
          user={{
            name: 'Kemly Rose',
            email: 'kemlyrose5@mail.com',
            avatarUrl: '/images/avatar.png',
          }}
          onClose={() => setProfileModalOpen(false)}
        />
      )}
      {isNotificationsModalOpen && (
        <NotificationsModal
          notifications={[]}
          onClose={() => setNotificationsModalOpen(false)}
          positionRef={messagesRef}
        />
      )}
    </>
  );
};

export default TopNav;
