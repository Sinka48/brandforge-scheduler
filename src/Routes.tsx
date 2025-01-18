import { Routes as RouterRoutes, Route } from "react-router-dom";
import IndexPage from "@/pages/Index";
import CalendarPage from "@/pages/Calendar";
import BrandPage from "@/pages/Brand"; 
import BrandIdentityPage from "@/pages/BrandIdentity";
import BrandListPage from "@/pages/BrandList";
import SettingsPage from "@/pages/Settings";
import CampaignsPage from "@/pages/Campaigns";

export function Routes() {
  return (
    <RouterRoutes>
      <Route path="/dashboard" element={<IndexPage />} />
      <Route path="/" element={<CalendarPage />} />
      <Route path="/calendar" element={<CalendarPage />} />
      <Route path="/brand" element={<BrandPage />} />
      <Route path="/brand/identity" element={<BrandIdentityPage />} />
      <Route path="/brands" element={<BrandListPage />} />
      <Route path="/settings" element={<SettingsPage />} />
      <Route path="/campaigns" element={<CampaignsPage />} />
    </RouterRoutes>
  );
}