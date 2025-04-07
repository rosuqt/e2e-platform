'use client';

import { usePathname } from 'next/navigation';
import { Home, Users, Briefcase, MessageCircle, Bell, User } from 'lucide-react';

interface TopNavProps {
  className?: string;
  iconColor?: string;
  labelColor?: string;
  isSidebarMinimized?: boolean;
}

const TopNav: React.FC<TopNavProps> = ({ className, iconColor = 'gray', labelColor = 'gray', isSidebarMinimized }) => {
  const pathname = usePathname();

  const navItems = [
    { path: '/student-module/student-dashboard', label: 'Home', icon: Home },
    { path: '/student-module/student-dashboard/#', label: 'People', icon: Users },
    { path: '/student-module/student-dashboard/#', label: 'Jobs', icon: Briefcase },
    { path: '/student-module/student-dashboard/#', label: 'Messages', icon: MessageCircle },
    { path: '/student-module/student-dashboard/#', label: 'Notifications', icon: Bell },
    { path: '/student-module/student-dashboard/#', label: 'Me', icon: User },
  ];

  return (
    <header
  className={`fixed top-0 z-50 bg-white border-b border-gray-200 py-2 px-4 transition-all duration-300 ease-in-out ${className} ${
    isSidebarMinimized
      ? 'left-20 w-[calc(100%-5rem)]'
      : 'left-64 w-[calc(100%-16rem)]'
  }`}
>

      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <span className="text-[#1551a9] font-medium mr-2">InternConnect</span>
        </div>
        <div className="flex items-center space-x-8">
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
        </div>
      </div>
    </header>
  );
};

export default TopNav;
