import { useEffect } from "react";
import { Routes as RouterRoutes, Route, Navigate, useNavigate } from "react-router-dom";
import { Session } from "@supabase/supabase-js";
import IndexPage from "@/pages/Index";
import CalendarPage from "@/pages/Calendar";
import BrandPage from "@/pages/Brand"; 
import BrandIdentityPage from "@/pages/BrandIdentity";
import BrandListPage from "@/pages/BrandList";
import SettingsPage from "@/pages/Settings";
import CampaignsPage from "@/pages/Campaigns";
import { supabase } from "@/integrations/supabase/client";

interface RoutesProps {
  session?: Session | null;
}

export default function Routes({ session }: RoutesProps) {
  const navigate = useNavigate();

  useEffect(() => {
    // Check initial session
    if (session) {
      navigate('/calendar');
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth state changed:", event, session); // Debug log
      
      if (event === 'SIGNED_IN' && session) {
        console.log("User signed in, redirecting to calendar"); // Debug log
        navigate('/calendar', { replace: true });
      } else if (event === 'SIGNED_OUT') {
        console.log("User signed out, redirecting to home"); // Debug log
        navigate('/', { replace: true });
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, session]);

  // If not authenticated, only show index page which contains login form
  if (!session) {
    return (
      <RouterRoutes>
        <Route path="/" element={<IndexPage session={null} />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </RouterRoutes>
    );
  }

  return (
    <RouterRoutes>
      <Route path="/" element={<Navigate to="/calendar" replace />} />
      <Route path="/calendar" element={<CalendarPage session={session} />} />
      <Route path="/brand" element={<BrandPage session={session} />} />
      <Route path="/brand/identity" element={<BrandIdentityPage session={session} />} />
      <Route path="/brands" element={<BrandListPage session={session} />} />
      <Route path="/settings" element={<SettingsPage session={session} />} />
      <Route path="/campaigns" element={<CampaignsPage session={session} />} />
    </RouterRoutes>
  );
}