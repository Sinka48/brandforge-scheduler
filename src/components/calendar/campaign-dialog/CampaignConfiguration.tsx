import { PlatformSelector } from "../post-dialog/PlatformSelector";
import { TimeSlotSelector } from "./TimeSlotSelector";
import { HashtagSelector } from "./HashtagSelector";
import { CampaignBasicInfo } from "./campaign-form/CampaignBasicInfo";
import { CampaignSettings } from "./campaign-form/CampaignSettings";

interface CampaignConfigurationProps {
  name: string;
  setName: (name: string) => void;
  topic: string;
  setTopic: (topic: string) => void;
  platforms: string[];
  onPlatformToggle: (platformId: string) => void;
  duration: string;
  setDuration: (duration: string) => void;
  tone: string;
  setTone: (tone: string) => void;
  timeSlots: any[];
  onTimeSlotsChange: (timeSlots: any[]) => void;
  hashtags: string[];
  onHashtagsChange: (hashtags: string[]) => void;
  suggestedHashtags: string[];
}

export function CampaignConfiguration({
  name,
  setName,
  topic,
  setTopic,
  platforms,
  onPlatformToggle,
  duration,
  setDuration,
  tone,
  setTone,
  timeSlots,
  onTimeSlotsChange,
  hashtags,
  onHashtagsChange,
  suggestedHashtags,
}: CampaignConfigurationProps) {
  return (
    <div className="space-y-4">
      <CampaignBasicInfo
        name={name}
        setName={setName}
        topic={topic}
        setTopic={setTopic}
      />

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

      <TimeSlotSelector
        timeSlots={timeSlots}
        onTimeSlotsChange={onTimeSlotsChange}
      />

      <HashtagSelector
        hashtags={hashtags}
        onHashtagsChange={onHashtagsChange}
        suggestedHashtags={suggestedHashtags}
      />
    </div>
  );
}