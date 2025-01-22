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

interface PlatformConnection {
  platform: string;
  platform_username?: string | null;
  platform_user_id?: string | null;
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

      const { data: connections, error } = await supabase
        .from('social_connections')
        .select('platform, platform_username, platform_user_id');
      
      if (error) throw error;
      
      setConnectedPlatforms(connections || []);
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

      // Test Twitter connection
      const { data: testResult, error: testError } = await supabase.functions.invoke('publish-tweet', {
        body: { 
          content: "Testing Twitter connection...",
          test: true
        }
      });

      if (testError) {
        console.error('Twitter test error:', testError);
        throw new Error('Failed to verify Twitter credentials');
      }

      // Save the connection
      const { error: saveError } = await supabase
        .from('social_connections')
        .insert({
          user_id: session.user.id,
          platform: platform.toLowerCase(),
          access_token: 'connected',
          platform_username: session.user.email
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
  );
}