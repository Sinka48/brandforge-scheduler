import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface InstagramPreviewProps {
  content: string;
  imageUrl?: string;
  hashtags: string[];
}

export function InstagramPreview({ content, imageUrl, hashtags }: InstagramPreviewProps) {
  const MAX_HASHTAGS = 30;
  const hasExcessiveHashtags = hashtags.length > MAX_HASHTAGS;

  return (
    <div className="space-y-2">
      {hasExcessiveHashtags && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Instagram allows a maximum of {MAX_HASHTAGS} hashtags. You're using {hashtags.length}.
          </AlertDescription>
        </Alert>
      )}

      {hashtags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {hashtags.map((tag, index) => (
            <Badge 
              key={index} 
              variant={index >= MAX_HASHTAGS ? "destructive" : "secondary"}
            >
              {tag}
            </Badge>
          ))}
        </div>
      )}

      <Card className="max-w-[500px] space-y-3">
        <div className="p-4 pb-0">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-slate-200" />
            <div className="font-semibold">username</div>
          </div>
        </div>
        {imageUrl ? (
          <img
            src={imageUrl}
            alt="Post preview"
            className="w-full aspect-square object-cover"
          />
        ) : (
          <div className="w-full aspect-square bg-slate-100 flex items-center justify-center text-muted-foreground">
            No image selected
          </div>
        )}
        <div className="px-4 space-y-2">
          <div className="flex items-center justify-between text-xl">
            <div className="flex space-x-4">
              <span>♡</span>
              <span>💬</span>
              <span>↪</span>
            </div>
            <span>⋮</span>
          </div>
          <p className="text-sm">
            <span className="font-semibold">username</span> {content}
          </p>
          {hashtags.length > 0 && (
            <p className="text-sm text-blue-500">
              {hashtags.join(' ')}
            </p>
          )}
        </div>
      </Card>
    </div>
  );
}