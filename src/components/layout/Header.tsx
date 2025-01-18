import { Home, Settings, Calendar, PenTool, Library } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { MobileNav } from "./MobileNav";

const navigation = [
  { name: "Dashboard", href: "/", icon: Home },
  { name: "Brand Generator", href: "/brand", icon: PenTool },
  { name: "Brands", href: "/brand/identity", icon: Library },
  { name: "Calendar", href: "/calendar", icon: Calendar },
  { name: "Settings", href: "/settings", icon: Settings },
];

export function Header() {
  const location = useLocation();

  return (
    <div className="sticky top-0 z-50 flex h-16 shrink-0 items-center gap-x-4 border-b bg-background px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
      <div className="flex items-center gap-x-4">
        <MobileNav />
        <Link to="/" className="flex items-center gap-2">
          <img
            src="https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?w=32&h=32&fit=crop&auto=format"
            alt="Brand AI Logo"
            className="h-8 w-8 rounded-md"
          />
          <span className="hidden text-xl font-bold sm:block">Brand AI</span>
        </Link>
      </div>
      <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
        <nav className="flex flex-1">
          <ul className="flex flex-1 items-center justify-center gap-6">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <li key={item.name}>
                  <Link
                    to={item.href}
                    className={cn(
                      "group flex items-center gap-x-2 rounded-md p-2 text-sm leading-6",
                      isActive
                        ? "bg-accent text-accent-foreground font-semibold"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                    )}
                  >
                    <item.icon className="h-5 w-5" aria-hidden="true" />
                    {item.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        <div className="flex items-center gap-x-4 lg:gap-x-6">
          {/* Add profile menu here later */}
        </div>
      </div>
    </div>
  );
}