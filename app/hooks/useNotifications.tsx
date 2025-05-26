import { useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { toast } from 'react-hot-toast';
import { RiRobot2Fill } from 'react-icons/ri';

export function useNotifications() {
  useEffect(() => {
    const channel = supabase
      .channel('realtime-notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'test_cases'
        },
        (payload) => {
          const t = toast.custom(
            <div style={{
              background: '#181028',
              color: '#fff',
              borderRadius: 10,
              padding: '18px 22px 12px 18px',
              minWidth: 320,
              boxShadow: '0 2px 12px #0004',
              border: '2px solid #a259ff',
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              gap: 8
            }}>
              <div style={{
                position: 'absolute',
                top: 5,
                right: 8,
                zIndex: 2,
                display: 'flex',
                alignItems: 'center',
                gap: 12
              }}>
                <button
                  onClick={() => toast.dismiss(t)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#fff',
                    fontSize: 18,
                    cursor: 'pointer',
                    padding: 0,
                    lineHeight: 1,
                  }}
                  aria-label="Close"
                >
                  ×
                </button>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <RiRobot2Fill size={28} style={{ color: '#a259ff' }} />
                <div>
                  <div style={{ fontWeight: 600, color: '#fff' }}>
                    New issue submitted by {payload.new.tester_name}
                  </div>
                  <div style={{ fontSize: 14, opacity: 0.85, color: '#d1b3ff', marginTop: 2 }}>
                    {payload.new.issue_title}
                  </div>
                </div>
              </div>
              <div style={{
                display: 'flex',
                justifyContent: 'flex-end',
                alignItems: 'center',
                marginTop: 10
              }}>
                <a
                  href="/feedback/ally"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: '#a259ff',
                    background: 'none',
                    border: 'none',
                    padding: 0,
                    fontWeight: 600,
                    fontSize: 15,
                    textDecoration: 'none',
                    cursor: 'pointer'
                  }}
                >
                  View Issue
                </a>
              </div>
            </div>,
            { duration: Infinity, position: "top-right" }
          );
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);
}
