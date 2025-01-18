import { Route, Routes as RouterRoutes } from "react-router-dom";
import CalendarPage from "@/pages/Calendar";
import BrandPage from "@/pages/Brand";
import IndexPage from "@/pages/Index";
import SettingsPage from "@/pages/Settings";
import BrandIdentityPage from "@/pages/BrandIdentity";
import BrandManagementPage from "@/pages/BrandManagement";

export function Routes() {
  return (
    <RouterRoutes>
      <Route path="/" element={<IndexPage />} />
      <Route path="/calendar" element={<CalendarPage />} />
      <Route path="/brand" element={<BrandPage />} />
      <Route path="/brand/identity" element={<BrandIdentityPage />} />
      <Route path="/brand/management" element={<BrandManagementPage />} />
      <Route path="/settings" element={<SettingsPage />} />
    </RouterRoutes>
  );
}