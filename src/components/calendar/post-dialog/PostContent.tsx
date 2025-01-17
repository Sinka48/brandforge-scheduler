import { Textarea } from "@/components/ui/textarea";
import { PlatformPreview } from "./PlatformPreview";
import { Badge } from "@/components/ui/badge";

interface PostContentProps {
  content: string;
  onContentChange: (content: string) => void;
  selectedPlatforms: string[];
  imageUrl?: string;
}

export function PostContent({ content, onContentChange, selectedPlatforms, imageUrl }: PostContentProps) {
  const isThread = content.length > 280 && selectedPlatforms.includes('twitter');

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label htmlFor="content" className="text-sm font-medium">
          Post Content
        </label>
        {isThread && (
          <Badge variant="secondary">Twitter Thread</Badge>
        )}
      </div>
      <Textarea
        id="content"
        placeholder="What's on your mind?"
        value={content}
        onChange={(e) => onContentChange(e.target.value)}
        className="min-h-[100px]"
      />
      <div className="text-xs text-muted-foreground">
        {content.length} characters
      </div>
      <PlatformPreview 
        content={content}
        selectedPlatforms={selectedPlatforms}
        imageUrl={imageUrl}
      />
    </div>
  );
}