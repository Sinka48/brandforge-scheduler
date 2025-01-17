import { Route, Routes as RouterRoutes } from "react-router-dom";
import CalendarPage from "@/pages/Calendar";
import BrandPage from "@/pages/Brand";
import IndexPage from "@/pages/Index";
import SettingsPage from "@/pages/Settings";

export function Routes() {
  return (
    <RouterRoutes>
      <Route path="/" element={<IndexPage />} />
      <Route path="/calendar" element={<CalendarPage />} />
      <Route path="/brand" element={<BrandPage />} />
      <Route path="/settings" element={<SettingsPage />} />
    </RouterRoutes>
  );
}