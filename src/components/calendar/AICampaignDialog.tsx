import { Dialog, DialogContent } from "@/components/ui/dialog";
import { DialogHeader } from "./post-dialog/DialogHeader";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { Loader2, RefreshCw, Save, Folder, Wand2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { PlatformSelector } from "./post-dialog/PlatformSelector";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TimeSlotSelector } from "./campaign-dialog/TimeSlotSelector";
import { HashtagSelector } from "./campaign-dialog/HashtagSelector";
import { SaveTemplateDialog } from "./campaign-dialog/SaveTemplateDialog";
import { LoadTemplateDialog } from "./campaign-dialog/LoadTemplateDialog";
import { PlatformPreview } from "./post-dialog/PlatformPreview";

interface AICampaignDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onGenerateCampaign: (posts: any[]) => void;
}

interface TimeSlot {
  time: string;
  days: string[];
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
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [suggestedHashtags, setSuggestedHashtags] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [generatedPosts, setGeneratedPosts] = useState<any[]>([]);
  const [isSaveTemplateOpen, setIsSaveTemplateOpen] = useState(false);
  const [isLoadTemplateOpen, setIsLoadTemplateOpen] = useState(false);
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
          tone,
          timeSlots,
          hashtags 
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
      const { data, error } = await supabase.functions.invoke('generate-campaign', {
        body: { 
          topic,
          platforms,
          duration: parseInt(duration),
          tone,
          timeSlots,
          hashtags
        },
      });

      if (error) throw error;

      setGeneratedPosts(data.campaign);
      setSuggestedHashtags(data.suggestedHashtags || []);
      setProgress(100);

      toast({
        title: "Campaign Generated",
        description: "Review your posts before scheduling",
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

  const handleLoadTemplate = (template: any) => {
    setTopic(template.topic);
    setPlatforms(template.platforms);
    setDuration(template.duration.toString());
    setTone(template.tone);
    setTimeSlots(template.time_slots);
    setHashtags(template.hashtags);
  };

  const handleSchedule = () => {
    onGenerateCampaign(generatedPosts);
    onOpenChange(false);
    setTopic("");
    setPlatforms([]);
    setDuration("7");
    setTone("professional");
    setTimeSlots([]);
    setHashtags([]);
    setGeneratedPosts([]);
    setProgress(0);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] flex flex-col">
        <DialogHeader editMode={false} selectedDate={undefined} />
        
        <div className="space-y-6 py-4 flex-1 overflow-y-auto">
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setIsLoadTemplateOpen(true)}
            >
              <Folder className="h-4 w-4 mr-2" />
              Load Template
            </Button>
            <Button
              variant="outline"
              onClick={() => setIsSaveTemplateOpen(true)}
              disabled={!topic.trim()}
            >
              <Save className="h-4 w-4 mr-2" />
              Save as Template
            </Button>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="topic">Campaign Topic</Label>
              <Textarea
                id="topic"
                placeholder="What is your campaign about?"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
              />
            </div>

            <PlatformSelector
              selectedPlatforms={platforms}
              onPlatformToggle={handlePlatformToggle}
            />

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

            <TimeSlotSelector
              timeSlots={timeSlots}
              onTimeSlotsChange={setTimeSlots}
            />

            <HashtagSelector
              hashtags={hashtags}
              onHashtagsChange={setHashtags}
              suggestedHashtags={suggestedHashtags}
            />
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
                      imageUrl={post.imageUrl}
                    />
                    <div className="text-sm text-muted-foreground">
                      Scheduled for: {post.time}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        <div className="flex gap-4 pt-4 border-t">
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

        <SaveTemplateDialog
          isOpen={isSaveTemplateOpen}
          onClose={() => setIsSaveTemplateOpen(false)}
          campaignData={{
            topic,
            platforms,
            duration,
            tone,
            timeSlots,
            hashtags,
          }}
        />

        <LoadTemplateDialog
          isOpen={isLoadTemplateOpen}
          onClose={() => setIsLoadTemplateOpen(false)}
          onSelectTemplate={handleLoadTemplate}
        />
      </DialogContent>
    </Dialog>
  );
}