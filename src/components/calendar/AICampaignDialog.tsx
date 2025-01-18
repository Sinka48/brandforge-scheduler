import { Dialog, DialogContent } from "@/components/ui/dialog";
import { DialogHeader } from "./post-dialog/DialogHeader";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { Loader2, Wand2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
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
  const [topic, setTopic] = useState("");
  const [platforms, setPlatforms] = useState<string[]>([]);
  const [duration, setDuration] = useState("7");
  const [tone, setTone] = useState("professional");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handlePlatformToggle = (platformId: string) => {
    setPlatforms(prev =>
      prev.includes(platformId)
        ? prev.filter(p => p !== platformId)
        : [...prev, platformId]
    );
  };

  const handleGenerate = async () => {
    if (!topic.trim()) {
      toast({
        title: "Missing Information",
        description: "Please enter a campaign topic",
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
    try {
      // Log the current state before making the request
      console.log('Starting campaign generation with:', {
        topic,
        platforms,
        duration,
        tone
      });

      // Ensure platform values are lowercase
      const normalizedPlatforms = platforms.map(p => p.toLowerCase());

      const { data, error } = await supabase.functions.invoke('generate-campaign', {
        body: { 
          topic, 
          platforms: normalizedPlatforms,
          duration: parseInt(duration), 
          tone 
        },
      });

      console.log('Response from generate-campaign:', { data, error });

      if (error) {
        console.error('Error from generate-campaign:', error);
        throw error;
      }

      if (!data?.campaign || !Array.isArray(data.campaign)) {
        console.error('Invalid campaign data structure:', data);
        throw new Error('Invalid campaign data received');
      }

      // Format and validate each post in the campaign
      const formattedCampaign = data.campaign.map((post: any) => {
        if (!post.content || !post.platform || !post.time) {
          console.error('Invalid post structure:', post);
          throw new Error('Invalid post data received');
        }
        return {
          ...post,
          platform: post.platform.toLowerCase(),
          content: post.content.trim()
        };
      });

      console.log('Successfully formatted campaign:', formattedCampaign);

      // Pass the formatted campaign to the parent component
      onGenerateCampaign(formattedCampaign);
      
      // Close the dialog
      onOpenChange(false);
      
      // Reset the form
      setTopic("");
      setPlatforms([]);
      setDuration("7");
      setTone("professional");

      // Show success message
      toast({
        title: "Campaign Generated",
        description: "Your AI campaign has been created successfully",
      });
    } catch (error) {
      console.error('Error in handleGenerate:', error);
      toast({
        title: "Generation Failed",
        description: error instanceof Error ? error.message : "Failed to generate campaign. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader editMode={false} selectedDate={undefined} />
        
        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="topic">Campaign Topic</Label>
            <Textarea
              id="topic"
              placeholder="What is your campaign about?"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <PlatformSelector
              selectedPlatforms={platforms}
              onPlatformToggle={handlePlatformToggle}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="duration">Campaign Duration (days)</Label>
              <Select value={duration} onValueChange={setDuration}>
                <SelectTrigger>
                  <SelectValue placeholder="Select duration" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="3">3 days</SelectItem>
                  <SelectItem value="7">1 week</SelectItem>
                  <SelectItem value="14">2 weeks</SelectItem>
                  <SelectItem value="30">1 month</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="tone">Campaign Tone</Label>
              <Select value={tone} onValueChange={setTone}>
                <SelectTrigger>
                  <SelectValue placeholder="Select tone" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="professional">Professional</SelectItem>
                  <SelectItem value="casual">Casual</SelectItem>
                  <SelectItem value="friendly">Friendly</SelectItem>
                  <SelectItem value="humorous">Humorous</SelectItem>
                  <SelectItem value="formal">Formal</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button
            onClick={handleGenerate}
            className="w-full"
            disabled={isLoading || !topic.trim() || platforms.length === 0}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <Wand2 className="h-4 w-4 mr-2" />
            )}
            Generate Campaign
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}