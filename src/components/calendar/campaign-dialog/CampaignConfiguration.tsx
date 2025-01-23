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
  duration,
  setDuration,
  tone,
  setTone,
}: CampaignConfigurationProps) {
  return (
    <div className="space-y-4">
      <CampaignSettings
        duration={duration}
        setDuration={setDuration}
        tone={tone}
        setTone={setTone}
      />
    </div>
  );
}