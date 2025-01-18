import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, Sparkles } from "lucide-react";
import { PostContent } from "./PostContent";
import { PlatformSelector } from "./PlatformSelector";
import { ImageUploader } from "./ImageUploader";
import { TimeSelector } from "./TimeSelector";
import { RecurringOptions } from "./RecurringOptions";
import { BulkScheduling } from "./BulkScheduling";
import { Button } from "@/components/ui/button";
import { PlatformPreview } from "./PlatformPreview";
import { useIsMobile } from "@/hooks/use-mobile";

interface DialogContentProps {
  newPost: any;
  setNewPost: (post: any) => void;
  handlePlatformToggle: (platformId: string) => void;
  editMode?: boolean;
}

export function DialogContent({
  newPost,
  setNewPost,
  handlePlatformToggle,
  editMode = false
}: DialogContentProps) {
  const isMobile = useIsMobile();

  return (
    <div className="space-y-4 py-4">
      <div className="flex items-center gap-2 mb-4">
        <Button 
          variant="outline" 
          size="sm"
          className="flex items-center gap-2"
          onClick={() => setNewPost({ ...newPost, isQuickPost: true })}
        >
          <Sparkles className="h-4 w-4" />
          Quick Post
        </Button>
      </div>

      <div className={`grid ${isMobile ? 'grid-cols-1 gap-4' : 'grid-cols-2 gap-8'}`}>
        {/* Left Column - Preview */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Preview</h3>
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
            />
            
            <div className="flex flex-wrap gap-2">
              <TimeSelector
                time={newPost.time}
                onTimeChange={(time) => setNewPost({ ...newPost, time })}
                selectedPlatforms={newPost.platforms}
              />
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

          {!newPost.isQuickPost && (
            <Collapsible>
              <CollapsibleTrigger className="flex items-center gap-2 text-sm text-muted-foreground">
                <ChevronDown className="h-4 w-4" />
                Advanced Options
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-4 pt-4">
                {!editMode && !newPost.isRecurring && (
                  <BulkScheduling
                    selectedDates={newPost.bulkDates || []}
                    onDatesChange={(dates) => setNewPost({ ...newPost, bulkDates: dates })}
                  />
                )}

                {!editMode && (
                  <RecurringOptions
                    isRecurring={newPost.isRecurring || false}
                    onIsRecurringChange={(isRecurring) => {
                      setNewPost({ 
                        ...newPost, 
                        isRecurring,
                        bulkDates: isRecurring ? undefined : newPost.bulkDates 
                      });
                    }}
                    pattern={newPost.recurringPattern || 'daily'}
                    onPatternChange={(pattern) => setNewPost({ ...newPost, recurringPattern: pattern })}
                    endDate={newPost.recurringEndDate}
                    onEndDateChange={(date) => setNewPost({ ...newPost, recurringEndDate: date })}
                  />
                )}
              </CollapsibleContent>
            </Collapsible>
          )}
        </div>
      </div>
    </div>
  );
}