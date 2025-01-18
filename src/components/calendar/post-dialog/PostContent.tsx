import { Textarea } from "@/components/ui/textarea";
import { PlatformPreview } from "./PlatformPreview";
import { Badge } from "@/components/ui/badge";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { PLATFORM_LIMITS } from "./platform-previews/types";

interface PostContentProps {
  content: string;
  onContentChange: (content: string) => void;
  selectedPlatforms: string[];
  imageUrl?: string;
}

export function PostContent({ 
  content, 
  onContentChange, 
  selectedPlatforms,
  imageUrl 
}: PostContentProps) {
  const getMinCharLimit = () => {
    return Math.min(...selectedPlatforms.map(p => 
      PLATFORM_LIMITS[p as keyof typeof PLATFORM_LIMITS]?.maxLength || Infinity
    ));
  };

  const charLimit = getMinCharLimit();
  const remainingChars = charLimit - content.length;
  const isExceeded = remainingChars < 0;

  return (
    <div className="space-y-2">
      <Textarea
        placeholder="What's on your mind?"
        value={content}
        onChange={(e) => onContentChange(e.target.value)}
        className={`min-h-[100px] resize-none ${isExceeded ? 'border-destructive' : ''}`}
      />

      {isExceeded && (
        <Alert variant="destructive" className="mt-2">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Your content exceeds the character limit for one or more platforms
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}