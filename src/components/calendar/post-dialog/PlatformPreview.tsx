import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FacebookPreview } from "./platform-previews/FacebookPreview";
import { TwitterPreview } from "./platform-previews/TwitterPreview";
import { InstagramPreview } from "./platform-previews/InstagramPreview";
import { LinkedinPreview } from "./platform-previews/LinkedinPreview";

interface PlatformLimits {
  maxLength: number;
  name: string;
}

const PLATFORM_LIMITS: Record<string, PlatformLimits> = {
  twitter: { maxLength: 280, name: 'Twitter' },
  facebook: { maxLength: 63206, name: 'Facebook' },
  instagram: { maxLength: 2200, name: 'Instagram' },
  linkedin: { maxLength: 3000, name: 'LinkedIn' },
};

interface PlatformPreviewProps {
  content: string;
  selectedPlatforms: string[];
  imageUrl?: string;
}

export function PlatformPreview({ content, selectedPlatforms, imageUrl }: PlatformPreviewProps) {
  const getValidationIssues = () => {
    return selectedPlatforms.map(platform => {
      const limit = PLATFORM_LIMITS[platform];
      if (!limit) return null;
      
      if (content.length > limit.maxLength) {
        return {
          platform: limit.name,
          issue: `Content exceeds ${limit.name}'s ${limit.maxLength} character limit`
        };
      }
      return null;
    }).filter(Boolean);
  };

  const issues = getValidationIssues();

  if (selectedPlatforms.length === 0) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Select at least one platform to see the preview
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-4">
      {issues.length > 0 && issues.map((issue, index) => (
        <Alert variant="destructive" key={index}>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {issue?.issue}
          </AlertDescription>
        </Alert>
      ))}

      <Tabs defaultValue={selectedPlatforms[0]} className="w-full">
        <TabsList className="w-full">
          {selectedPlatforms.map(platform => (
            <TabsTrigger
              key={platform}
              value={platform}
              className="flex-1"
            >
              {PLATFORM_LIMITS[platform]?.name}
            </TabsTrigger>
          ))}
        </TabsList>
        {selectedPlatforms.map(platform => (
          <TabsContent key={platform} value={platform} className="mt-4">
            {platform === 'facebook' && (
              <FacebookPreview content={content} imageUrl={imageUrl} />
            )}
            {platform === 'twitter' && (
              <TwitterPreview content={content} imageUrl={imageUrl} />
            )}
            {platform === 'instagram' && (
              <InstagramPreview content={content} imageUrl={imageUrl} />
            )}
            {platform === 'linkedin' && (
              <LinkedinPreview content={content} imageUrl={imageUrl} />
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}