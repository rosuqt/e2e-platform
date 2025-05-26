import { useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { toast } from 'react-hot-toast';

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
          console.log('Realtime payload received:', payload); 
          toast.success(`New issue submitted: ${payload.new.issue_title}`, );
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);
}
