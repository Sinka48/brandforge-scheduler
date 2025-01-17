import { Button } from "@/components/ui/button";
import { Instagram, Twitter, Facebook, Linkedin } from "lucide-react";

interface Platform {
  id: string;
  name: string;
  icon: React.ReactNode;
}

const platforms: Platform[] = [
  { id: 'instagram', name: 'Instagram', icon: <Instagram className="h-4 w-4" /> },
  { id: 'twitter', name: 'Twitter', icon: <Twitter className="h-4 w-4" /> },
  { id: 'facebook', name: 'Facebook', icon: <Facebook className="h-4 w-4" /> },
  { id: 'linkedin', name: 'LinkedIn', icon: <Linkedin className="h-4 w-4" /> },
];

interface PlatformSelectorProps {
  selectedPlatforms: string[];
  onPlatformToggle: (platformId: string) => void;
}

export function PlatformSelector({ selectedPlatforms, onPlatformToggle }: PlatformSelectorProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Platforms</label>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {platforms.map((platform) => (
          <Button
            key={platform.id}
            variant={selectedPlatforms.includes(platform.id) ? "default" : "outline"}
            size="sm"
            className="w-full justify-start"
            onClick={() => onPlatformToggle(platform.id)}
          >
            {platform.icon}
            <span className="ml-2">{platform.name}</span>
          </Button>
        ))}
      </div>
    </div>
  );
}