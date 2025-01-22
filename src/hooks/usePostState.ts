import { useState } from 'react';
import { PlatformId } from '@/constants/platforms';
import { format } from 'date-fns';

interface Post {
  content: string;
  platforms: PlatformId[];
  image: string;
  time: string;
  status: 'draft' | 'scheduled';
  date: Date;
}

export function usePostState() {
  const [newPost, setNewPost] = useState<Post>({
    content: '',
    platforms: [],
    image: '',
    time: format(new Date(), 'HH:mm'),
    status: 'draft',
    date: new Date()
  });

  const handlePlatformToggle = (platform: PlatformId) => {
    setNewPost(prev => ({
      ...prev,
      platforms: prev.platforms.includes(platform)
        ? prev.platforms.filter(p => p !== platform)
        : [...prev.platforms, platform]
    }));
  };

  return {
    newPost,
    setNewPost,
    handlePlatformToggle
  };
}