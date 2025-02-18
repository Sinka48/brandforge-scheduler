
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  AlertCircle,
  CheckCircle2,
  Unlink,
} from "lucide-react";
import { PLATFORMS } from "@/constants/platforms";
import { TwitterAPIForm } from "./TwitterAPIForm";

interface PlatformConnection {
  platform: string;
  platform_username?: string | null;
  platform_user_id?: string | null;
  access_token: string;
}

export function SocialMediaSettings() {
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectedPlatforms, setConnectedPlatforms] = useState<PlatformConnection[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    fetchConnectedPlatforms();
  }, []);

  const fetchConnectedPlatforms = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        console.log('No active session found');
        return;
      }

      // Fetch both social connections and API credentials
      const [{ data: connections, error: connectionsError }, { data: apiCreds, error: apiCredsError }] = await Promise.all([
        supabase
          .from('social_connections')
          .select('platform, platform_username, platform_user_id, access_token'),
        supabase
          .from('api_credentials')
          .select('platform, credentials')
      ]);
      
      if (connectionsError) throw connectionsError;
      if (apiCredsError) throw apiCredsError;
      
      // Combine social connections with API credentials
      const allConnections = [...(connections || [])];
      
      // Add Twitter if API credentials exist
      const twitterCreds = apiCreds?.find(cred => cred.platform === 'twitter');
      if (twitterCreds && !allConnections.some(conn => conn.platform === 'twitter')) {
        allConnections.push({
          platform: 'twitter',
          platform_username: null,
          platform_user_id: null,
          access_token: 'connected'
        });
      }
      
      setConnectedPlatforms(allConnections);
    } catch (error) {
      console.error('Error fetching social connections:', error);
    }
  };

  const handleConnect = async (platform: string) => {
    if (platform.toLowerCase() !== 'twitter') {
      toast({
        title: "Coming Soon",
        description: `${platform} integration will be available soon.`,
        variant: "default",
      });
      return;
    }

    setIsConnecting(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast({
          title: "Authentication Required",
          description: "Please log in to connect your social accounts.",
          variant: "destructive",
        });
        return;
      }

      // Get Twitter credentials from api_credentials table
      const { data: apiCreds, error: credsError } = await supabase
        .from('api_credentials')
        .select('credentials')
        .eq('platform', 'twitter')
        .maybeSingle();

      if (!apiCreds || credsError) {
        toast({
          title: "API Keys Required",
          description: "Please enter your Twitter API keys first.",
          variant: "destructive",
        });
        return;
      }

      // Test Twitter connection and get account details
      const { data: testResult, error: testError } = await supabase.functions.invoke('publish-tweet', {
        body: { 
          content: "Testing Twitter connection...",
          test: true,
          keys: apiCreds.credentials
        }
      });

      if (testError) {
        console.error('Twitter test error:', testError);
        throw new Error('Failed to verify Twitter credentials');
      }

      // Extract Twitter username from the test response
      const twitterUsername = testResult?.username;
      if (!twitterUsername) {
        throw new Error('Could not retrieve Twitter username');
      }

      // Save the connection with the correct Twitter username
      const { error: saveError } = await supabase
        .from('social_connections')
        .upsert({
          user_id: session.user.id,
          platform: platform.toLowerCase(),
          access_token: 'connected',
          platform_username: twitterUsername,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id,platform'
        });

      if (saveError) throw saveError;

      await fetchConnectedPlatforms();
      
      toast({
        title: "Success",
        description: `Successfully connected to ${platform}.`,
      });
    } catch (error: any) {
      console.error(`Error connecting to ${platform}:`, error);
      toast({
        title: "Connection Failed",
        description: `Failed to connect to ${platform}. Please check your credentials and try again.`,
        variant: "destructive",
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = async (platform: string) => {
    try {
      const { error } = await supabase
        .from("social_connections")
        .delete()
        .eq("platform", platform.toLowerCase());

      if (error) throw error;

      setConnectedPlatforms(connectedPlatforms.filter(p => p.platform !== platform.toLowerCase()));
      toast({
        title: "Platform Disconnected",
        description: `Successfully disconnected from ${platform}.`,
      });
    } catch (error) {
      console.error(`Error disconnecting from ${platform}:`, error);
      toast({
        title: "Disconnection Failed",
        description: `Failed to disconnect from ${platform}. Please try again.`,
        variant: "destructive",
      });
    }
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case "Facebook":
        return <Facebook className="h-5 w-5" />;
      case "Twitter":
        return <Twitter className="h-5 w-5" />;
      case "Instagram":
        return <Instagram className="h-5 w-5" />;
      case "LinkedIn":
        return <Linkedin className="h-5 w-5" />;
      default:
        return null;
    }
  };

  const isConnected = (platformName: string) => {
    return connectedPlatforms.some(p => p.platform === platformName.toLowerCase());
  };

  const getConnectedAccount = (platformName: string) => {
    return connectedPlatforms.find(p => p.platform === platformName.toLowerCase());
  };

  return (
    <div className="space-y-6">
      <TwitterAPIForm />
      
      <Card className="p-6">
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-semibold">Social Media Connections</h2>
            <p className="text-sm text-muted-foreground">
              Connect your social media accounts to enable posting
            </p>
          </div>

          <div className="grid gap-4">
            {PLATFORMS.map((platform) => {
              const connected = isConnected(platform.name);
              const accountDetails = getConnectedAccount(platform.name);
              
              return (
                <div
                  key={platform.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    {getPlatformIcon(platform.name)}
                    <div>
                      <h3 className="font-medium">{platform.name}</h3>
                      {connected ? (
                        <div className="space-y-1">
                          <span className="flex items-center gap-1 text-green-600">
                            <CheckCircle2 className="h-4 w-4" />
                            Connected
                          </span>
                          {accountDetails?.platform_username && (
                            <span className="text-sm text-muted-foreground">
                              @{accountDetails.platform_username}
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="flex items-center gap-1 text-yellow-600">
                          <AlertCircle className="h-4 w-4" />
                          Not connected
                        </span>
                      )}
                    </div>
                  </div>
                  <Button
                    variant={connected ? "destructive" : "default"}
                    onClick={() =>
                      connected
                        ? handleDisconnect(platform.name)
                        : handleConnect(platform.name)
                    }
                    disabled={isConnecting}
                  >
                    {connected ? (
                      <>
                        <Unlink className="h-4 w-4 mr-2" />
                        Disconnect
                      </>
                    ) : (
                      "Connect"
                    )}
                  </Button>
                </div>
              );
            })}
          </div>
        </div>
      </Card>
    </div>
  );
}
