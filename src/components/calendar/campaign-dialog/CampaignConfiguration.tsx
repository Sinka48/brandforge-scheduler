import { PlatformSelector } from "../post-dialog/PlatformSelector";
import { CampaignSettings } from "./campaign-form/CampaignSettings";

interface CampaignConfigurationProps {
  platforms: string[];
  onPlatformToggle: (platformId: string) => void;
  duration: string;
  setDuration: (duration: string) => void;
  tone: string;
  setTone: (tone: string) => void;
}

export function CampaignConfiguration({
  platforms,
  onPlatformToggle,
  duration,
  setDuration,
  tone,
  setTone,
}: CampaignConfigurationProps) {
  return (
    <div className="space-y-4">
      <PlatformSelector
        selectedPlatforms={platforms}
        onPlatformToggle={onPlatformToggle}
      />

      <CampaignSettings
        duration={duration}
        setDuration={setDuration}
        tone={tone}
        setTone={setTone}
      />
    </div>
  );
}