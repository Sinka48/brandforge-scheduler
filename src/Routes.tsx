import { useEffect, useState } from "react";
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

export default function Routes() {
  const navigate = useNavigate();
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setIsLoading(false);
      if (session) {
        navigate('/calendar');
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log("Auth state changed:", _event, session);
      setSession(session);
      
      if (session) {
        console.log("User authenticated, redirecting to calendar");
        navigate('/calendar');
      } else {
        console.log("User not authenticated, redirecting to home");
        navigate('/');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

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