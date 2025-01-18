import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Palette } from "lucide-react";
import { BrandManager } from "../../brand/BrandManager";
import { PostContent } from "./PostContent";
import { PlatformSelector } from "./PlatformSelector";
import { ImageUploader } from "./ImageUploader";
import { TimeSelector } from "./TimeSelector";
import { RecurringOptions } from "./RecurringOptions";
import { BulkScheduling } from "./BulkScheduling";

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
  return (
    <Tabs defaultValue="content" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="content">Content</TabsTrigger>
        <TabsTrigger value="brand" className="flex items-center gap-2">
          <Palette className="h-4 w-4" />
          Brand
        </TabsTrigger>
      </TabsList>

      <TabsContent value="content">
        <div className="space-y-4 py-4">
          {!editMode && !newPost.isRecurring && (
            <BulkScheduling
              selectedDates={newPost.bulkDates || []}
              onDatesChange={(dates) => setNewPost({ ...newPost, bulkDates: dates })}
            />
          )}

          <PostContent
            content={newPost.content}
            onContentChange={(content) => setNewPost({ ...newPost, content })}
            selectedPlatforms={newPost.platforms}
            imageUrl={newPost.image}
          />
          
          <PlatformSelector
            selectedPlatforms={newPost.platforms}
            onPlatformToggle={handlePlatformToggle}
          />

          <ImageUploader
            imageUrl={newPost.image}
            onImageUrlChange={(image) => setNewPost({ ...newPost, image })}
          />

          <TimeSelector
            time={newPost.time}
            onTimeChange={(time) => setNewPost({ ...newPost, time })}
            selectedPlatforms={newPost.platforms}
          />

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
        </div>
      </TabsContent>

      <TabsContent value="brand">
        <div className="space-y-4 py-4">
          <BrandManager
            selectedBrandId={newPost.brandId}
            onSelectBrand={(brand) => {
              setNewPost({
                ...newPost,
                brandId: brand.id,
                image: brand.url,
              });
            }}
          />
        </div>
      </TabsContent>
    </Tabs>
  );
}