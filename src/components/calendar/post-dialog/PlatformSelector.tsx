import { Button } from "@/components/ui/button";
import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const platforms = [
  {
    id: 'facebook',
    name: 'Facebook',
    icon: Facebook,
    description: 'Share updates, photos, and stories with your Facebook audience',
  },
  {
    id: 'twitter',
    name: 'Twitter',
    icon: Twitter,
    description: 'Share quick updates and engage with your Twitter followers',
  },
  {
    id: 'instagram',
    name: 'Instagram',
    icon: Instagram,
    description: 'Share visual content and stories on Instagram',
  },
  {
    id: 'linkedin',
    name: 'LinkedIn',
    icon: Linkedin,
    description: 'Share professional updates with your LinkedIn network',
  },
];

interface PlatformSelectorProps {
  selectedPlatforms: string[];
  onPlatformToggle: (platformId: string) => void;
}

export function PlatformSelector({ selectedPlatforms, onPlatformToggle }: PlatformSelectorProps) {
  return (
    <TooltipProvider>
      <div className="flex flex-wrap gap-2">
        {platforms.map((platform) => {
          const isSelected = selectedPlatforms.includes(platform.id);
          const Icon = platform.icon;
          
          return (
            <Tooltip key={platform.id}>
              <TooltipTrigger asChild>
                <Button
                  variant={isSelected ? "default" : "outline"}
                  onClick={() => onPlatformToggle(platform.id)}
                  className="relative h-8 px-3"
                  size="sm"
                >
                  <div className="flex items-center gap-1.5">
                    <Icon className="h-3.5 w-3.5" />
                    <span className="text-xs">{platform.name}</span>
                    {isSelected && (
                      <Badge 
                        variant="secondary" 
                        className="absolute -top-1.5 -right-1.5 h-3 w-3 p-0 flex items-center justify-center text-[8px]"
                      >
                        ✓
                      </Badge>
                    )}
                  </div>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs text-muted-foreground">{platform.description}</p>
              </TooltipContent>
            </Tooltip>
          );
        })}
      </div>
    </TooltipProvider>
  );
}