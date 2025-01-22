import { useState } from "react";
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

  const handleConnect = async (platform: string) => {
    setIsConnecting(true);
    try {
      // This is a placeholder for the actual OAuth flow
      // In a real implementation, this would redirect to the platform's OAuth page
      toast({
        title: "Coming Soon",
        description: `${platform} integration will be available soon.`,
        variant: "default",
      });
    } catch (error) {
      console.error(`Error connecting to ${platform}:`, error);
      toast({
        title: "Connection Failed",
        description: `Failed to connect to ${platform}. Please try again.`,
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

      setConnectedPlatforms(connectedPlatforms.filter(p => p !== platform));
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
            const isConnected = connectedPlatforms.includes(platform.name);
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