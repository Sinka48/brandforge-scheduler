import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FacebookPreview } from "./platform-previews/FacebookPreview";
import { TwitterPreview } from "./platform-previews/TwitterPreview";
import { InstagramPreview } from "./platform-previews/InstagramPreview";
import { LinkedinPreview } from "./platform-previews/LinkedinPreview";
import { PLATFORM_LIMITS } from "./platform-previews/types";
import { getValidationIssues } from "./platform-previews/utils";
import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

interface PlatformPreviewProps {
  content: string;
  selectedPlatforms: string[];
  imageUrl?: string;
}

const platformComponents = {
  facebook: {
    icon: Facebook,
    component: FacebookPreview
  },
  twitter: {
    icon: Twitter,
    component: TwitterPreview
  },
  instagram: {
    icon: Instagram,
    component: InstagramPreview
  },
  linkedin: {
    icon: Linkedin,
    component: LinkedinPreview
  }
};

export function PlatformPreview({ content, selectedPlatforms, imageUrl }: PlatformPreviewProps) {
  const issues = getValidationIssues(content, selectedPlatforms);

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
      {issues && issues.length > 0 && issues.map((issue: any, index: number) => (
        <Alert variant="destructive" key={index}>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {issue.issue}
          </AlertDescription>
        </Alert>
      ))}

      <Tabs defaultValue={selectedPlatforms[0]} className="w-full">
        <TabsList className="w-full">
          {selectedPlatforms.map(platform => {
            const platformConfig = platformComponents[platform as keyof typeof platformComponents];
            if (!platformConfig) return null;
            const Icon = platformConfig.icon;
            return (
              <TabsTrigger
                key={platform}
                value={platform}
                className="flex-1"
              >
                <Icon className="h-4 w-4" />
              </TabsTrigger>
            );
          })}
        </TabsList>
        {selectedPlatforms.map(platform => {
          const platformConfig = platformComponents[platform as keyof typeof platformComponents];
          if (!platformConfig) return null;
          const PreviewComponent = platformConfig.component;
          
          let props: any = { content, imageUrl };
          
          if (platform === 'twitter') {
            props.remainingChars = PLATFORM_LIMITS.twitter.maxLength - content.length;
          }
          
          if (platform === 'instagram') {
            props.hashtags = content.match(/#[a-zA-Z0-9]+/g) || [];
          }
          
          return (
            <TabsContent key={platform} value={platform} className="mt-4">
              <PreviewComponent {...props} />
            </TabsContent>
          );
        })}
      </Tabs>
    </div>
  );
}