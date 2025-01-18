import { Session } from "@supabase/supabase-js";
import { Header } from "./Header";

interface LayoutProps {
  children: React.ReactNode;
  session: Session;
}

export function Layout({ children, session }: LayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <Header session={session} />
      <div className="max-w-[1400px] w-full mx-auto px-4 sm:px-6 lg:px-8">
        <main className="py-8">
          {children}
        </main>
      </div>
    </div>
  );
}