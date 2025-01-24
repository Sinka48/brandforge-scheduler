import { RouterProvider } from "react-router-dom";
import { ThemeProvider } from "./components/theme-provider";
import { Toaster } from "./components/ui/toaster";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes } from "./Routes";
import { useEffect, useState } from "react";
import { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "./hooks/use-toast";

const queryClient = new QueryClient();

function App() {
  const [session, setSession] = useState<Session | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        console.error('Error getting session:', error);
        // Clear the session if there's an error
        setSession(null);
        // Only show toast for non-refresh token errors
        if (error.message !== "Invalid Refresh Token: Refresh Token Not Found") {
          toast({
            title: "Session Error",
            description: "Please sign in again to continue.",
            variant: "destructive",
          });
        }
        return;
      }
      setSession(session);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event);
      
      if (event === 'SIGNED_OUT' || event === 'USER_DELETED') {
        // Clear any cached data when user signs out
        queryClient.clear();
        setSession(null);
      } else if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        setSession(session);
      } else if (event === 'USER_UPDATED') {
        // Handle user data update
        setSession(session);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [toast]);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <RouterProvider router={Routes({ session })} />
        <Toaster />
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;