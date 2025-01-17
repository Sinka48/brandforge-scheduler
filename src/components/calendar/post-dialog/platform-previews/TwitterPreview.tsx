import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, CheckCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface TwitterPreviewProps {
  content: string;
  imageUrl?: string;
  remainingChars: number;
}

export function TwitterPreview({ content, imageUrl, remainingChars }: TwitterPreviewProps) {
  const isThread = content.length > 280;
  const threadParts = isThread ? splitIntoThreads(content) : [content];
  const hasValidHashtags = content.includes('#') ? /\B#[a-zA-Z0-9]+\b/.test(content) : true;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center text-sm">
        <div className="flex items-center gap-2">
          <span className={remainingChars < 0 ? "text-destructive" : "text-muted-foreground"}>
            {remainingChars < 0 ? "Exceeds limit by" : "Characters remaining:"} {Math.abs(remainingChars)}
          </span>
          {isThread && (
            <Badge variant="secondary">Thread: {threadParts.length} tweets</Badge>
          )}
        </div>
        {remainingChars >= 0 && !isThread && (
          <CheckCircle className="h-4 w-4 text-green-500" />
        )}
      </div>

      {!hasValidHashtags && content.includes('#') && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Invalid hashtag format detected. Hashtags should start with # and contain only letters and numbers.
          </AlertDescription>
        </Alert>
      )}

      {isThread ? (
        <div className="space-y-2">
          {threadParts.map((part, index) => (
            <TweetCard
              key={index}
              content={part}
              imageUrl={index === 0 ? imageUrl : undefined}
              threadInfo={`${index + 1}/${threadParts.length}`}
            />
          ))}
        </div>
      ) : (
        <TweetCard content={content} imageUrl={imageUrl} />
      )}
    </div>
  );
}

function TweetCard({ content, imageUrl, threadInfo }: { content: string, imageUrl?: string, threadInfo?: string }) {
  return (
    <Card className="p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 rounded-full bg-slate-200" />
          <div>
            <div className="font-semibold">Account Name</div>
            <div className="text-xs text-muted-foreground">@username</div>
          </div>
        </div>
        {threadInfo && (
          <Badge variant="outline">{threadInfo}</Badge>
        )}
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
  );
}

function splitIntoThreads(content: string): string[] {
  const maxLength = 280;
  const words = content.split(' ');
  const threads: string[] = [];
  let currentThread = '';

  words.forEach((word) => {
    if ((currentThread + ' ' + word).length <= maxLength) {
      currentThread += (currentThread ? ' ' : '') + word;
    } else {
      threads.push(currentThread);
      currentThread = word;
    }
  });

  if (currentThread) {
    threads.push(currentThread);
  }

  return threads;
}