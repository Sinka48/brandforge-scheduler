import { Dialog, DialogContent } from "@/components/ui/dialog";
import { DialogHeader } from "./post-dialog/DialogHeader";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Loader2, Save, Folder, Wand2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { SaveTemplateDialog } from "./campaign-dialog/SaveTemplateDialog";
import { LoadTemplateDialog } from "./campaign-dialog/LoadTemplateDialog";
import { useNavigate } from "react-router-dom";
import { CampaignConfiguration } from "./campaign-dialog/CampaignConfiguration";
import { GeneratedContent } from "./campaign-dialog/GeneratedContent";
import { addDays, parse, format } from "date-fns";

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
  const [name, setName] = useState("");
  const [topic, setTopic] = useState("");
  const [platforms, setPlatforms] = useState<string[]>([]);
  const [duration, setDuration] = useState("7");
  const [tone, setTone] = useState("professional");
  const [timeSlots, setTimeSlots] = useState<any[]>([]);
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
    if (!name.trim()) {
      toast({
        title: "Missing Information",
        description: "Please enter a campaign name",
        variant: "destructive",
      });
      return;
    }

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
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('Not authenticated');
      }

      const startDate = new Date(); // Campaign starts today
      const endDate = addDays(startDate, parseInt(duration));

      const { data: campaignData, error: campaignError } = await supabase
        .from('campaigns')
        .insert({
          name,
          description: topic,
          platforms: platforms.map(p => p.toLowerCase()),
          status: 'draft',
          start_date: startDate.toISOString(),
          end_date: endDate.toISOString(),
          settings: {
            duration,
            tone,
            timeSlots,
            hashtags
          },
          user_id: session.user.id
        })
        .select()
        .single();

      if (campaignError) throw campaignError;

      const { data, error } = await supabase.functions.invoke('generate-campaign', {
        body: { 
          topic,
          platforms: platforms.map(p => p.toLowerCase()),
          duration: parseInt(duration),
          tone,
          timeSlots,
          hashtags
        },
      });

      if (error) throw error;

      const postsToCreate = data.campaign.map((post: any) => {
        // Parse the time string (e.g., "09:00") into a Date object
        const timeDate = parse(post.time, 'HH:mm', new Date());
        
        // Create a new date for scheduling that combines the campaign start date with the time
        const scheduledDate = new Date(startDate);
        scheduledDate.setHours(timeDate.getHours());
        scheduledDate.setMinutes(timeDate.getMinutes());
        
        return {
          content: post.content,
          platform: post.platform.toLowerCase(),
          scheduled_for: scheduledDate.toISOString(),
          image_url: post.imageUrl,
          status: 'draft',
          campaign_id: campaignData.id,
          user_id: session.user.id
        };
      });

      const { error: postsError } = await supabase
        .from('posts')
        .insert(postsToCreate);

      if (postsError) throw postsError;

      setGeneratedPosts(data.campaign);
      setSuggestedHashtags(data.suggestedHashtags || []);
      setProgress(100);

      toast({
        title: "Campaign Created",
        description: "Campaign has been created successfully",
      });

      // Navigate to campaigns page after successful creation
      navigate('/campaigns');
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
    setPlatforms(template.platforms.map((p: string) => p.toLowerCase()));
    setDuration(template.duration.toString());
    setTone(template.tone);
    setTimeSlots(template.time_slots);
    setHashtags(template.hashtags);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[1000px] max-h-[90vh] flex flex-col">
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

          <div className="grid grid-cols-2 gap-6">
            <CampaignConfiguration
              name={name}
              setName={setName}
              topic={topic}
              setTopic={setTopic}
              platforms={platforms}
              onPlatformToggle={handlePlatformToggle}
              duration={duration}
              setDuration={setDuration}
              tone={tone}
              setTone={setTone}
              timeSlots={timeSlots}
              onTimeSlotsChange={setTimeSlots}
              hashtags={hashtags}
              onHashtagsChange={setHashtags}
              suggestedHashtags={suggestedHashtags}
            />

            <GeneratedContent
              isLoading={isLoading}
              progress={progress}
              generatedPosts={generatedPosts}
              onRegeneratePost={handleRegeneratePost}
            />
          </div>
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
        </div>

        <SaveTemplateDialog
          isOpen={isSaveTemplateOpen}
          onClose={() => setIsSaveTemplateOpen(false)}
          campaignData={{
            topic,
            platforms: platforms.map(p => p.toLowerCase()),
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