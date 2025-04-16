'use client';

import { usePathname } from 'next/navigation';
import { Home, Users, Briefcase, MessageCircle, Bell, User } from 'lucide-react';
import { motion } from 'framer-motion';

interface TopNavProps {
  className?: string;
  iconColor?: string;
  labelColor?: string;
  isSidebarMinimized?: boolean;
}

const TopNav: React.FC<TopNavProps> = ({ className, iconColor = 'gray', labelColor = 'gray', isSidebarMinimized }) => {
  const pathname = usePathname();

  const navItems = [
    { path: '/student/student-dashboard', label: 'Home', icon: Home },
    { path: '/student-module/student-dashboard/#', label: 'People', icon: Users },
    { path: '/student-module/student-dashboard/#', label: 'Jobs', icon: Briefcase },
    { path: '/student-module/student-dashboard/#', label: 'Messages', icon: MessageCircle },
    { path: '/student-module/student-dashboard/#', label: 'Notifications', icon: Bell },
    { path: '/student-module/student-dashboard/#', label: 'Me', icon: User },
  ];

  return (
    <header
      className={`fixed top-0 z-[10] bg-white border-b border-gray-200 py-2 px-4 transition-all duration-200 ease-in-out ${className}`}
      style={{
        left: isSidebarMinimized ? '80px' : '280px',
        width: isSidebarMinimized ? 'calc(100% - 80px)' : 'calc(100% - 280px)',
      }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <span className="text-[#1551a9] font-medium ml-4">InternConnect</span>
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
            const isActive = pathname === item.path;
            const Icon = item.icon;

            return (
              <a
                key={index}
                href={item.path}
                className="flex flex-col items-center"
                style={{ color: isActive ? '#1551a9' : labelColor }}
              >
                <Icon size={20} color={isActive ? '#1551a9' : iconColor} />
                <span className="text-xs mt-1">{item.label}</span>
              </a>
            );
          })}
        </motion.div>
      </div>
    </header>
  );
};

export default TopNav;
