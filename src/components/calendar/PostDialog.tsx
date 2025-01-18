import { Dialog, DialogContent } from "@/components/ui/dialog";
import { DialogHeader } from "./post-dialog/DialogHeader";
import { DialogActions } from "./post-dialog/DialogActions";
import { PlatformSelector } from "./post-dialog/PlatformSelector";
import { ImageUploader } from "./post-dialog/ImageUploader";
import { TimeSelector } from "./post-dialog/TimeSelector";
import { PostContent } from "./post-dialog/PostContent";
import { RecurringOptions } from "./post-dialog/RecurringOptions";
import { BulkScheduling } from "./post-dialog/BulkScheduling";
import { BrandManager } from "../brand/BrandManager";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Palette } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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
    brandId?: string;
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
  const { toast } = useToast();

  const handleSubmit = () => {
    if (newPost.platforms.length === 0) {
      toast({
        title: "Error",
        description: "Please select at least one platform.",
        variant: "destructive",
      });
      return;
    }
    handleAddPost();
  };

  const handleDraftSubmit = () => {
    if (newPost.platforms.length === 0) {
      toast({
        title: "Error",
        description: "Please select at least one platform.",
        variant: "destructive",
      });
      return;
    }
    handleSaveAsDraft();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader editMode={editMode} selectedDate={selectedDate} />
        
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

        <DialogActions
          onSaveAsDraft={handleDraftSubmit}
          onAddPost={handleSubmit}
          isDisabled={newPost.content.length === 0}
          editMode={editMode}
        />
      </DialogContent>
    </Dialog>
  );
}