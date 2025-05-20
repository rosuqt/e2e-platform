'use client';

import { usePathname, useRouter } from 'next/navigation';
import { Home, Users, Briefcase, MessageCircle, Bell, User } from 'lucide-react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useEffect, useRef, useState, useMemo } from 'react';
import { ProfileModal } from '@/app/(app)/student/profile/components/profile-modal';
import { NotificationsModal } from '@/app/(app)/student/notifications/components/notifications-modal';
import { MessagesModal } from '@/app/(app)/student/messages/components/messages-modal';

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
  const pathname = usePathname();
  const router = useRouter();
  const [isProfileModalOpen, setProfileModalOpen] = useState(false);
  const [isNotificationsModalOpen, setNotificationsModalOpen] = useState(false);
  const [isMessagesModalOpen, setMessagesModalOpen] = useState(false);
  const messagesRef = useRef<HTMLAnchorElement | null>(null); // Allow null

  const handleProfileClick = () => {
    setProfileModalOpen((prev) => !prev);
  };

  const handleNotificationsClick = () => {
    setNotificationsModalOpen((prev) => !prev);
  };

  const handleMessagesClick = () => {
    setMessagesModalOpen((prev) => !prev);
  };

  const navItems = useMemo(() => {
    return [
      { path: '/student/student-dashboard', label: 'Home', icon: Home },
      { path: '/student/people/suggestions', label: 'People', icon: Users },
      { path: '/student/jobs/job-listings', label: 'Jobs', icon: Briefcase },
      { path: '/student/messages', label: 'Messages', icon: MessageCircle, onClick: handleMessagesClick, ref: messagesRef },
      { path: '/student/notifications', label: 'Notifications', icon: Bell, onClick: handleNotificationsClick },
      { path: '/student/profile', label: 'Me', icon: User, onClick: handleProfileClick },
    ];
  }, []);

  useEffect(() => {
    Promise.all(navItems.map((item) => router.prefetch(item.path)));
  }, [router, navItems]);

  return (
    <>
      <header
        className={`fixed top-0 z-[10] bg-white border-b border-gray-200 py-2 px-4 transition-all duration-200 ease-in-out ${className}`}
        style={{
          ...topNavStyle,
          left: isSidebarMinimized ? '80px' : '280px',
          width: isSidebarMinimized ? 'calc(100% - 80px)' : 'calc(100% - 280px)',
          height: '64px',
        }}
      >
        <div className="flex justify-between items-center px-6 md:px-10 h-full">
          <div className="flex items-center">
            <Image src="/images/logo-test2.png" alt="Seekr Logo" width={50} height={50} />
            <span className="text-[#1551a9] font-medium ml-4">Seekr</span>
          </div>
          <motion.div
            className="flex items-center mr-8"
            style={{ gap: isSidebarMinimized ? '112px' : '96px' }}
            animate={{ gap: isSidebarMinimized ? '112px' : '96px' }}
            transition={{
              type: 'spring',
              stiffness: 200,
              damping: 15,
            }}
          >
            {navItems.map((item, index) => {
              const isActive =
                item.path === '/student/people/suggestions'
                  ? pathname.startsWith('/student/people')
                  : item.path === '/student/jobs/job-listings'
                  ? pathname.startsWith('/student/jobs')
                  : pathname.startsWith(item.path);
              const Icon = item.icon;

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
          </motion.div>
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
