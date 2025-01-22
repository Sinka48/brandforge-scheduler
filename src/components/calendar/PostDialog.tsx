import { Dialog } from "@/components/ui/dialog";
import { DialogActions } from "./post-dialog/DialogActions";
import { usePostState } from "@/hooks/usePostState";
import { usePostCreate } from "@/hooks/post/usePostCreate";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { CalendarIcon, ImageIcon, Smartphone, Monitor, Sparkles } from "lucide-react";
import { PostContent } from "./post-dialog/PostContent";
import { ImageUploader } from "./post-dialog/ImageUploader";
import { TimeSelector } from "./post-dialog/TimeSelector";
import { HashtagSelector } from "./campaign-dialog/HashtagSelector";
import { PlatformSelector } from "./post-dialog/PlatformSelector";
import { PlatformPreview } from "./post-dialog/PlatformPreview";

interface PostDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  newPost: any;
  setNewPost: (post: any) => void;
  handleAddPost: () => void;
  handleSaveAsDraft: () => void;
  handlePlatformToggle: (platform: string) => void;
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
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDesktopPreview, setIsDesktopPreview] = useState(true);

  const handleGenerateContent = async () => {
    setIsGenerating(true);
    try {
      // Add your AI content generation logic here
      toast({
        title: "Content Generated",
        description: "Your post content has been generated successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate content. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const isDisabled = !newPost.content || newPost.platforms.length === 0;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50">
        <div className="fixed inset-4 bg-background rounded-lg shadow-lg flex flex-col max-w-7xl mx-auto">
          {/* Header */}
          <div className="p-4 border-b sticky top-0 bg-background z-10">
            <h2 className="text-2xl font-bold">{editMode ? "Edit Post" : "Create New Post"}</h2>
            <div className="mt-4">
              <PlatformSelector
                selectedPlatforms={newPost.platforms}
                onPlatformToggle={handlePlatformToggle}
              />
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-auto">
            <div className="flex h-full">
              {/* Preview Column */}
              <div className="w-1/2 p-4 border-r">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Preview</h3>
                  <div className="flex items-center space-x-2">
                    <Smartphone className={`w-5 h-5 ${!isDesktopPreview ? "text-primary" : "text-muted-foreground"}`} />
                    <Switch checked={isDesktopPreview} onCheckedChange={setIsDesktopPreview} />
                    <Monitor className={`w-5 h-5 ${isDesktopPreview ? "text-primary" : "text-muted-foreground"}`} />
                  </div>
                </div>
                <div className="bg-muted rounded-lg p-4 h-[calc(100%-2rem)] overflow-auto">
                  <div className={`transition-all ${isDesktopPreview ? "w-full" : "w-[375px] mx-auto"}`}>
                    <PlatformPreview
                      content={newPost.content}
                      selectedPlatforms={newPost.platforms}
                      imageUrl={newPost.image}
                    />
                  </div>
                </div>
              </div>

              {/* Editor Column */}
              <div className="w-1/2 p-4">
                <div className="space-y-4">
                  <PostContent
                    content={newPost.content}
                    onContentChange={(content) => setNewPost({ ...newPost, content })}
                    selectedPlatforms={newPost.platforms}
                    imageUrl={newPost.image}
                    onGenerateContent={handleGenerateContent}
                    isGenerating={isGenerating}
                  />

                  <div>
                    <ImageUploader
                      imageUrl={newPost.image}
                      onImageUrlChange={(image) => setNewPost({ ...newPost, image })}
                    />
                  </div>

                  <TimeSelector
                    time={newPost.time}
                    onTimeChange={(time) => setNewPost({ ...newPost, time })}
                    selectedPlatforms={newPost.platforms}
                  />

                  <HashtagSelector
                    hashtags={newPost.hashtags || []}
                    onHashtagsChange={(hashtags) => setNewPost({ ...newPost, hashtags })}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t sticky bottom-0 bg-background z-10">
            <div className="flex justify-between items-center">
              <Button variant="outline" onClick={handleGenerateContent} disabled={isGenerating}>
                <Sparkles className="mr-2 h-4 w-4" />
                {isGenerating ? "Generating..." : "Generate with AI"}
              </Button>
              <DialogActions
                onSaveAsDraft={handleSaveAsDraft}
                onAddPost={handleAddPost}
                onPublish={handleAddPost}
                isDisabled={isDisabled}
                editMode={editMode}
              />
            </div>
          </div>
        </div>
      </div>
    </Dialog>
  );
}