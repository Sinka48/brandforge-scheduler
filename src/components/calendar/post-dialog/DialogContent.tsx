import * as React from "react";
import { PostContent } from "./PostContent";
import { PlatformSelector } from "./PlatformSelector";
import { ImageUploader } from "./ImageUploader";
import { PlatformPreview } from "./PlatformPreview";
import { useIsMobile } from "@/hooks/use-mobile";
import { TimeSelector } from "./TimeSelector";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface DialogContentProps {
  newPost: any;
  setNewPost: (post: any) => void;
  handlePlatformToggle: (platformId: string) => void;
  editMode?: boolean;
  onGenerateContent?: () => void;
  isGenerating?: boolean;
  previewMode: 'mobile' | 'desktop';
}

export function DialogContent({
  newPost,
  setNewPost,
  handlePlatformToggle,
  editMode = false,
  onGenerateContent,
  isGenerating = false,
  previewMode
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
        <div className={cn(
          "w-full",
          previewMode === 'mobile' ? 'max-w-[375px] mx-auto' : 'max-w-none'
        )}>
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
            <div className="space-y-4">
              <div className="flex items-center gap-4 flex-wrap">
                <div className="flex items-center gap-2">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-[180px] justify-start text-left font-normal",
                          !newPost.date && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {newPost.date ? format(newPost.date, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={newPost.date}
                        onSelect={(date) => setNewPost({ ...newPost, date })}
                        initialFocus
                        disabled={(date) => date < new Date()}
                      />
                    </PopoverContent>
                  </Popover>
                  <TimeSelector
                    time={newPost.time}
                    onTimeChange={(time) => setNewPost({ ...newPost, time })}
                    selectedPlatforms={newPost.platforms}
                  />
                </div>
              </div>

              <PostContent
                content={newPost.content}
                onContentChange={(content) => setNewPost({ ...newPost, content })}
                selectedPlatforms={newPost.platforms}
                imageUrl={newPost.image}
                onGenerateContent={onGenerateContent}
                isGenerating={isGenerating}
              />
            </div>
            
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