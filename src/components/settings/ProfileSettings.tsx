import { useState } from "react";
import { Session } from "@supabase/supabase-js";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface ProfileSettingsProps {
  session: Session | null;
}

export function ProfileSettings({ session }: ProfileSettingsProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const [email, setEmail] = useState(session?.user?.email || '');

  if (!session?.user) {
    return (
      <Card className="p-6">
        <div className="text-center">
          Please sign in to access profile settings.
        </div>
      </Card>
    );
  }

  const handleUpdateEmail = async () => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.updateUser({ email });
      
      if (error) throw error;

      toast({
        title: "Email Updated",
        description: "Please check your new email for a confirmation link.",
      });
    } catch (error) {
      console.error('Error updating email:', error);
      toast({
        title: "Error",
        description: "Failed to update email. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-semibold">Profile Settings</h2>
          <p className="text-sm text-muted-foreground">
            Update your profile information
          </p>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <Button 
            onClick={handleUpdateEmail} 
            disabled={isLoading || email === session.user.email}
          >
            Update Email
          </Button>
        </div>
      </div>
    </Card>
  );
}