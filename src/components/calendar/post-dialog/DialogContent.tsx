import * as React from "react";
import { PostContent } from "./PostContent";
import { PlatformSelector } from "./PlatformSelector";
import { ImageUploader } from "./ImageUploader";
import { TimeSelector } from "./TimeSelector";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { GoalSelector } from "./GoalSelector";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Image, ImagePlus, Sparkles } from "lucide-react";
import { MediaLibrary } from "./MediaLibrary";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

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
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const { toast } = useToast();

  const handleImageUrlSubmit = () => {
    if (imageUrl.trim()) {
      setNewPost({ ...newPost, image: imageUrl });
      setImageUrl("");
    }
  };

  const handleGenerateImage = async () => {
    if (!newPost.content.trim()) {
      toast({
        title: "Content Required",
        description: "Please add some content to generate an image.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsGeneratingImage(true);
      const { data, error } = await supabase.functions.invoke('generate-post-image', {
        body: { prompt: newPost.content }
      });

      if (error) throw error;

      setNewPost({ ...newPost, image: data.image });
      toast({
        title: "Success",
        description: "Image generated successfully!",
      });
    } catch (error) {
      console.error('Error generating image:', error);
      toast({
        title: "Error",
        description: "Failed to generate image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingImage(false);
    }
  };

  return (
    <div className="space-y-3">
      {/* Platform Selector */}
      <div className="border-b pb-2">
        <PlatformSelector
          selectedPlatforms={newPost.platforms}
          onPlatformToggle={handlePlatformToggle}
        />
      </div>

      {/* Goal Selector */}
      <div className="py-2 border-b">
        <GoalSelector
          selectedGoal={newPost.goal}
          onGoalSelect={(goal) => setNewPost({ ...newPost, goal })}
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
          <div className="relative w-full h-24 rounded-lg overflow-hidden">
            <img
              src={newPost.image}
              alt="Post preview"
              className="w-full h-full object-cover"
            />
            <Button
              variant="destructive"
              size="sm"
              className="absolute top-1 right-1 h-6 text-xs"
              onClick={() => setNewPost({ ...newPost, image: "" })}
            >
              Remove
            </Button>
          </div>
        )}
        
        <div className="flex items-center gap-1.5">
          <Input
            placeholder="Enter image URL"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className="flex-1 h-8 text-xs"
            size="sm"
          />
          <Button
            variant="outline"
            size="sm"
            onClick={handleImageUrlSubmit}
            disabled={!imageUrl.trim()}
            className="h-8 text-xs"
          >
            <ImagePlus className="h-3 w-3 mr-1" />
            Add
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsMediaLibraryOpen(true)}
            className="h-8 text-xs"
          >
            <Image className="h-3 w-3 mr-1" />
            Gallery
          </Button>
          <ImageUploader
            imageUrl={newPost.image}
            onImageUrlChange={(image) => setNewPost({ ...newPost, image })}
          />
          <Button
            variant="outline"
            size="sm"
            onClick={handleGenerateImage}
            disabled={isGeneratingImage}
            className="h-8 text-xs whitespace-nowrap"
          >
            <Sparkles className="h-3 w-3 mr-1" />
            {isGeneratingImage ? "Generating..." : "Generate Image"}
          </Button>
        </div>
      </div>

      {/* Date and Time Section */}
      <div className="space-y-2 pt-2 border-t">
        <div className="flex items-center gap-1.5">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className={cn(
                  "justify-start text-left font-normal h-8 text-xs",
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