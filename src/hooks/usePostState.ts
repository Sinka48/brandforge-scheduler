import { useState } from "react";
import { format } from "date-fns";

interface NewPost {
  content: string;
  platforms: string[];
  image: string;
  time: string;
  status: 'scheduled' | 'draft';
  isRecurring?: boolean;
  recurringPattern?: string;
  recurringEndDate?: Date;
  bulkDates?: Date[];
}

export function usePostState() {
  const [newPost, setNewPost] = useState<NewPost>({
    content: '',
    platforms: [],
    image: '',
    time: format(new Date(), 'HH:mm'),
    status: 'scheduled',
    isRecurring: false,
    recurringPattern: 'daily',
    bulkDates: [],
  });

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
    handlePlatformToggle,
  };
}