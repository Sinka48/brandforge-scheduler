import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Home, Calendar, PenTool, Library, Settings, BarChart2 } from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/", icon: Home },
  { name: "Brand Generator", href: "/brand", icon: PenTool },
  { name: "Saved Brands", href: "/brands", icon: Library },
  { name: "Calendar", href: "/calendar", icon: Calendar },
  { name: "Campaigns", href: "/campaigns", icon: BarChart2 },
  { name: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
  const location = useLocation();

  return (
    <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
      <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-sidebar border-r px-6 pb-4">
        <div className="flex h-16 shrink-0 items-center">
          <h1 className="text-2xl font-bold">Brand AI</h1>
        </div>
        <nav className="flex flex-1 flex-col">
          <ul role="list" className="flex flex-1 flex-col gap-y-7">
            <li>
              <ul role="list" className="-mx-2 space-y-1">
                {navigation.map((item) => (
                  <li key={item.name}>
                    <Link
                      to={item.href}
                      className={cn(
                        "group flex gap-x-3 rounded-md p-2 text-sm leading-6",
                        location.pathname === item.href
                          ? "bg-gray-100 text-primary font-semibold"
                          : "text-gray-700 hover:bg-gray-50"
                      )}
                    >
                      <item.icon className="h-6 w-6 shrink-0" />
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
}