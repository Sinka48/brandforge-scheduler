import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface CampaignSettingsProps {
  duration: string;
  setDuration: (duration: string) => void;
  tone: string;
  setTone: (tone: string) => void;
}

export function CampaignSettings({
  duration,
  setDuration,
  tone,
  setTone,
}: CampaignSettingsProps) {
  return (
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
  );
}