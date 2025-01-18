import { Dialog, DialogContent } from "@/components/ui/dialog";
import { DialogHeader } from "./post-dialog/DialogHeader";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { Loader2, RefreshCw, Wand2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { PlatformSelector } from "./post-dialog/PlatformSelector";
import { PlatformPreview } from "./post-dialog/PlatformPreview";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface AICampaignDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onGenerateCampaign: (posts: any[]) => void;
}

interface GeneratedPost {
  content: string;
  platform: string;
  time: string;
}

const PLATFORM_LIMITS = {
  twitter: 280,
  facebook: 63206,
  instagram: 2200,
  linkedin: 3000,
};

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
  const [progress, setProgress] = useState(0);
  const [generatedPosts, setGeneratedPosts] = useState<GeneratedPost[]>([]);
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
          topic,
          platforms: [generatedPosts[index].platform],
          duration: 1,
          tone 
        },
      });

      if (error) throw error;

      const newPost = data.campaign[0];
      const updatedPosts = [...generatedPosts];
      updatedPosts[index] = {
        content: newPost.content,
        platform: newPost.platform,
        time: newPost.time,
      };
      setGeneratedPosts(updatedPosts);

      toast({
        title: "Post Regenerated",
        description: "The post has been regenerated successfully",
      });
    } catch (error) {
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
    setProgress(0);
    setGeneratedPosts([]);
    
    try {
      const normalizedPlatforms = platforms.map(p => p.toLowerCase());
      
      const { data, error } = await supabase.functions.invoke('generate-campaign', {
        body: { 
          topic, 
          platforms: normalizedPlatforms,
          duration: parseInt(duration), 
          tone 
        },
      });

      if (error) throw error;

      if (!data?.campaign || !Array.isArray(data.campaign)) {
        throw new Error('Invalid campaign data received');
      }

      const formattedPosts = data.campaign.map((post: any) => ({
        content: post.content.trim(),
        platform: post.platform.toLowerCase(),
        time: post.time,
      }));

      setGeneratedPosts(formattedPosts);
      setProgress(100);

      toast({
        title: "Campaign Generated",
        description: "Review your posts before scheduling",
      });
    } catch (error) {
      console.error('Error in handleGenerate:', error);
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

  const handleSchedule = () => {
    onGenerateCampaign(generatedPosts);
    onOpenChange(false);
    setTopic("");
    setPlatforms([]);
    setDuration("7");
    setTone("professional");
    setGeneratedPosts([]);
    setProgress(0);
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

          {isLoading && (
            <div className="space-y-2">
              <Progress value={progress} className="h-2" />
              <p className="text-sm text-muted-foreground text-center">
                Generating your campaign...
              </p>
            </div>
          )}

          {generatedPosts.length > 0 && (
            <div className="space-y-4">
              <h3 className="font-medium">Generated Posts</h3>
              {generatedPosts.map((post, index) => (
                <Card key={index}>
                  <CardContent className="pt-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <Badge>{post.platform}</Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRegeneratePost(index)}
                        disabled={isLoading}
                      >
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Regenerate
                      </Button>
                    </div>
                    <PlatformPreview
                      content={post.content}
                      selectedPlatforms={[post.platform]}
                    />
                    <div className="text-sm text-muted-foreground">
                      Scheduled for: {post.time}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Characters: {post.content.length} / {PLATFORM_LIMITS[post.platform as keyof typeof PLATFORM_LIMITS]}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          <div className="flex gap-4">
            <Button
              onClick={handleGenerate}
              className="flex-1"
              disabled={isLoading || !topic.trim() || platforms.length === 0}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Wand2 className="h-4 w-4 mr-2" />
              )}
              Generate Campaign
            </Button>
            {generatedPosts.length > 0 && (
              <Button
                onClick={handleSchedule}
                className="flex-1"
                disabled={isLoading}
              >
                Schedule All Posts
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}