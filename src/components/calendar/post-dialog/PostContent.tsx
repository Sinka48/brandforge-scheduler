import { Textarea } from "@/components/ui/textarea";
import { PlatformPreview } from "./PlatformPreview";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, CheckCircle, MinusCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface PostContentProps {
  content: string;
  onContentChange: (content: string) => void;
  selectedPlatforms: string[];
  imageUrl?: string;
}

export function PostContent({ content, onContentChange, selectedPlatforms, imageUrl }: PostContentProps) {
  const isThread = content.length > 280 && selectedPlatforms.includes('twitter');
  const getCharacterLimitInfo = () => {
    const limits = {
      twitter: 280,
      facebook: 63206,
      instagram: 2200,
      linkedin: 3000
    };

    return selectedPlatforms.map(platform => {
      const limit = limits[platform as keyof typeof limits];
      const remaining = limit - content.length;
      const isExceeded = remaining < 0;

      return {
        platform,
        remaining,
        isExceeded,
        limit
      };
    });
  };

  const characterInfo = getCharacterLimitInfo();
  const hasExceededLimits = characterInfo.some(info => info.isExceeded);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label htmlFor="content" className="text-sm font-medium">
          Post Content
        </label>
        <div className="flex items-center gap-2">
          {isThread && (
            <Badge variant="secondary">Twitter Thread</Badge>
          )}
          {characterInfo.map(({ platform, remaining, isExceeded, limit }) => (
            <div
              key={platform}
              className="flex items-center gap-1 text-sm"
              title={`${platform} limit: ${limit} characters`}
            >
              <span className="capitalize">{platform}:</span>
              <span className={isExceeded ? "text-destructive" : "text-muted-foreground"}>
                {remaining}
              </span>
              {isExceeded ? (
                <AlertCircle className="h-4 w-4 text-destructive" />
              ) : remaining < limit * 0.1 ? (
                <MinusCircle className="h-4 w-4 text-yellow-500" />
              ) : (
                <CheckCircle className="h-4 w-4 text-green-500" />
              )}
            </div>
          ))}
        </div>
      </div>
      <Textarea
        id="content"
        placeholder="What's on your mind?"
        value={content}
        onChange={(e) => onContentChange(e.target.value)}
        className={`min-h-[100px] ${hasExceededLimits ? 'border-destructive' : ''}`}
      />
      {hasExceededLimits && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Your content exceeds the character limit for one or more platforms
          </AlertDescription>
        </Alert>
      )}
      <PlatformPreview 
        content={content}
        selectedPlatforms={selectedPlatforms}
        imageUrl={imageUrl}
      />
    </div>
  );
}