import { Routes as RouterRoutes, Route } from "react-router-dom";
import IndexPage from "./pages/Index";
import BrandPage from "./pages/Brand";
import CalendarPage from "./pages/Calendar";
import SettingsPage from "./pages/Settings";

export function Routes() {
  return (
    <RouterRoutes>
      <Route path="/" element={<IndexPage />} />
      <Route path="/brand" element={<BrandPage />} />
      <Route path="/calendar" element={<CalendarPage />} />
      <Route path="/settings" element={<SettingsPage />} />
    </RouterRoutes>
  );
}