import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { RefreshCw, AlertCircle } from "lucide-react";
import { PlatformPreview } from "../post-dialog/PlatformPreview";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";

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
        <div className="space-y-4">
          <Progress value={progress} className="h-2" />
          <div className="grid gap-4">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-32 w-full" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <p className="text-sm text-muted-foreground text-center animate-pulse">
            Generating your campaign posts...
          </p>
        </div>
      )}

      {!isLoading && generatedPosts.length === 0 && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            No posts have been generated yet. Configure your campaign settings and click Generate.
          </AlertDescription>
        </Alert>
      )}

      {generatedPosts.length > 0 && (
        <div className="space-y-4">
          <h3 className="font-medium">Generated Posts</h3>
          <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 md:grid md:grid-cols-2 md:gap-4">
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
        </div>
      )}
    </div>
  );
}