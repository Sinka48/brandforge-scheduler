
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
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        console.error('No active session found');
        return;
      }

      const { data: credentials, error } = await supabase
        .from('api_credentials')
        .select('credentials')
        .eq('platform', 'twitter')
        .eq('user_id', session.user.id)
        .maybeSingle();

      if (error) {
        console.error('Error fetching credentials:', error);
        return;
      }

      if (credentials?.credentials) {
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
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error("User not authenticated");
      }

      // Test the connection using Supabase Edge Function
      const { data: tweetResult, error: tweetError } = await supabase.functions.invoke('publish-tweet', {
        body: { 
          content: "Testing Twitter connection...",
          test: true,
          keys: credentials
        }
      });

      if (tweetError) throw tweetError;

      // Store the credentials in the database
      const { error: dbError } = await supabase
        .from('api_credentials')
        .upsert({
          platform: 'twitter',
          credentials: credentials as Json,
          user_id: session.user.id,
        }, {
          onConflict: 'user_id,platform'
        });

      if (dbError) throw dbError;

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
