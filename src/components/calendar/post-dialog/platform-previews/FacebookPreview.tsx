import { Card } from "@/components/ui/card";

interface FacebookPreviewProps {
  content: string;
  imageUrl?: string;
}

export function FacebookPreview({ content, imageUrl }: FacebookPreviewProps) {
  return (
    <Card className="max-w-[500px] p-4 space-y-3">
      <div className="flex items-center space-x-2">
        <div className="w-10 h-10 rounded-full bg-slate-200" />
        <div>
          <div className="font-semibold">Page Name</div>
          <div className="text-xs text-muted-foreground">Just now</div>
        </div>
      </div>
      <p className="text-sm">{content}</p>
      {imageUrl && (
        <img
          src={imageUrl}
          alt="Post preview"
          className="rounded-lg w-full object-cover max-h-[300px]"
        />
      )}
      <div className="flex items-center justify-between text-sm text-muted-foreground pt-2 border-t">
        <span>Like</span>
        <span>Comment</span>
        <span>Share</span>
      </div>
    </Card>
  );
}