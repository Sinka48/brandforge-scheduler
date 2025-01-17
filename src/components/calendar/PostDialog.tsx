import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Calendar } from "lucide-react";
import { format } from "date-fns";
import { PlatformSelector } from "./post-dialog/PlatformSelector";
import { ImageUploader } from "./post-dialog/ImageUploader";
import { TimeSelector } from "./post-dialog/TimeSelector";
import { PostContent } from "./post-dialog/PostContent";
import { RecurringOptions } from "./post-dialog/RecurringOptions";
import { BulkScheduling } from "./post-dialog/BulkScheduling";
import { SaveTemplateDialog } from "./post-dialog/SaveTemplateDialog";
import { TemplateSelector } from "./post-dialog/TemplateSelector";

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
        <DialogHeader>
          <DialogTitle>{editMode ? 'Edit Post' : 'Create New Post'}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            {selectedDate ? format(selectedDate, 'MMMM d, yyyy') : 'Select a date'}
          </div>

          {!editMode && (
            <div className="flex gap-2">
              <TemplateSelector
                onSelectTemplate={(template) => {
                  setNewPost({
                    ...newPost,
                    content: template.content,
                    platforms: template.platforms,
                    image: template.image_url || '',
                  });
                }}
              />
              <SaveTemplateDialog
                content={newPost.content}
                platforms={newPost.platforms}
                imageUrl={newPost.image}
              />
            </div>
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

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={handleSaveAsDraft}>
              Save as Draft
            </Button>
            <Button 
              onClick={handleAddPost}
              disabled={newPost.content.length === 0 || newPost.platforms.length === 0}
            >
              {editMode ? 'Update Post' : 'Schedule Post'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}