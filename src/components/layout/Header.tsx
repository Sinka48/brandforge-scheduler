import { MobileNav } from "./MobileNav";

export function Header() {
  return (
    <div className="sticky top-0 z-50 flex h-16 shrink-0 items-center gap-x-4 border-b bg-background px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
      <MobileNav />
      <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
        <div className="flex flex-1"></div>
        <div className="flex items-center gap-x-4 lg:gap-x-6">
          {/* Add profile menu here later */}
        </div>
      </div>
    </div>
  );
}