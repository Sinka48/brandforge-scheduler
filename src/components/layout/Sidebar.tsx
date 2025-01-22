import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar, FileText, Settings, Wand2, Palette } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

export function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="pb-12 w-full">
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <div className="space-y-1">
            <Button
              variant={isActive("/calendar") ? "secondary" : "ghost"}
              className="w-full justify-start"
              onClick={() => navigate("/calendar")}
            >
              <Calendar className="mr-2 h-4 w-4" />
              Calendar
            </Button>
            <Button
              variant={isActive("/campaigns") ? "secondary" : "ghost"}
              className="w-full justify-start"
              onClick={() => navigate("/campaigns")}
            >
              <Wand2 className="mr-2 h-4 w-4" />
              Campaigns
            </Button>
            <Button
              variant={isActive("/drafts") ? "secondary" : "ghost"}
              className="w-full justify-start"
              onClick={() => navigate("/drafts")}
            >
              <FileText className="mr-2 h-4 w-4" />
              Drafts
            </Button>
            <Button
              variant={isActive("/brands") ? "secondary" : "ghost"}
              className="w-full justify-start"
              onClick={() => navigate("/brands")}
            >
              <Palette className="mr-2 h-4 w-4" />
              Brands
            </Button>
            <Button
              variant={isActive("/settings") ? "secondary" : "ghost"}
              className="w-full justify-start"
              onClick={() => navigate("/settings")}
            >
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}