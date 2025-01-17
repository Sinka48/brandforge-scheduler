import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface TwitterPreviewProps {
  content: string;
  imageUrl?: string;
  remainingChars: number;
}

export function TwitterPreview({ content, imageUrl, remainingChars }: TwitterPreviewProps) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center text-sm text-muted-foreground">
        <span>Characters remaining: {remainingChars}</span>
        {remainingChars < 0 && (
          <Badge variant="destructive">Exceeds limit</Badge>
        )}
      </div>
      <Card className="max-w-[500px] p-4 space-y-3">
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 rounded-full bg-slate-200" />
          <div>
            <div className="font-semibold">Account Name</div>
            <div className="text-xs text-muted-foreground">@username</div>
          </div>
        </div>
        <p className="text-sm whitespace-pre-wrap">{content}</p>
        {imageUrl && (
          <img
            src={imageUrl}
            alt="Post preview"
            className="rounded-lg w-full object-cover max-h-[300px]"
          />
        )}
        <div className="flex items-center justify-between text-sm text-muted-foreground pt-2 border-t">
          <span>Reply</span>
          <span>Repost</span>
          <span>Like</span>
          <span>Share</span>
        </div>
      </Card>
    </div>
  );
}