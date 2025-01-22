import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { RefreshCw } from "lucide-react";
import { PlatformPreview } from "../post-dialog/PlatformPreview";

interface GeneratedContentProps {
  isLoading: boolean;
  progress: number;
  generatedPosts: any[];
  onRegeneratePost: (index: number) => void;
}

export function GeneratedContent({
  isLoading,
  progress,
  generatedPosts,
  onRegeneratePost,
}: GeneratedContentProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        <Progress value={progress} className="h-2" />
        <p className="text-sm text-muted-foreground text-center animate-pulse">
          Generating your campaign posts...
        </p>
      </div>
    );
  }

  if (generatedPosts.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      {generatedPosts.map((post, index) => (
        <Card key={index} className="transform transition-all duration-200 hover:shadow-lg">
          <CardContent className="pt-6 space-y-4">
            <div className="flex items-center justify-between">
              <Badge variant="outline" className="capitalize">
                {post.platform}
              </Badge>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onRegeneratePost(index)}
                disabled={isLoading}
                className="hover:bg-secondary"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Regenerate
              </Button>
            </div>
            <PlatformPreview
              content={post.content}
              selectedPlatforms={[post.platform]}
              imageUrl={post.imageUrl}
            />
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>Scheduled for: {post.time}</span>
              <Badge variant="secondary" className="ml-2">
                {post.status || 'draft'}
              </Badge>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}