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
  return (
    <div className="space-y-4">
      {isLoading && (
        <div className="space-y-2">
          <Progress value={progress} className="h-2" />
          <p className="text-sm text-muted-foreground text-center">
            Generating your campaign...
          </p>
        </div>
      )}

      {generatedPosts.length > 0 && (
        <div className="space-y-4">
          <h3 className="font-medium">Generated Posts</h3>
          <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
            {generatedPosts.map((post, index) => (
              <Card key={index}>
                <CardContent className="pt-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <Badge>{post.platform}</Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onRegeneratePost(index)}
                      disabled={isLoading}
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
                  <div className="text-sm text-muted-foreground">
                    Scheduled for: {post.time}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}