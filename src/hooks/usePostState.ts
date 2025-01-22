import { useState } from "react";
import { format } from "date-fns";

interface Post {
  content: string;
  platforms: string[];
  image: string;
  time: string;
  status: 'scheduled' | 'draft';
  isRecurring?: boolean;
  recurringPattern?: string;
  recurringEndDate?: Date;
  bulkDates?: Date[];
  date: Date;
}

export function usePostState() {
  const now = new Date();
  
  const [newPost, setNewPost] = useState<Post>({
    content: '',
    platforms: [],
    image: '',
    time: format(now, 'HH:mm'),
    status: 'scheduled',
    date: now // Initialize with current date
  });

  const handlePlatformToggle = (platformId: string) => {
    setNewPost(prev => ({
      ...prev,
      platforms: prev.platforms.includes(platformId)
        ? prev.platforms.filter(p => p !== platformId)
        : [...prev.platforms, platformId]
    }));
  };

  return {
    newPost,
    setNewPost,
    handlePlatformToggle
  };
}