
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { Json } from "@/integrations/supabase/types";

export interface TwitterKeys {
  consumerKey: string;
  consumerSecret: string;
  accessToken: string;
  accessTokenSecret: string;
}

export function useTwitterCredentials() {
  const [keys, setKeys] = useState<TwitterKeys>({
    consumerKey: '',
    consumerSecret: '',
    accessToken: '',
    accessTokenSecret: ''
  });
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchStoredCredentials();
  }, []);

  const fetchStoredCredentials = async () => {
    try {
      const { data: credentials, error } = await supabase
        .from('api_credentials')
        .select('credentials')
        .eq('platform', 'twitter')
        .maybeSingle();

      if (error) {
        if (error.code !== 'PGRST116') { // No rows returned
          console.error('Error fetching credentials:', error);
        }
      } else if (credentials?.credentials) {
        // Safely cast the credentials to TwitterKeys
        const parsedCredentials = credentials.credentials as Record<string, string>;
        if (
          'consumerKey' in parsedCredentials &&
          'consumerSecret' in parsedCredentials &&
          'accessToken' in parsedCredentials &&
          'accessTokenSecret' in parsedCredentials
        ) {
          setKeys(parsedCredentials as TwitterKeys);
        }
      }
    } catch (error) {
      console.error('Error fetching credentials:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveCredentials = async (credentials: TwitterKeys) => {
    setIsLoading(true);
    try {
      // Test the connection using Supabase Edge Function
      const { data: tweetResult, error: tweetError } = await supabase.functions.invoke('publish-tweet', {
        body: { 
          content: "Testing Twitter connection...",
          test: true,
          keys: credentials
        }
      });

      if (tweetError) throw tweetError;

      // Get current user's ID
      const user = supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      // Store the credentials in the database
      const { error: dbError } = await supabase
        .from('api_credentials')
        .upsert({
          platform: 'twitter',
          credentials: credentials as Json,
          user_id: (await user).data.user?.id,
        }, {
          onConflict: 'user_id,platform'
        });

      if (dbError) throw dbError;

      // Store in session storage as backup
      sessionStorage.setItem('twitter_keys', JSON.stringify(credentials));
      
      toast({
        title: "Success",
        description: `Connected to Twitter as @${tweetResult.username}`,
      });

      setKeys(credentials);
      return true;
    } catch (error: any) {
      console.error('Twitter connection error:', error);
      toast({
        title: "Connection Failed",
        description: error.message || "Failed to verify Twitter credentials",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    keys,
    setKeys,
    isLoading,
    saveCredentials
  };
}
