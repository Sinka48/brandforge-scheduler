import { Dialog, DialogContent } from "@/components/ui/dialog";
import { DialogHeader } from "./post-dialog/DialogHeader";
import { DialogActions } from "./post-dialog/DialogActions";
import { TemplateSection } from "./post-dialog/TemplateSection";
import { PlatformSelector } from "./post-dialog/PlatformSelector";
import { ImageUploader } from "./post-dialog/ImageUploader";
import { TimeSelector } from "./post-dialog/TimeSelector";
import { PostContent } from "./post-dialog/PostContent";
import { RecurringOptions } from "./post-dialog/RecurringOptions";
import { BulkScheduling } from "./post-dialog/BulkScheduling";

interface PostDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  newPost: {
    content: string;
    platforms: string[];
    image: string;
    time: string;
    status: 'scheduled' | 'draft';
    isRecurring?: boolean;
    recurringPattern?: string;
    recurringEndDate?: Date;
    bulkDates?: Date[];
  };
  setNewPost: (post: any) => void;
  handleAddPost: () => void;
  handleSaveAsDraft: () => void;
  handlePlatformToggle: (platformId: string) => void;
  selectedDate?: Date;
  editMode?: boolean;
}

export function PostDialog({
  isOpen,
  onOpenChange,
  newPost,
  setNewPost,
  handleAddPost,
  handleSaveAsDraft,
  handlePlatformToggle,
  selectedDate,
  editMode = false,
}: PostDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader editMode={editMode} selectedDate={selectedDate} />
        
        <div className="space-y-4 py-4">
          {!editMode && (
            <TemplateSection
              onSelectTemplate={(template) => {
                setNewPost({
                  ...newPost,
                  content: template.content,
                  platforms: template.platforms,
                  image: template.image_url || '',
                });
              }}
              content={newPost.content}
              platforms={newPost.platforms}
              imageUrl={newPost.image}
            />
          )}

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

          <DialogActions
            onSaveAsDraft={handleSaveAsDraft}
            onAddPost={handleAddPost}
            isDisabled={newPost.content.length === 0 || newPost.platforms.length === 0}
            editMode={editMode}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}