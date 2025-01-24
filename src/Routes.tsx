import { createBrowserRouter } from "react-router-dom";
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
import BrandGeneratorPage from "./pages/BrandGenerator";

interface RoutesProps {
  session: Session | null;
}

export function Routes({ session }: RoutesProps) {
  return createBrowserRouter([
    {
      path: "/",
      element: <IndexPage session={session} />,
      errorElement: <div className="p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Oops! Something went wrong</h2>
        <p className="text-muted-foreground">Please try again or contact support if the problem persists.</p>
      </div>
    },
    {
      path: "/calendar",
      element: <CalendarPage session={session} />,
    },
    {
      path: "/campaigns",
      element: <CampaignsPage session={session} />,
    },
    {
      path: "/settings",
      element: <SettingsPage session={session} />,
    },
    {
      path: "/brands",
      element: <BrandsPage session={session} />,
    },
    {
      path: "/brand/new",
      element: <BrandGeneratorPage session={session} />,
    },
    {
      path: "/brand/:id",
      element: <BrandPage session={session} />,
    },
    {
      path: "/brand/:id/identity",
      element: <BrandIdentityPage session={session} />,
    },
    {
      path: "/brand-list",
      element: <BrandListPage session={session} />,
    },
    {
      path: "/how-it-works",
      element: <HowItWorksPage session={session} />,
    },
    {
      path: "/drafts",
      element: <DraftsPage session={session} />,
    },
    {
      path: "/brand-identity",
      element: <BrandIdentityPage session={session} />,
    },
  ]);
}