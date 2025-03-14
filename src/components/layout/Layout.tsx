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
      <div className="container max-w-[1400px] mx-auto">
        <main className="py-8 space-y-8">
          {children}
        </main>
      </div>
    </div>
  );
}