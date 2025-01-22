import { createBrowserRouter, Navigate } from "react-router-dom";
import IndexPage from "./pages/Index";
import CalendarPage from "./pages/Calendar";
import CampaignsPage from "./pages/Campaigns";
import SettingsPage from "./pages/Settings";
import BrandsPage from "./pages/Brands";
import BrandPage from "./pages/Brand";
import BrandIdentityPage from "./pages/BrandIdentity";
import BrandListPage from "./pages/BrandList";
import HowItWorksPage from "./pages/HowItWorks";
import DraftsPage from "./pages/Drafts";
import { Session } from "@supabase/supabase-js";

interface RoutesProps {
  session: Session | null;
}

export function Routes({ session }: RoutesProps) {
  // Protected route wrapper
  const ProtectedRoute = ({ element }: { element: React.ReactNode }) => {
    if (!session) {
      console.log('No session, redirecting to home');
      return <Navigate to="/" replace />;
    }
    return element;
  };

  return createBrowserRouter([
    {
      path: "/",
      element: <IndexPage session={session} />,
    },
    {
      path: "/calendar",
      element: <ProtectedRoute element={<CalendarPage session={session} />} />,
    },
    {
      path: "/campaigns",
      element: <ProtectedRoute element={<CampaignsPage session={session} />} />,
    },
    {
      path: "/settings",
      element: <ProtectedRoute element={<SettingsPage session={session} />} />,
    },
    {
      path: "/brands",
      element: <ProtectedRoute element={<BrandsPage session={session} />} />,
    },
    {
      path: "/brand/:id",
      element: <ProtectedRoute element={<BrandPage session={session} />} />,
    },
    {
      path: "/brand/:id/identity",
      element: <ProtectedRoute element={<BrandIdentityPage session={session} />} />,
    },
    {
      path: "/brand-list",
      element: <ProtectedRoute element={<BrandListPage session={session} />} />,
    },
    {
      path: "/how-it-works",
      element: <HowItWorksPage session={session} />,
    },
    {
      path: "/drafts",
      element: <ProtectedRoute element={<DraftsPage session={session} />} />,
    },
  ]);
}