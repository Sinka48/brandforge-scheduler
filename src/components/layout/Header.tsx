import { Home, PenTool, Library, Calendar, Settings, Rocket } from "lucide-react";
import { Link } from "react-router-dom";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Brand Generator", href: "/brand", icon: PenTool },
  { name: "Saved Brands", href: "/brands", icon: Library },
  { name: "Calendar", href: "/", icon: Calendar },
  { name: "Campaigns", href: "/campaigns", icon: Rocket },
  { name: "Settings", href: "/settings", icon: Settings },
];

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <Link to="/" className="mr-6 flex items-center space-x-2">
          <span className="text-xl font-bold">Brand Management</span>
        </Link>
        <nav className="flex flex-1 items-center space-x-6">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className="flex items-center space-x-2 text-sm font-medium transition-colors hover:text-primary"
            >
              <item.icon className="h-4 w-4" />
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}