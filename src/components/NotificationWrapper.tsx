'use client';

import { useNotifications } from '../../app/hooks/useNotifications';

export default function NotificationWrapper({ children }: { children: React.ReactNode }) {
  useNotifications();

  return <>{children}</>;
}
