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
      <main className="container mx-auto py-10 px-4 md:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}