import { Link, useNavigate } from "react-router-dom";
import { Session } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { Rocket, Settings, LogOut, PenSquare, Palette } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { MobileNav } from "./MobileNav";

interface HeaderProps {
  session: Session | null;
}

export function Header({ session }: HeaderProps) {
  const navigate = useNavigate();
  
  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const handleLogoClick = () => {
    navigate('/');
  };

  if (!session) {
    return (
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <div className="flex flex-1 items-center justify-end space-x-4">
            <Link to="/">
              <Button variant="ghost" size="sm">
                Login
              </Button>
            </Link>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div 
          onClick={handleLogoClick}
          className="mr-4 cursor-pointer"
        >
          <div className="relative w-8 h-8 rounded-full overflow-hidden">
            <div 
              className="absolute inset-0"
              style={{
                backgroundColor: '#ff99df',
                backgroundImage: `
                  radial-gradient(circle at 52% 73%, hsla(310, 85%, 67%, 1) 0px, transparent 50%),
                  radial-gradient(circle at 0% 30%, hsla(197, 90%, 76%, 1) 0px, transparent 50%),
                  radial-gradient(circle at 41% 26%, hsla(234, 79%, 69%, 1) 0px, transparent 50%)
                `,
                backgroundSize: '150% 150%',
                animation: 'moveBackground 10s linear infinite',
              }}
            />
            <Rocket className="relative z-10 w-5 h-5 text-white m-1.5" />
          </div>
        </div>

        <div className="flex flex-1 items-center justify-end gap-4">
          <NavigationMenu className="hidden lg:flex">
            <NavigationMenuList>
              <NavigationMenuItem>
                <Link to="/feed">
                  <NavigationMenuLink
                    className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50"
                  >
                    <Rocket className="mr-2 h-4 w-4" />
                    Feed
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <Link to="/brands">
                  <NavigationMenuLink
                    className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50"
                  >
                    <Palette className="mr-2 h-4 w-4" />
                    Brands
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <Link to="/campaigns">
                  <NavigationMenuLink
                    className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50"
                  >
                    <PenSquare className="mr-2 h-4 w-4" />
                    Campaigns
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          <Link to="/settings">
            <Button variant="ghost" size="icon">
              <Settings className="h-4 w-4" />
            </Button>
          </Link>

          <Button variant="ghost" size="icon" onClick={handleLogout}>
            <LogOut className="h-4 w-4" />
          </Button>
        </div>

        <div className="lg:hidden">
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
