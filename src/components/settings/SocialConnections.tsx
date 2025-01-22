import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Facebook } from "lucide-react";

interface SocialConnection {
  platform: string;
  platform_username: string;
  created_at: string;
}

export function SocialConnections() {
  const [connections, setConnections] = useState<SocialConnection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchConnections();
  }, []);

  const fetchConnections = async () => {
    try {
      const { data, error } = await supabase
        .from('social_connections')
        .select('platform, platform_username, created_at');

      if (error) throw error;

      setConnections(data || []);
    } catch (error) {
      console.error('Error fetching social connections:', error);
      toast({
        title: "Error",
        description: "Failed to load social connections",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFacebookConnect = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'facebook',
        options: {
          scopes: 'pages_show_list,pages_read_engagement,pages_manage_posts',
          redirectTo: `${window.location.origin}/auth/callback?provider=facebook`
        }
      });

      if (error) throw error;
    } catch (error) {
      console.error('Error connecting to Facebook:', error);
      toast({
        title: "Error",
        description: "Failed to connect to Facebook. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDisconnect = async (platform: string) => {
    try {
      const { error } = await supabase
        .from('social_connections')
        .delete()
        .eq('platform', platform);

      if (error) throw error;

      setConnections(connections.filter(conn => conn.platform !== platform));
      toast({
        title: "Success",
        description: `Disconnected from ${platform}`,
      });
    } catch (error) {
      console.error('Error disconnecting:', error);
      toast({
        title: "Error",
        description: `Failed to disconnect from ${platform}`,
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-semibold mb-6">Connected Social Media Accounts</h2>
      
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Facebook className="h-6 w-6" />
            <div>
              <h3 className="font-medium">Facebook</h3>
              {connections.find(c => c.platform === 'facebook') ? (
                <p className="text-sm text-muted-foreground">
                  Connected as {connections.find(c => c.platform === 'facebook')?.platform_username}
                </p>
              ) : (
                <p className="text-sm text-muted-foreground">Not connected</p>
              )}
            </div>
          </div>
          
          {connections.find(c => c.platform === 'facebook') ? (
            <Button 
              variant="outline" 
              onClick={() => handleDisconnect('facebook')}
            >
              Disconnect
            </Button>
          ) : (
            <Button 
              variant="default" 
              onClick={handleFacebookConnect}
            >
              Connect
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}