import * as React from "react";
import { PostContent } from "./PostContent";
import { PlatformSelector } from "./PlatformSelector";
import { ImageUploader } from "./ImageUploader";
import { TimeSelector } from "./TimeSelector";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { MessageSquare, Heart, Share2, Sparkles } from "lucide-react";
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
    <div className="grid grid-cols-2 gap-6 h-full">
      {/* Left Column - Preview */}
      <div className="border rounded-lg p-4 bg-background">
        <div className="space-y-4">
          {/* Profile Section */}
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10" />
            <div>
              <p className="font-semibold">Profile Name</p>
              <p className="text-sm text-muted-foreground">Just now</p>
            </div>
          </div>

          {/* Content */}
          <div className="space-y-4">
            <p className="text-sm">{newPost.content || "Your post content will appear here"}</p>
            
            {/* Image Preview */}
            {newPost.image && (
              <img 
                src={newPost.image} 
                alt="Post preview" 
                className="rounded-lg w-full object-cover max-h-[300px]"
              />
            )}

            {/* Engagement Buttons */}
            <div className="flex items-center gap-4 pt-2 border-t">
              <Button variant="ghost" size="sm" className="gap-2">
                <Heart className="h-4 w-4" />
                Like
              </Button>
              <Button variant="ghost" size="sm" className="gap-2">
                <MessageSquare className="h-4 w-4" />
                Comment
              </Button>
              <Button variant="ghost" size="sm" className="gap-2">
                <Share2 className="h-4 w-4" />
                Share
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column - Editor */}
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

        {/* AI Generation Button */}
        <Button 
          variant="outline" 
          className="w-full gap-2"
          onClick={onGenerateContent}
          disabled={isGenerating}
        >
          <Sparkles className="h-4 w-4" />
          {isGenerating ? "Generating..." : "Generate with AI"}
        </Button>

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
    </div>
  );
}