import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Post } from "@/components/calendar/types";
import { PlatformId } from "@/constants/platforms";

export function usePostQuery() {
  const { toast } = useToast();

  return useQuery({
    queryKey: ['auth-session'],
    queryFn: async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) {
        console.error('Auth error:', error);
        toast({
          title: "Authentication Error",
          description: "Failed to check authentication status. Please try again.",
          variant: "destructive",
        });
        throw error;
      }
      console.log('Auth session:', session);
      return session;
    },
  });
}