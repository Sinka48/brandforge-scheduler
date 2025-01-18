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
      <main className="container mx-auto py-10">
        {children}
      </main>
    </div>
  );
}