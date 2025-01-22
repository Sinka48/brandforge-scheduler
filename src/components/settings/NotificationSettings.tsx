import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export function NotificationSettings() {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [postReminders, setPostReminders] = useState(true);
  const [campaignUpdates, setCampaignUpdates] = useState(true);
  const { toast } = useToast();

  const handleSave = () => {
    toast({
      title: "Settings Saved",
      description: "Your notification preferences have been updated.",
    });
  };

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-semibold">Notification Settings</h2>
          <p className="text-sm text-muted-foreground">
            Choose what notifications you want to receive
          </p>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="email-notifications" className="flex flex-col">
              <span>Email Notifications</span>
              <span className="text-sm text-muted-foreground">
                Receive email updates about your account
              </span>
            </Label>
            <Switch
              id="email-notifications"
              checked={emailNotifications}
              onCheckedChange={setEmailNotifications}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="post-reminders" className="flex flex-col">
              <span>Post Reminders</span>
              <span className="text-sm text-muted-foreground">
                Get reminded about scheduled posts
              </span>
            </Label>
            <Switch
              id="post-reminders"
              checked={postReminders}
              onCheckedChange={setPostReminders}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="campaign-updates" className="flex flex-col">
              <span>Campaign Updates</span>
              <span className="text-sm text-muted-foreground">
                Receive updates about your campaigns
              </span>
            </Label>
            <Switch
              id="campaign-updates"
              checked={campaignUpdates}
              onCheckedChange={setCampaignUpdates}
            />
          </div>

          <Button onClick={handleSave} className="mt-4">
            Save Preferences
          </Button>
        </div>
      </div>
    </Card>
  );
}