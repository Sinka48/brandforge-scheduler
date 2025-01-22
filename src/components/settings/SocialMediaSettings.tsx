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

export function SocialMediaSettings() {
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectedPlatforms, setConnectedPlatforms] = useState<string[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    fetchConnectedPlatforms();
  }, []);

  const fetchConnectedPlatforms = async () => {
    try {
      const { data: connections, error } = await supabase
        .from('social_connections')
        .select('platform');
      
      if (error) throw error;
      
      setConnectedPlatforms(connections.map(conn => conn.platform));
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

      // Test Twitter credentials
      const { data: testResult, error: testError } = await supabase.functions.invoke('publish-tweet', {
        body: { 
          content: "Testing Twitter connection...",
          test: true // This flag tells the function to only verify credentials
        }
      });

      if (testError) throw testError;

      // If test succeeds, save the connection
      const { error: saveError } = await supabase
        .from('social_connections')
        .insert({
          user_id: session.user.id,
          platform: platform.toLowerCase(),
          access_token: 'connected', // We don't store actual tokens as they're in env vars
          platform_username: session.user.email // Placeholder for actual Twitter username
        });

      if (saveError) throw saveError;

      setConnectedPlatforms([...connectedPlatforms, platform.toLowerCase()]);
      
      toast({
        title: "Success",
        description: `Successfully connected to ${platform}.`,
      });

      await fetchConnectedPlatforms();
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

      setConnectedPlatforms(connectedPlatforms.filter(p => p !== platform.toLowerCase()));
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
            const isConnected = connectedPlatforms.includes(platform.name.toLowerCase());
            return (
              <div
                key={platform.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex items-center gap-3">
                  {getPlatformIcon(platform.name)}
                  <div>
                    <h3 className="font-medium">{platform.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {isConnected ? (
                        <span className="flex items-center gap-1 text-green-600">
                          <CheckCircle2 className="h-4 w-4" />
                          Connected
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-yellow-600">
                          <AlertCircle className="h-4 w-4" />
                          Not connected
                        </span>
                      )}
                    </p>
                  </div>
                </div>
                <Button
                  variant={isConnected ? "destructive" : "default"}
                  onClick={() =>
                    isConnected
                      ? handleDisconnect(platform.name)
                      : handleConnect(platform.name)
                  }
                  disabled={isConnecting}
                >
                  {isConnected ? (
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