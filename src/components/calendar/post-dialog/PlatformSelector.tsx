import { Button } from "@/components/ui/button";
import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const platforms = [
  {
    id: 'facebook',
    name: 'Facebook',
    icon: <Facebook className="h-4 w-4" />,
    description: 'Share with your Facebook audience',
  },
  {
    id: 'twitter',
    name: 'Twitter',
    icon: <Twitter className="h-4 w-4" />,
    description: 'Tweet to your followers',
  },
  {
    id: 'instagram',
    name: 'Instagram',
    icon: <Instagram className="h-4 w-4" />,
    description: 'Share visual content on Instagram',
  },
  {
    id: 'linkedin',
    name: 'LinkedIn',
    icon: <Linkedin className="h-4 w-4" />,
    description: 'Connect with professionals',
  },
];

interface PlatformSelectorProps {
  selectedPlatforms: string[];
  onPlatformToggle: (platformId: string) => void;
}

export function PlatformSelector({ selectedPlatforms, onPlatformToggle }: PlatformSelectorProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Select Platforms</label>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {platforms.map((platform) => {
          const isSelected = selectedPlatforms.includes(platform.id);
          return (
            <Button
              key={platform.id}
              variant={isSelected ? "default" : "outline"}
              onClick={() => onPlatformToggle(platform.id)}
              className="justify-start h-auto py-3"
            >
              <div className="flex items-start gap-3">
                <div className="mt-1">{platform.icon}</div>
                <div className="text-left">
                  <div className="font-medium flex items-center gap-2">
                    {platform.name}
                    {isSelected && (
                      <Badge variant="secondary" className="ml-auto">
                        Selected
                      </Badge>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {platform.description}
                  </div>
                </div>
              </div>
            </Button>
          );
        })}
      </div>
    </div>
  );
}