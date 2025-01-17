import { useState } from "react";
import { usePostCreation } from "./usePostCreation";
import { usePostDeletion } from "./usePostDeletion";

interface Post {
  id: string;
  content: string;
  date: Date;
  platforms: string[];
  image?: string;
  status: 'draft' | 'scheduled';
  time?: string;
}

export function usePostManagement() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { newPost, setNewPost, handleAddPost, handleSaveAsDraft, handlePlatformToggle } = usePostCreation();
  const { handleDeletePost: deletePost } = usePostDeletion();

  const handleDeletePost = async (postId: string) => {
    setIsLoading(true);
    try {
      const success = await deletePost(postId);
      if (success) {
        setPosts(posts.filter(post => post.id !== postId));
      }
    } finally {
      setIsLoading(false);
    }
  };

  return {
    posts,
    setPosts,
    isLoading,
    newPost,
    setNewPost,
    handleAddPost: async (selectedDate: Date | undefined) => {
      setIsLoading(true);
      try {
        const newPostData = await handleAddPost(selectedDate);
        if (newPostData) {
          setPosts([...posts, {
            ...newPostData,
            date: new Date(newPostData.scheduled_for),
            image: newPostData.image_url,
          }]);
          return true;
        }
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    handleSaveAsDraft: async (selectedDate: Date | undefined) => {
      setIsLoading(true);
      try {
        const newPostData = await handleSaveAsDraft(selectedDate);
        if (newPostData) {
          setPosts([...posts, {
            ...newPostData,
            date: new Date(newPostData.scheduled_for),
            image: newPostData.image_url,
          }]);
          return true;
        }
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    handleDeletePost,
    handlePlatformToggle,
  };
}