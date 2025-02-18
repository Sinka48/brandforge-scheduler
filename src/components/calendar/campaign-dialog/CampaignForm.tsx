
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PlatformSelector } from "../post-dialog/PlatformSelector";
import { CampaignConfiguration } from "./CampaignConfiguration";
import { Brand } from "@/types/brand";

interface CampaignFormProps {
  brands: Brand[];
  selectedBrandId: string;
  setSelectedBrandId: (id: string) => void;
  platforms: string[];
  onPlatformToggle: (platformId: string) => void;
  name: string;
  setName: (name: string) => void;
  goal: string;
  setGoal: (goal: string) => void;
  duration: string;
  setDuration: (duration: string) => void;
  tone: string;
  setTone: (tone: string) => void;
  postsCount: number;
  setPostsCount: (count: number) => void;
}

export function CampaignForm({
  brands,
  selectedBrandId,
  setSelectedBrandId,
  platforms,
  onPlatformToggle,
  name,
  setName,
  goal,
  setGoal,
  duration,
  setDuration,
  tone,
  setTone,
  postsCount,
  setPostsCount,
}: CampaignFormProps) {
  // Filter brands to only show user-generated ones (where regeneration_type is null)
  const userGeneratedBrands = brands.filter(brand => !brand.metadata.regeneration_type);

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="brand">Select Brand</Label>
        <Select value={selectedBrandId} onValueChange={setSelectedBrandId}>
          <SelectTrigger>
            <SelectValue placeholder="Choose a brand" />
          </SelectTrigger>
          <SelectContent>
            {userGeneratedBrands.map((brand) => (
              <SelectItem key={brand.id} value={brand.id}>
                {brand.metadata?.name || "Unnamed Brand"}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="platforms">Social Media Platforms</Label>
        <PlatformSelector
          selectedPlatforms={platforms}
          onPlatformToggle={onPlatformToggle}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="name">Campaign Name or Idea</Label>
        <Input
          id="name"
          placeholder="Enter your campaign name or main idea"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="goal">Campaign Goal</Label>
        <Select value={goal} onValueChange={setGoal}>
          <SelectTrigger>
            <SelectValue placeholder="Select campaign goal" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="awareness">Raise Brand Awareness</SelectItem>
            <SelectItem value="engagement">Boost Engagement</SelectItem>
            <SelectItem value="traffic">Drive Website Traffic</SelectItem>
            <SelectItem value="leads">Generate Leads</SelectItem>
            <SelectItem value="sales">Increase Sales</SelectItem>
            <SelectItem value="loyalty">Build Customer Loyalty</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <CampaignConfiguration
        platforms={platforms}
        onPlatformToggle={onPlatformToggle}
        duration={duration}
        setDuration={setDuration}
        tone={tone}
        setTone={setTone}
        postsCount={postsCount}
        setPostsCount={setPostsCount}
      />
    </div>
  );
}
