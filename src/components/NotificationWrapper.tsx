'use client';

import { useNotifications } from '../../app/hooks/useNotifications'; // .tsx is preferred, but extension can be omitted if only .tsx exists

export default function NotificationWrapper({ children }: { children: React.ReactNode }) {
  useNotifications();

  return <>{children}</>;
}
