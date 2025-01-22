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

export const router = createBrowserRouter([
  {
    path: "/",
    element: <IndexPage />,
  },
  {
    path: "/calendar",
    element: <CalendarPage />,
  },
  {
    path: "/campaigns",
    element: <CampaignsPage />,
  },
  {
    path: "/settings",
    element: <SettingsPage />,
  },
  {
    path: "/brands",
    element: <BrandsPage />,
  },
  {
    path: "/brand/:id",
    element: <BrandPage />,
  },
  {
    path: "/brand/:id/identity",
    element: <BrandIdentityPage />,
  },
  {
    path: "/brand-list",
    element: <BrandListPage />,
  },
  {
    path: "/how-it-works",
    element: <HowItWorksPage />,
  },
  {
    path: "/drafts",
    element: <DraftsPage />,
  },
]);