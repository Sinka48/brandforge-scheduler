import { CampaignSettings } from "./campaign-form/CampaignSettings";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

interface CampaignConfigurationProps {
  platforms: string[];
  onPlatformToggle: (platformId: string) => void;
  duration: string;
  setDuration: (duration: string) => void;
  tone: string;
  setTone: (tone: string) => void;
  postsCount: number;
  setPostsCount: (count: number) => void;
}

export function CampaignConfiguration({
  duration,
  setDuration,
  tone,
  setTone,
  postsCount,
  setPostsCount,
}: CampaignConfigurationProps) {
  return (
    <div className="space-y-4">
      <CampaignSettings
        duration={duration}
        setDuration={setDuration}
        tone={tone}
        setTone={setTone}
      />

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="posts-count">Number of Posts</Label>
          <span className="text-sm text-muted-foreground">{postsCount}</span>
        </div>
        <Slider
          id="posts-count"
          min={1}
          max={20}
          step={1}
          value={[postsCount]}
          onValueChange={(value) => setPostsCount(value[0])}
          className="w-full"
        />
        <p className="text-xs text-muted-foreground">
          Optional: Specify how many posts you want to generate (default based on campaign duration)
        </p>
      </div>
    </div>
  );
}