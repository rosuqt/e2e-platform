'use client';

import { usePathname, useRouter } from 'next/navigation';
import { Home, Users, Briefcase, MessageCircle, Bell, User } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useRef, useState, useMemo } from 'react';
import { ProfileModal } from '../students/profile/components/profile-modal';
import { MessagesModal } from './messages-modal';
import { NotificationsModal } from '../students/notifications/components/notifications-modal';
import { RiRobot2Fill } from "react-icons/ri";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import Link from 'next/link';
import supabase from "@/lib/supabase";

interface TopNavProps {
  className?: string;
  iconColor?: string;
  labelColor?: string;
  isSidebarMinimized?: boolean;
  topNavStyle?: React.CSSProperties;
}

const TopNav: React.FC<TopNavProps> = ({
  className,
  iconColor = 'gray',
  labelColor = 'gray',
  isSidebarMinimized,
  topNavStyle, 
}) => {
  const pathname = usePathname() ?? "";
  const router = useRouter();
  const [isProfileModalOpen, setProfileModalOpen] = useState(false);
  const [isNotificationsModalOpen, setNotificationsModalOpen] = useState(false);
  const [isMessagesModalOpen, setMessagesModalOpen] = useState(false);
  const [showFeedback, setShowFeedback] = useState<boolean>(false);
  const messagesRef = useRef<HTMLAnchorElement | null>(null); 

  const { data: session } = useSession();
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

  const navItems = useMemo(() => {
    const handleProfileClick = () => setProfileModalOpen((prev) => !prev);
    const handleNotificationsClick = () => setNotificationsModalOpen((prev) => !prev);
    const handleMessagesClick = () => setMessagesModalOpen((prev) => !prev);
  
    // Build username from session name
    const username = session?.user?.name
      ? session.user.name.split(" ").join("")
      : "profile";
  
    if (session?.user?.role === "employer") {
      return [
        { path: '/employers/dashboard', label: 'Home', icon: Home },
        { path: '/employers/jobs/job-listings', label: 'Jobs', icon: Briefcase },
        { path: '/employers/people/candidate-matches', label: 'People', icon: Users },
        { path: '/employers/messages', label: 'Messages', icon: MessageCircle, onClick: handleMessagesClick, ref: messagesRef },
        ...(showFeedback ? [{ path: '/feedback', label: '', icon: RiRobot2Fill, isRobot: true }] : []),
        { path: '/employers/notifications', label: 'Notifications', icon: Bell, onClick: handleNotificationsClick },
        { path: '/employers/profile', label: 'Me', icon: User, onClick: handleProfileClick },
      ];
    }
  
    return [
      { path: '/students/dashboard', label: 'Home', icon: Home },
      { path: '/students/people/suggestions', label: 'People', icon: Users },
      { path: '/students/jobs/job-listings', label: 'Jobs', icon: Briefcase },
      { path: '/students/messages', label: 'Messages', icon: MessageCircle, onClick: handleMessagesClick, ref: messagesRef },
      ...(showFeedback ? [{ path: '/feedback', label: '', icon: RiRobot2Fill, isRobot: true }] : []),
      { path: '/students/notifications', label: 'Notifications', icon: Bell, onClick: handleNotificationsClick },
      { path: `/students/profile/${username}`, label: 'Me', icon: User, onClick: handleProfileClick },
    ];
  }, [session, showFeedback]);
  
  

  useEffect(() => {
    Promise.all(navItems.map((item) => router.prefetch(item.path)));
  }, [router, navItems]);

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
               href={
                 session?.user?.role === "employer"
                   ? "/employers/dashboard"
                   : "/students/dashboard"
               }
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
              const isActive = pathname.startsWith(item.path);
              const Icon = item.icon;

              if (item.isRobot) {
                return null;
              }

              return (
                <a
                  key={index}
                  href={item.path}
                  ref={item.label === 'Messages' ? messagesRef : undefined}
                  className="flex flex-col items-center"
                  style={{ color: isActive ? '#1551a9' : labelColor }}
                  onClick={item.onClick ? (e) => { e.preventDefault(); item.onClick(); } : undefined}
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
          notifications={[
            { id: '1', title: 'New Message', message: 'You got a message from Vivi', timestamp: '2 hours ago', avatarUrl: '/images/avatar1.png', isUnread: true },
            { id: '2', title: 'Application Approved', message: 'Your application was approved', timestamp: '1 day ago', avatarUrl: '/images/avatar2.png', isUnread: false },
          ]}
          onClose={() => setNotificationsModalOpen(false)}
          positionRef={messagesRef}
        />
      )}
      {isMessagesModalOpen && (
        <MessagesModal
          messages={[
            { id: '1', sender: 'Kemly Rose', content: 'Hey, how are you?', timestamp: '2 hours ago', avatarUrl: '/images/avatar3.png', isUnread: true },
            { id: '2', sender: 'Zeyners', content: 'Meeting at 3 PM', timestamp: '1 day ago', avatarUrl: '/images/avatar4.png', isUnread: false },
            { id: '3', sender: 'John Doe', content: 'Can we reschedule?', timestamp: '3 days ago', avatarUrl: '/images/avatar5.png', isUnread: true },
          ]}
          onClose={() => setMessagesModalOpen(false)}
          positionRef={messagesRef}
        />
      )}
    </>
  );
};

export default TopNav;
