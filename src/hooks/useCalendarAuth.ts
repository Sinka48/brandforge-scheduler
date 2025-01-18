import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';

export const useCalendarAuth = () => {
  const navigate = useNavigate();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    let mounted = true;

    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (mounted) {
          if (!session) {
            // Only navigate if we're not already on the home page
            if (window.location.pathname !== '/') {
              navigate('/', { replace: true });
            }
          }
          setIsInitialized(true);
        }
      } catch (error) {
        console.error('Auth check error:', error);
        if (mounted) {
          setIsInitialized(true);
        }
      }
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (mounted && isInitialized && !session) {
        // Only navigate if we're not already on the home page
        if (window.location.pathname !== '/') {
          navigate('/', { replace: true });
        }
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [navigate, isInitialized]);

  return { isInitialized };
};