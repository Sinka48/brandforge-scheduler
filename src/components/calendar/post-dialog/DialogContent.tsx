import * as React from "react";
import { PostContent } from "./PostContent";
import { PlatformSelector } from "./PlatformSelector";
import { ImageUploader } from "./ImageUploader";
import { TimeSelector } from "./TimeSelector";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

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
  return (
    <div className="space-y-6">
      {/* Platform & Date/Time Row */}
      <div className="flex items-center gap-4">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-[240px] justify-start text-left font-normal",
                !newPost.date && "text-muted-foreground"
              )}
            >
              {newPost.date ? format(newPost.date, "PPP") : "Pick a date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={newPost.date}
              onSelect={(date) => setNewPost({ ...newPost, date })}
              initialFocus
            />
          </PopoverContent>
        </Popover>
        
        <TimeSelector
          time={newPost.time}
          onTimeChange={(time) => setNewPost({ ...newPost, time })}
          selectedPlatforms={newPost.platforms}
        />
      </div>

      {/* Content Area */}
      <PostContent
        content={newPost.content}
        onContentChange={(content) => setNewPost({ ...newPost, content })}
        selectedPlatforms={newPost.platforms}
        imageUrl={newPost.image}
        onGenerateContent={onGenerateContent}
        isGenerating={isGenerating}
      />

      {/* Media Upload */}
      <div className="border-2 border-dashed rounded-lg p-4">
        <ImageUploader
          imageUrl={newPost.image}
          onImageUrlChange={(image) => setNewPost({ ...newPost, image })}
        />
      </div>

      {/* Platform Selector */}
      <div className="pt-4 border-t">
        <PlatformSelector
          selectedPlatforms={newPost.platforms}
          onPlatformToggle={handlePlatformToggle}
        />
      </div>
    </div>
  );
}