import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu, PenTool, Library } from "lucide-react";
import { cn } from "@/lib/utils";

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

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
              "flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary",
              isActive("/calendar") && "text-primary"
            )}
            onClick={() => setOpen(false)}
          >
            Dashboard
          </Link>
          <div className="flex flex-col gap-2">
            <span className="text-sm font-medium">Brand</span>
            <Link
              to="/brand"
              className={cn(
                "flex items-center gap-2 pl-4 text-sm font-medium transition-colors hover:text-primary",
                isActive("/brand") && "text-primary"
              )}
              onClick={() => setOpen(false)}
            >
              <PenTool className="h-4 w-4" />
              Create Brand
            </Link>
            <Link
              to="/brands"
              className={cn(
                "flex items-center gap-2 pl-4 text-sm font-medium transition-colors hover:text-primary",
                isActive("/brands") && "text-primary"
              )}
              onClick={() => setOpen(false)}
            >
              <Library className="h-4 w-4" />
              My Brands
            </Link>
          </div>
          <Link
            to="/calendar"
            className={cn(
              "flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary",
              isActive("/calendar") && "text-primary"
            )}
            onClick={() => setOpen(false)}
          >
            Calendar
          </Link>
          <Link
            to="/campaigns"
            className={cn(
              "flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary",
              isActive("/campaigns") && "text-primary"
            )}
            onClick={() => setOpen(false)}
          >
            Campaigns
          </Link>
        </nav>
      </SheetContent>
    </Sheet>
  );
}