import { Routes as RouterRoutes, Route, Navigate } from "react-router-dom";
import { Session } from "@supabase/supabase-js";
import IndexPage from "@/pages/Index";
import CalendarPage from "@/pages/Calendar";
import BrandPage from "@/pages/Brand"; 
import BrandIdentityPage from "@/pages/BrandIdentity";
import BrandListPage from "@/pages/BrandList";
import SettingsPage from "@/pages/Settings";
import CampaignsPage from "@/pages/Campaigns";
import { Header } from "@/components/layout/Header";

interface RoutesProps {
  session: Session | null;
}

export function Routes({ session }: RoutesProps) {
  // If not authenticated, only show index page which contains login form
  if (!session) {
    return (
      <RouterRoutes>
        <Route path="/" element={<IndexPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </RouterRoutes>
    );
  }

  return (
    <>
      <Header session={session} />
      <RouterRoutes>
        <Route path="/" element={<IndexPage />} />
        <Route path="/calendar" element={<CalendarPage />} />
        <Route path="/brand" element={<BrandPage />} />
        <Route path="/brand/identity" element={<BrandIdentityPage />} />
        <Route path="/brands" element={<BrandListPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/campaigns" element={<CampaignsPage />} />
      </RouterRoutes>
    </>
  );
}