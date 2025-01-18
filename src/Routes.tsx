import { Routes as RouterRoutes, Route, Navigate } from "react-router-dom";
import { Session } from "@supabase/supabase-js";
import IndexPage from "@/pages/Index";
import CalendarPage from "@/pages/Calendar";
import BrandsPage from "@/pages/Brands";
import SettingsPage from "@/pages/Settings";
import CampaignsPage from "@/pages/Campaigns";

interface RoutesProps {
  session: Session | null;
}

export function Routes({ session }: RoutesProps) {
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
      <Route path="/" element={<IndexPage session={session} />} />
      <Route path="/feed" element={<CalendarPage session={session} />} />
      <Route path="/brands" element={<BrandsPage session={session} />} />
      <Route path="/settings" element={<SettingsPage session={session} />} />
      <Route path="/campaigns" element={<CampaignsPage session={session} />} />
    </RouterRoutes>
  );
}