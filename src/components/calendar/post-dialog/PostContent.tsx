import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { PLATFORM_LIMITS } from "./platform-previews/types";

interface PostContentProps {
  content: string;
  onContentChange: (content: string) => void;
  selectedPlatforms: string[];
  imageUrl?: string;
  onGenerateContent?: () => void;
  isGenerating?: boolean;
}

export function PostContent({ 
  content, 
  onContentChange, 
  selectedPlatforms,
  imageUrl,
  onGenerateContent,
  isGenerating = false
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
    <div className="space-y-4">
      <Textarea
        placeholder="Write your post..."
        value={content}
        onChange={(e) => onContentChange(e.target.value)}
        className={`min-h-[100px] resize-none ${isExceeded ? 'border-destructive' : ''}`}
      />

      <Button 
        variant="outline" 
        className="w-full flex items-center gap-2"
        onClick={onGenerateContent}
        disabled={isGenerating}
      >
        <Sparkles className="h-4 w-4" />
        {isGenerating ? "Generating..." : "Generate Content"}
      </Button>

      {isExceeded && (
        <Alert variant="destructive" className="mt-2">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Content exceeds character limit
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}