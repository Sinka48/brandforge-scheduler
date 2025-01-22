import * as React from "react";
import { PostContent } from "./PostContent";
import { PlatformSelector } from "./PlatformSelector";
import { ImageUploader } from "./ImageUploader";
import { PlatformPreview } from "./PlatformPreview";
import { useIsMobile } from "@/hooks/use-mobile";

interface DialogContentProps {
  newPost: any;
  setNewPost: (post: any) => void;
  handlePlatformToggle: (platformId: string) => void;
  editMode?: boolean;
  onGenerateContent?: () => void;
  isGenerating?: boolean;
}

export function DialogContent({
  newPost,
  setNewPost,
  handlePlatformToggle,
  editMode = false,
  onGenerateContent,
  isGenerating = false
}: DialogContentProps) {
  const isMobile = useIsMobile();

  // Set Facebook as default platform if no platforms are selected
  React.useEffect(() => {
    if (newPost.platforms.length === 0) {
      handlePlatformToggle('facebook');
    }
  }, []);

  return (
    <div className="space-y-4 py-4">
      <div className={`grid ${isMobile ? 'grid-cols-1 gap-4' : 'grid-cols-2 gap-8'}`}>
        {/* Left Column - Preview */}
        <div>
          {newPost.platforms.length > 0 ? (
            <PlatformPreview 
              content={newPost.content}
              selectedPlatforms={newPost.platforms}
              imageUrl={newPost.image || "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d"}
            />
          ) : (
            <div className="rounded-lg border-2 border-dashed p-8 text-center text-muted-foreground">
              Select a platform to see preview
            </div>
          )}
        </div>

        {/* Right Column - Content & Settings */}
        <div className="space-y-4">
          <div className="space-y-4">
            <PostContent
              content={newPost.content}
              onContentChange={(content) => setNewPost({ ...newPost, content })}
              selectedPlatforms={newPost.platforms}
              imageUrl={newPost.image}
              onGenerateContent={onGenerateContent}
              isGenerating={isGenerating}
            />
            
            <div className="flex flex-wrap gap-2">
              <ImageUploader
                imageUrl={newPost.image}
                onImageUrlChange={(image) => setNewPost({ ...newPost, image })}
              />
            </div>

            <PlatformSelector
              selectedPlatforms={newPost.platforms}
              onPlatformToggle={handlePlatformToggle}
            />
          </div>
        </div>
      </div>
    </div>
  );
}