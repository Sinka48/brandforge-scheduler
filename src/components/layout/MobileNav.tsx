import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu, Rocket, PenSquare, Wand2, Palette, Settings, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
    setOpen(false);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" className="lg:hidden">
          <Menu className="h-6 w-6" />
          <span className="sr-only">Open menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] sm:w-[400px]">
        <nav className="flex flex-col gap-4">
          <Link
            to="/calendar"
            className={cn(
              "flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary"
            )}
            onClick={() => setOpen(false)}
          >
            <Rocket className="h-4 w-4" />
            Feed
          </Link>
          <Link
            to="/drafts"
            className={cn(
              "flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary"
            )}
            onClick={() => setOpen(false)}
          >
            <PenSquare className="h-4 w-4" />
            Posts
          </Link>
          <Link
            to="/campaigns"
            className={cn(
              "flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary"
            )}
            onClick={() => setOpen(false)}
          >
            <Wand2 className="h-4 w-4" />
            Campaigns
          </Link>
          <Link
            to="/brands"
            className={cn(
              "flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary"
            )}
            onClick={() => setOpen(false)}
          >
            <Palette className="h-4 w-4" />
            Brands
          </Link>
          <Link
            to="/settings"
            className={cn(
              "flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary"
            )}
            onClick={() => setOpen(false)}
          >
            <Settings className="h-4 w-4" />
            Settings
          </Link>
          <Button
            variant="ghost"
            className="justify-start px-0"
            onClick={handleLogout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </nav>
      </SheetContent>
    </Sheet>
  );
}