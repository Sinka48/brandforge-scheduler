import { Textarea } from "@/components/ui/textarea";

interface PostContentProps {
  content: string;
  onContentChange: (content: string) => void;
}

export function PostContent({ content, onContentChange }: PostContentProps) {
  return (
    <Textarea
      placeholder="Write your post content..."
      value={content}
      onChange={(e) => onContentChange(e.target.value)}
      className="min-h-[100px]"
    />
  );
}