import { useState } from "react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

interface NewPost {
  content: string;
  platforms: string[];
  image: string;
  time: string;
  status: 'scheduled' | 'draft';
}

export function usePostCreation() {
  const [newPost, setNewPost] = useState<NewPost>({
    content: '',
    platforms: [],
    image: '',
    time: format(new Date(), 'HH:mm'),
    status: 'scheduled',
  });
  const { toast } = useToast();

  const handleAddPost = async (selectedDate: Date | undefined) => {
    if (!selectedDate) {
      toast({
        title: "Error",
        description: "Please select a date first.",
        variant: "destructive",
      });
      return false;
    }
    
    if (!newPost.content) {
      toast({
        title: "Error",
        description: "Please enter some content for your post.",
        variant: "destructive",
      });
      return false;
    }

    if (newPost.platforms.length === 0) {
      toast({
        title: "Error",
        description: "Please select at least one platform.",
        variant: "destructive",
      });
      return false;
    }

    try {
      const { data, error } = await supabase
        .from('posts')
        .insert({
          content: newPost.content,
          platforms: newPost.platforms,
          image_url: newPost.image || null,
          scheduled_for: new Date(
            selectedDate.getFullYear(),
            selectedDate.getMonth(),
            selectedDate.getDate(),
            parseInt(newPost.time.split(':')[0]),
            parseInt(newPost.time.split(':')[1])
          ).toISOString(),
          status: 'scheduled'
        })
        .select()
        .single();

      if (error) throw error;

      setNewPost({
        content: '',
        platforms: [],
        image: '',
        time: format(new Date(), 'HH:mm'),
        status: 'scheduled',
      });
      
      toast({
        title: "Success",
        description: "Your post has been scheduled.",
      });

      return data;
    } catch (error) {
      console.error('Error scheduling post:', error);
      toast({
        title: "Error",
        description: "Failed to schedule post. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  };

  const handleSaveAsDraft = async (selectedDate: Date | undefined) => {
    if (!selectedDate) return false;
    
    try {
      const { data, error } = await supabase
        .from('posts')
        .insert({
          content: newPost.content,
          platforms: newPost.platforms,
          image_url: newPost.image || null,
          scheduled_for: new Date(
            selectedDate.getFullYear(),
            selectedDate.getMonth(),
            selectedDate.getDate(),
            parseInt(newPost.time.split(':')[0]),
            parseInt(newPost.time.split(':')[1])
          ).toISOString(),
          status: 'draft'
        })
        .select()
        .single();

      if (error) throw error;

      setNewPost({
        content: '',
        platforms: [],
        image: '',
        time: format(new Date(), 'HH:mm'),
        status: 'scheduled',
      });
      
      toast({
        title: "Draft Saved",
        description: "Your post has been saved as a draft.",
      });

      return data;
    } catch (error) {
      console.error('Error saving draft:', error);
      toast({
        title: "Error",
        description: "Failed to save draft. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  };

  const handlePlatformToggle = (platformId: string) => {
    setNewPost(prev => ({
      ...prev,
      platforms: prev.platforms.includes(platformId)
        ? prev.platforms.filter(id => id !== platformId)
        : [...prev.platforms, platformId]
    }));
  };

  return {
    newPost,
    setNewPost,
    handleAddPost,
    handleSaveAsDraft,
    handlePlatformToggle,
  };
}