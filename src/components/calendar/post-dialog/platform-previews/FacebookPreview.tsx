import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useState } from "react";

interface FacebookPreviewProps {
  content: string;
  imageUrl?: string;
}

export function FacebookPreview({ content, imageUrl }: FacebookPreviewProps) {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  const handleImageError = () => {
    setImageError(true);
    setImageLoading(false);
  };

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  return (
    <Card className="max-w-[500px] p-4 space-y-3">
      <div className="flex items-center space-x-2">
        <div className="w-10 h-10 rounded-full bg-slate-200 animate-pulse" />
        <div>
          <div className="font-semibold">Page Name</div>
          <div className="text-xs text-muted-foreground">Just now · 🌎</div>
        </div>
      </div>
      <p className="text-sm whitespace-pre-wrap">{content}</p>
      {imageUrl && (
        <div className="relative">
          {imageLoading && (
            <Skeleton className="w-full aspect-video rounded-lg" />
          )}
          {imageError ? (
            <Alert variant="destructive" className="mt-2">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Failed to load image. Please check the URL and try again.
              </AlertDescription>
            </Alert>
          ) : (
            <img
              src={imageUrl}
              alt="Post preview"
              className={`w-full rounded-lg object-cover max-h-[300px] transition-opacity duration-200 ${
                imageLoading ? 'opacity-0' : 'opacity-100'
              }`}
              onError={handleImageError}
              onLoad={handleImageLoad}
            />
          )}
        </div>
      )}
      <div className="flex items-center justify-between text-sm text-muted-foreground pt-2 border-t">
        <span>Like</span>
        <span>Comment</span>
        <span>Share</span>
      </div>
    </Card>
  );
}