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
  isRecurring?: boolean;
  recurringPattern?: string;
  recurringEndDate?: Date;
}

export function usePostCreation() {
  const [newPost, setNewPost] = useState<NewPost>({
    content: '',
    platforms: [],
    image: '',
    time: format(new Date(), 'HH:mm'),
    status: 'scheduled',
    isRecurring: false,
    recurringPattern: 'daily',
  });
  const { toast } = useToast();

  const createRecurringPosts = async (parentPostId: string, basePost: any, selectedDate: Date) => {
    const endDate = newPost.recurringEndDate;
    if (!endDate) return;

    const interval = newPost.recurringPattern || 'daily';
    let currentDate = new Date(selectedDate);
    
    while (currentDate <= endDate) {
      // Skip the first date as it's already created as the parent post
      if (currentDate.getTime() === selectedDate.getTime()) {
        // Move to next date based on interval
        switch (interval) {
          case 'daily':
            currentDate.setDate(currentDate.getDate() + 1);
            break;
          case 'weekly':
            currentDate.setDate(currentDate.getDate() + 7);
            break;
          case 'monthly':
            currentDate.setMonth(currentDate.getMonth() + 1);
            break;
        }
        continue;
      }

      // Create child post
      for (const platform of newPost.platforms) {
        const scheduledTime = new Date(
          currentDate.getFullYear(),
          currentDate.getMonth(),
          currentDate.getDate(),
          parseInt(newPost.time.split(':')[0]),
          parseInt(newPost.time.split(':')[1])
        );

        await supabase
          .from('posts')
          .insert({
            content: newPost.content,
            platform: platform,
            image_url: newPost.image || null,
            scheduled_for: scheduledTime.toISOString(),
            status: 'scheduled',
            is_recurring: true,
            recurrence_pattern: interval,
            recurrence_end_date: endDate.toISOString(),
            parent_post_id: parentPostId
          });
      }

      // Move to next date based on interval
      switch (interval) {
        case 'daily':
          currentDate.setDate(currentDate.getDate() + 1);
          break;
        case 'weekly':
          currentDate.setDate(currentDate.getDate() + 7);
          break;
        case 'monthly':
          currentDate.setMonth(currentDate.getMonth() + 1);
          break;
      }
    }
  };

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
      // Create parent post
      const { data: parentPost, error: parentError } = await supabase
        .from('posts')
        .insert({
          content: newPost.content,
          platform: newPost.platforms[0], // First platform for parent post
          image_url: newPost.image || null,
          scheduled_for: new Date(
            selectedDate.getFullYear(),
            selectedDate.getMonth(),
            selectedDate.getDate(),
            parseInt(newPost.time.split(':')[0]),
            parseInt(newPost.time.split(':')[1])
          ).toISOString(),
          status: 'scheduled',
          is_recurring: newPost.isRecurring,
          recurrence_pattern: newPost.isRecurring ? newPost.recurringPattern : null,
          recurrence_end_date: newPost.isRecurring ? newPost.recurringEndDate?.toISOString() : null
        })
        .select()
        .single();

      if (parentError) throw parentError;

      // Create posts for additional platforms
      for (let i = 1; i < newPost.platforms.length; i++) {
        await supabase
          .from('posts')
          .insert({
            content: newPost.content,
            platform: newPost.platforms[i],
            image_url: newPost.image || null,
            scheduled_for: new Date(
              selectedDate.getFullYear(),
              selectedDate.getMonth(),
              selectedDate.getDate(),
              parseInt(newPost.time.split(':')[0]),
              parseInt(newPost.time.split(':')[1])
            ).toISOString(),
            status: 'scheduled',
            is_recurring: newPost.isRecurring,
            recurrence_pattern: newPost.isRecurring ? newPost.recurringPattern : null,
            recurrence_end_date: newPost.isRecurring ? newPost.recurringEndDate?.toISOString() : null,
            parent_post_id: parentPost.id
          });
      }

      // If this is a recurring post, create the series
      if (newPost.isRecurring && newPost.recurringEndDate) {
        await createRecurringPosts(parentPost.id, parentPost, selectedDate);
      }

      setNewPost({
        content: '',
        platforms: [],
        image: '',
        time: format(new Date(), 'HH:mm'),
        status: 'scheduled',
        isRecurring: false,
        recurringPattern: 'daily',
      });
      
      toast({
        title: "Success",
        description: newPost.isRecurring 
          ? "Your recurring posts have been scheduled."
          : "Your post has been scheduled.",
      });

      return parentPost;
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
          platform: newPost.platforms[0],
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
        isRecurring: false,
        recurringPattern: 'daily',
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