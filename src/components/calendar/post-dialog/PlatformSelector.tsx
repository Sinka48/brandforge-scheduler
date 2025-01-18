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
      <div className="grid grid-cols-2 gap-2 w-full">
        {platforms.map((platform) => {
          const isSelected = selectedPlatforms.includes(platform.id);
          const Icon = platform.icon;
          
          return (
            <Tooltip key={platform.id}>
              <TooltipTrigger asChild>
                <Button
                  variant={isSelected ? "default" : "outline"}
                  onClick={() => onPlatformToggle(platform.id)}
                  className="relative w-full h-10 px-4"
                >
                  <div className="flex items-center justify-center gap-2 w-full">
                    <Icon className="h-4 w-4" />
                    <span className="text-sm">{platform.name}</span>
                    {isSelected && (
                      <Badge 
                        variant="secondary" 
                        className="absolute -top-2 -right-2 h-4 w-4 p-0 flex items-center justify-center text-[10px]"
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