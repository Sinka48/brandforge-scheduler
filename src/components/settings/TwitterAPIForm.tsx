
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface TwitterKeys {
  consumerKey: string;
  consumerSecret: string;
  accessToken: string;
  accessTokenSecret: string;
}

export function TwitterAPIForm() {
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
      } else if (credentials) {
        setKeys(credentials.credentials as TwitterKeys);
      }
    } catch (error) {
      console.error('Error fetching credentials:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Test the connection using Supabase Edge Function
      const { data: tweetResult, error: tweetError } = await supabase.functions.invoke('publish-tweet', {
        body: { 
          content: "Testing Twitter connection...",
          test: true,
          keys
        }
      });

      if (tweetError) throw tweetError;

      // Store the credentials in the database
      const { error: dbError } = await supabase
        .from('api_credentials')
        .upsert({
          platform: 'twitter',
          credentials: keys
        }, {
          onConflict: 'user_id,platform'
        });

      if (dbError) throw dbError;

      // Store in session storage as backup
      sessionStorage.setItem('twitter_keys', JSON.stringify(keys));
      
      toast({
        title: "Success",
        description: `Connected to Twitter as @${tweetResult.username}`,
      });
    } catch (error: any) {
      console.error('Twitter connection error:', error);
      toast({
        title: "Connection Failed",
        description: error.message || "Failed to verify Twitter credentials",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="space-y-4">
          <div className="h-6 bg-gray-200 animate-pulse rounded"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 animate-pulse rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 animate-pulse rounded w-1/2"></div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold">Twitter API Configuration</h2>
          <p className="text-sm text-muted-foreground">
            Enter your Twitter API credentials. These will be securely stored for future use.
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label htmlFor="consumerKey" className="block text-sm font-medium mb-1">
              API Key (Consumer Key)
            </label>
            <Input
              id="consumerKey"
              value={keys.consumerKey}
              onChange={(e) => setKeys({ ...keys, consumerKey: e.target.value })}
              required
              type="password"
              placeholder="Enter your API Key"
            />
          </div>

          <div>
            <label htmlFor="consumerSecret" className="block text-sm font-medium mb-1">
              API Secret (Consumer Secret)
            </label>
            <Input
              id="consumerSecret"
              value={keys.consumerSecret}
              onChange={(e) => setKeys({ ...keys, consumerSecret: e.target.value })}
              required
              type="password"
              placeholder="Enter your API Secret"
            />
          </div>

          <div>
            <label htmlFor="accessToken" className="block text-sm font-medium mb-1">
              Access Token
            </label>
            <Input
              id="accessToken"
              value={keys.accessToken}
              onChange={(e) => setKeys({ ...keys, accessToken: e.target.value })}
              required
              type="password"
              placeholder="Enter your Access Token"
            />
          </div>

          <div>
            <label htmlFor="accessTokenSecret" className="block text-sm font-medium mb-1">
              Access Token Secret
            </label>
            <Input
              id="accessTokenSecret"
              value={keys.accessTokenSecret}
              onChange={(e) => setKeys({ ...keys, accessTokenSecret: e.target.value })}
              required
              type="password"
              placeholder="Enter your Access Token Secret"
            />
          </div>
        </div>

        <Button type="submit" className="w-full" disabled={isLoading}>
          Save and Test Connection
        </Button>
      </form>
    </Card>
  );
}
