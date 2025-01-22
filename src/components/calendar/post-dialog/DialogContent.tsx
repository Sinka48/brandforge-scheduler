import * as React from "react";
import { PostContent } from "./PostContent";
import { PlatformSelector } from "./PlatformSelector";
import { ImageUploader } from "./ImageUploader";
import { TimeSelector } from "./TimeSelector";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Image, Upload, Sparkles, ImagePlus } from "lucide-react";
import { MediaLibrary } from "./MediaLibrary";
import { useState } from "react";
import { Input } from "@/components/ui/input";

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
  const [isMediaLibraryOpen, setIsMediaLibraryOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState("");

  const handleImageUrlSubmit = () => {
    if (imageUrl.trim()) {
      setNewPost({ ...newPost, image: imageUrl });
      setImageUrl("");
    }
  };

  return (
    <div className="space-y-3">
      {/* Platform Selector - Moved to top */}
      <div className="border-b pb-2">
        <PlatformSelector
          selectedPlatforms={newPost.platforms}
          onPlatformToggle={handlePlatformToggle}
        />
      </div>

      {/* Content Area */}
      <div className="py-2">
        <PostContent
          content={newPost.content}
          onContentChange={(content) => setNewPost({ ...newPost, content })}
          selectedPlatforms={newPost.platforms}
          imageUrl={newPost.image}
          onGenerateContent={onGenerateContent}
          isGenerating={isGenerating}
        />
      </div>

      {/* Image Section - Compact Layout */}
      <div className="space-y-2">
        {newPost.image && (
          <div className="relative w-full h-32 rounded-lg overflow-hidden">
            <img
              src={newPost.image}
              alt="Post preview"
              className="w-full h-full object-cover"
            />
            <Button
              variant="destructive"
              size="sm"
              className="absolute top-2 right-2"
              onClick={() => setNewPost({ ...newPost, image: "" })}
            >
              Remove
            </Button>
          </div>
        )}
        
        <div className="flex items-center gap-2">
          <Input
            placeholder="Enter image URL"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className="flex-1"
            size="sm"
          />
          <Button
            variant="outline"
            size="sm"
            onClick={handleImageUrlSubmit}
            disabled={!imageUrl.trim()}
          >
            <ImagePlus className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsMediaLibraryOpen(true)}
          >
            <Image className="h-4 w-4" />
          </Button>
          <ImageUploader
            imageUrl={newPost.image}
            onImageUrlChange={(image) => setNewPost({ ...newPost, image })}
          />
        </div>
      </div>

      {/* Date and Time Section - Moved to bottom */}
      <div className="space-y-2 pt-2 border-t">
        <div className="flex items-center gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className={cn(
                  "justify-start text-left font-normal",
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
      </div>

      <MediaLibrary
        isOpen={isMediaLibraryOpen}
        onClose={() => setIsMediaLibraryOpen(false)}
        onSelectImage={(url) => setNewPost({ ...newPost, image: url })}
      />
    </div>
  );
}