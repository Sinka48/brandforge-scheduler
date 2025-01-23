import { Dialog, DialogContent } from "@/components/ui/dialog";
import { DialogHeader } from "./post-dialog/DialogHeader";
import { DialogActions } from "./post-dialog/DialogActions";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Loader2, Wand2, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { CampaignConfiguration } from "./campaign-dialog/CampaignConfiguration";
import { GeneratedContent } from "./campaign-dialog/GeneratedContent";
import { addDays, set } from "date-fns";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useQueryClient } from "@tanstack/react-query";
import { PlatformSelector } from "./post-dialog/PlatformSelector";

interface AICampaignDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onGenerateCampaign: (posts: any[]) => void;
}

export function AICampaignDialog({
  isOpen,
  onOpenChange,
  onGenerateCampaign,
}: AICampaignDialogProps) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [name, setName] = useState("");
  const [goal, setGoal] = useState("");
  const [platforms, setPlatforms] = useState<string[]>([]);
  const [duration, setDuration] = useState("7");
  const [tone, setTone] = useState("professional");
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [generatedPosts, setGeneratedPosts] = useState<any[]>([]);
  const [campaignId, setCampaignId] = useState<string | null>(null);
  const { toast } = useToast();

  const handlePlatformToggle = (platformId: string) => {
    setPlatforms(prev =>
      prev.includes(platformId)
        ? prev.filter(p => p !== platformId)
        : [...prev, platformId]
    );
  };

  const handleRegeneratePost = async (index: number) => {
    if (!generatedPosts[index]) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-campaign', {
        body: { 
          goal,
          platforms: [generatedPosts[index].platform.toLowerCase()],
          duration: 1,
          tone,
        },
      });

      if (error) throw error;

      const newPost = data.campaign[0];
      const updatedPosts = [...generatedPosts];
      updatedPosts[index] = newPost;
      setGeneratedPosts(updatedPosts);

      toast({
        title: "Post Regenerated",
        description: "The post has been regenerated successfully",
      });
    } catch (error) {
      console.error('Error regenerating post:', error);
      toast({
        title: "Regeneration Failed",
        description: error instanceof Error ? error.message : "Failed to regenerate post",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerate = async () => {
    if (!name.trim()) {
      toast({
        title: "Missing Information",
        description: "Please enter a campaign name",
        variant: "destructive",
      });
      return;
    }

    if (!goal) {
      toast({
        title: "Missing Information",
        description: "Please select a campaign goal",
        variant: "destructive",
      });
      return;
    }

    if (platforms.length === 0) {
      toast({
        title: "Missing Information",
        description: "Please select at least one platform",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setProgress(0);
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('Not authenticated');
      }

      const startDate = new Date();
      const endDate = addDays(startDate, parseInt(duration));

      const { data: campaignData, error: campaignError } = await supabase
        .from('campaigns')
        .insert({
          name,
          description: goal,
          platforms: platforms.map(p => p.toLowerCase()),
          status: 'draft',
          start_date: startDate.toISOString(),
          end_date: endDate.toISOString(),
          settings: {
            duration,
            tone,
          },
          user_id: session.user.id
        })
        .select()
        .single();

      if (campaignError) throw campaignError;
      setCampaignId(campaignData.id);

      const { data, error } = await supabase.functions.invoke('generate-campaign', {
        body: { 
          goal,
          platforms: platforms.map(p => p.toLowerCase()),
          duration: parseInt(duration),
          tone,
        },
      });

      if (error) throw error;

      setGeneratedPosts(data.campaign);
      setProgress(100);

      toast({
        title: "Campaign Generated",
        description: "Campaign content has been generated successfully. Click Save to finalize.",
      });
    } catch (error) {
      console.error('Error generating campaign:', error);
      toast({
        title: "Generation Failed",
        description: error instanceof Error ? error.message : "Failed to generate campaign",
        variant: "destructive",
      });
      setProgress(0);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!campaignId || !generatedPosts.length) return;

    setIsLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Not authenticated');

      const startDate = new Date();

      // Save generated posts as drafts
      for (const post of generatedPosts) {
        const [hours, minutes] = post.time.split(':').map(Number);
        const scheduledDate = set(startDate, {
          hours,
          minutes,
          seconds: 0,
          milliseconds: 0
        });

        const finalDate = addDays(scheduledDate, generatedPosts.indexOf(post));

        await supabase.from('posts').insert({
          content: post.content,
          platform: post.platform.toLowerCase(),
          status: 'draft',
          campaign_id: campaignId,
          scheduled_for: finalDate.toISOString(),
          user_id: session.user.id
        });
      }

      // Invalidate relevant queries
      await queryClient.invalidateQueries({ queryKey: ['campaigns'] });
      await queryClient.invalidateQueries({ queryKey: ['posts'] });

      toast({
        title: "Campaign Saved",
        description: "Campaign and posts have been saved successfully",
      });

      // Close dialog and navigate to campaigns page
      onOpenChange(false);
      navigate('/campaigns');
    } catch (error) {
      console.error('Error saving campaign:', error);
      toast({
        title: "Save Failed",
        description: error instanceof Error ? error.message : "Failed to save campaign",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent 
        className={`${
          generatedPosts.length > 0 
            ? 'sm:max-w-[900px] grid grid-cols-[45%_55%]' 
            : 'sm:max-w-[600px]'
        } h-[85vh] p-0 overflow-hidden gap-0`}
      >
        <div className="h-full flex flex-col border-r">
          <div className="p-4 border-b">
            <h2 className="text-lg font-semibold">Create AI Campaign</h2>
            <p className="text-sm text-muted-foreground">
              Generate a series of coordinated posts for your marketing campaign
            </p>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="platforms">Social Media Platforms</Label>
                <PlatformSelector
                  selectedPlatforms={platforms}
                  onPlatformToggle={handlePlatformToggle}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">Campaign Name or Idea</Label>
                <Input
                  id="name"
                  placeholder="Enter your campaign name or main idea"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="goal">Campaign Goal</Label>
                <Select value={goal} onValueChange={setGoal}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select campaign goal" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="awareness">Raise Brand Awareness</SelectItem>
                    <SelectItem value="engagement">Boost Engagement</SelectItem>
                    <SelectItem value="traffic">Drive Website Traffic</SelectItem>
                    <SelectItem value="leads">Generate Leads</SelectItem>
                    <SelectItem value="sales">Increase Sales</SelectItem>
                    <SelectItem value="loyalty">Build Customer Loyalty</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <CampaignConfiguration
                platforms={platforms}
                onPlatformToggle={handlePlatformToggle}
                duration={duration}
                setDuration={setDuration}
                tone={tone}
                setTone={setTone}
              />
            </div>
          </div>

          <div className="p-4 border-t">
            {generatedPosts.length > 0 ? (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setGeneratedPosts([]);
                    setCampaignId(null);
                  }}
                  className="flex-1"
                >
                  Reset
                </Button>
                <Button
                  onClick={handleSave}
                  className="flex-1"
                  disabled={isLoading}
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save Campaign
                </Button>
              </div>
            ) : (
              <Button
                onClick={handleGenerate}
                className="w-full"
                disabled={isLoading || !name.trim() || !goal || platforms.length === 0}
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Wand2 className="h-4 w-4 mr-2" />
                )}
                Generate AI Campaign
              </Button>
            )}
          </div>
        </div>

        {generatedPosts.length > 0 && (
          <div className="h-full overflow-hidden">
            <div className="p-4 border-b">
              <h3 className="font-semibold">Generated Posts</h3>
              <p className="text-sm text-muted-foreground">
                Review your AI-generated campaign posts
              </p>
            </div>
            <div className="p-4 h-[calc(100%-5rem)] overflow-y-auto">
              <GeneratedContent
                isLoading={isLoading}
                progress={progress}
                generatedPosts={generatedPosts}
                onRegeneratePost={handleRegeneratePost}
              />
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}