'use client';

import { Toaster } from 'react-hot-toast';
import { useNotifications } from '../../app/hooks/useNotifications';

export default function NotificationWrapper({ children }: { children: React.ReactNode }) {
  useNotifications();

    return (
      <>
        {children}
        <Toaster position="top-right" />
    </>
  );
}
