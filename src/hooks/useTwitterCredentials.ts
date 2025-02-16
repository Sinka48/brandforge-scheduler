
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

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
        .single();

      if (error) {
        if (error.code !== 'PGRST116') { // No rows returned
          console.error('Error fetching credentials:', error);
        }
      } else if (credentials?.credentials) {
        const typedCredentials = credentials.credentials as TwitterKeys;
        setKeys(typedCredentials);
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

      // Store the credentials in the database
      const { error: dbError } = await supabase
        .from('api_credentials')
        .upsert({
          platform: 'twitter',
          credentials: credentials as unknown as Json,
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
