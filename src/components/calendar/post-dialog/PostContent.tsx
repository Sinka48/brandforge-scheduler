import { Textarea } from "@/components/ui/textarea";

interface PostContentProps {
  content: string;
  onContentChange: (content: string) => void;
}

export function PostContent({ content, onContentChange }: PostContentProps) {
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
    </div>
  );
}