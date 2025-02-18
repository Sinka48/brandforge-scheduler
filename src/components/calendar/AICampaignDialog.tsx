
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Loader2, Wand2, Save } from "lucide-react";
import { GeneratedContent } from "./campaign-dialog/GeneratedContent";
import { useBrandFetching } from "@/hooks/useBrandFetching";
import { CampaignForm } from "./campaign-dialog/CampaignForm";
import { useCampaignGeneration } from "./hooks/useCampaignGeneration";

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
  const [name, setName] = useState("");
  const [goal, setGoal] = useState("");
  const [platforms, setPlatforms] = useState<string[]>([]);
  const [duration, setDuration] = useState("7");
  const [tone, setTone] = useState("professional");
  const [postsCount, setPostsCount] = useState(7);
  const [selectedBrandId, setSelectedBrandId] = useState<string>("");
  
  const { brands } = useBrandFetching();
  const {
    isLoading,
    progress,
    generatedPosts,
    generateCampaign,
    saveCampaign,
    regeneratePost,
    setGeneratedPosts,
    setCampaignId
  } = useCampaignGeneration();

  const handlePlatformToggle = (platformId: string) => {
    setPlatforms(prev =>
      prev.includes(platformId)
        ? prev.filter(p => p !== platformId)
        : [...prev, platformId]
    );
  };

  const handleGenerate = () => {
    generateCampaign({
      name,
      goal,
      platforms,
      duration,
      tone,
      postsCount,
      selectedBrandId,
      brands,
    });
  };

  const handleSave = async () => {
    await saveCampaign();
    onOpenChange(false);
  };

  const handleRegeneratePost = async (index: number) => {
    await regeneratePost(index, goal, platforms);
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

          <div className="flex-1 overflow-y-auto p-4">
            <CampaignForm
              brands={brands}
              selectedBrandId={selectedBrandId}
              setSelectedBrandId={setSelectedBrandId}
              platforms={platforms}
              onPlatformToggle={handlePlatformToggle}
              name={name}
              setName={setName}
              goal={goal}
              setGoal={setGoal}
              duration={duration}
              setDuration={setDuration}
              tone={tone}
              setTone={setTone}
              postsCount={postsCount}
              setPostsCount={setPostsCount}
            />
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
                disabled={isLoading || !name.trim() || !goal || platforms.length === 0 || !selectedBrandId}
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
