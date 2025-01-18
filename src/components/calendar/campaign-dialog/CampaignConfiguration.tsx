import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PlatformSelector } from "../post-dialog/PlatformSelector";
import { TimeSlotSelector } from "./TimeSlotSelector";
import { HashtagSelector } from "./HashtagSelector";

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
      <div className="space-y-2">
        <Label htmlFor="name">Campaign Name</Label>
        <Input
          id="name"
          placeholder="Enter campaign name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

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
        onPlatformToggle={onPlatformToggle}
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