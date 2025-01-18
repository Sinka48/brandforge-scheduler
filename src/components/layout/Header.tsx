import { Home, PenTool, Library, Calendar, Settings } from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/", icon: Home },
  { name: "Brand Generator", href: "/brand", icon: PenTool },
  { name: "Saved Brands", href: "/brands", icon: Library },
  { name: "Calendar", href: "/calendar", icon: Calendar },
  { name: "Settings", href: "/settings", icon: Settings },
];

export function Header() {
  return (
    <header className="flex items-center justify-between p-4 bg-white shadow">
      <h1 className="text-xl font-bold">Brand Management</h1>
      <nav>
        <ul className="flex space-x-4">
          {navigation.map((item) => (
            <li key={item.name}>
              <a href={item.href} className="flex items-center space-x-2">
                <item.icon className="h-5 w-5" />
                <span>{item.name}</span>
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
