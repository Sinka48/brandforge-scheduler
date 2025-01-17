import { Textarea } from "@/components/ui/textarea";
import { PlatformPreview } from "./PlatformPreview";

interface PostContentProps {
  content: string;
  onContentChange: (content: string) => void;
  selectedPlatforms: string[];
}

export function PostContent({ content, onContentChange, selectedPlatforms }: PostContentProps) {
  return (
    <div className="space-y-2">
      <label htmlFor="content" className="text-sm font-medium">
        Post Content
      </label>
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
      />
    </div>
  );
}