import { Routes as RouterRoutes, Route } from "react-router-dom";
import IndexPage from "@/pages/Index";
import CalendarPage from "@/pages/Calendar";
import BrandPage from "@/pages/Brand"; 
import BrandIdentityPage from "@/pages/BrandIdentity";
import BrandListPage from "@/pages/BrandList";
import SettingsPage from "@/pages/Settings";

export function Routes() {
  return (
    <RouterRoutes>
      <Route path="/" element={<IndexPage />} />
      <Route path="/calendar" element={<CalendarPage />} />
      <Route path="/brand" element={<BrandPage />} />
      <Route path="/brand/identity" element={<BrandIdentityPage />} />
      <Route path="/brands" element={<BrandListPage />} />
      <Route path="/settings" element={<SettingsPage />} />
    </RouterRoutes>
  );
}