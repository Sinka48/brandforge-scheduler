import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

export const useCalendarAuth = () => {
  const navigate = useNavigate();
  const [hasCheckedSession, setHasCheckedSession] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setHasCheckedSession(true);
      
      if (!session) {
        navigate('/', { replace: true });
      }
    };
    
    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session && hasCheckedSession) {
        navigate('/', { replace: true });
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate, hasCheckedSession]);
};