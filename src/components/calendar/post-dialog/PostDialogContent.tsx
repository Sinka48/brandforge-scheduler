import { useState } from "react";
import { PostContent } from "./PostContent";
import { PlatformSelector } from "./PlatformSelector";
import { ImageUploader } from "./ImageUploader";
import { PlatformPreview } from "./PlatformPreview";
import { TimeSelector } from "./TimeSelector";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { CalendarIcon, Monitor, Smartphone } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { HashtagSelector } from "../campaign-dialog/HashtagSelector";

interface PostDialogContentProps {
  newPost: any;
  setNewPost: (post: any) => void;
  handlePlatformToggle: (platform: string) => void;
  editMode?: boolean;
  onGenerateContent?: () => void;
  isGenerating?: boolean;
}

export function PostDialogContent({
  newPost,
  setNewPost,
  handlePlatformToggle,
  editMode = false,
  onGenerateContent,
  isGenerating = false
}: PostDialogContentProps) {
  const [isDesktopPreview, setIsDesktopPreview] = useState(true);

  return (
    <div className="fixed inset-4 bg-background rounded-lg shadow-lg flex flex-col max-w-7xl mx-auto">
      {/* Header */}
      <div className="p-4 border-b sticky top-0 bg-background z-10">
        <h2 className="text-2xl font-bold">{editMode ? 'Edit Post' : 'Create New Post'}</h2>
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
              <div className={cn(
                "mx-auto transition-all",
                isDesktopPreview ? "w-full" : "w-[375px]"
              )}>
                {newPost.platforms.length > 0 ? (
                  <PlatformPreview 
                    content={newPost.content}
                    selectedPlatforms={newPost.platforms}
                    imageUrl={newPost.image}
                  />
                ) : (
                  <div className="rounded-lg border-2 border-dashed p-8 text-center text-muted-foreground">
                    Select a platform to see preview
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Editor Column */}
          <div className="w-1/2 p-4">
            <div className="space-y-4">
              <div className="flex items-center gap-4 flex-wrap">
                <div className="flex items-center gap-2 w-full">
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

              <div>
                <Label>Upload Image</Label>
                <ImageUploader
                  imageUrl={newPost.image}
                  onImageUrlChange={(image) => setNewPost({ ...newPost, image })}
                />
              </div>

              <HashtagSelector
                hashtags={newPost.hashtags || []}
                onHashtagsChange={(hashtags) => setNewPost({ ...newPost, hashtags })}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}