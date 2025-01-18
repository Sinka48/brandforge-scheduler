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
      <div className="max-w-screen-2xl mx-auto">
        <main className="container py-8">
          {children}
        </main>
      </div>
    </div>
  );
}