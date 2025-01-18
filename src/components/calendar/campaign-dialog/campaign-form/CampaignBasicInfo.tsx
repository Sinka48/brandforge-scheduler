import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface CampaignBasicInfoProps {
  name: string;
  setName: (name: string) => void;
  topic: string;
  setTopic: (topic: string) => void;
}

export function CampaignBasicInfo({
  name,
  setName,
  topic,
  setTopic,
}: CampaignBasicInfoProps) {
  return (
    <>
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
    </>
  );
}