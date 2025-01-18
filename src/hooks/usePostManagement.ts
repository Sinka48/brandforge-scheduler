import { useState } from "react";
import { format } from "date-fns";
import { usePostCreate } from "./post/usePostCreate";
import { usePostUpdate } from "./post/usePostUpdate";
import { usePostDelete } from "./post/usePostDelete";

export function usePostManagement() {
  const [posts, setPosts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { handleAddPost: createPost } = usePostCreate();
  const { handleUpdatePost: updatePost } = usePostUpdate();
  const { handleDeletePost: deletePost } = usePostDelete();

  const handleAddPost = async (selectedDate: Date | undefined) => {
    setIsLoading(true);
    try {
      const data = await createPost(selectedDate);
      if (data) {
        setPosts([...posts, {
          id: data.id,
          content: data.content,
          date: new Date(data.scheduled_for),
          platforms: [data.platform],
          image: data.image_url,
          status: data.status,
          time: format(new Date(data.scheduled_for), 'HH:mm'),
        }]);
      }
      return !!data;
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdatePost = async (postId: string, selectedDate: Date | undefined) => {
    setIsLoading(true);
    try {
      const success = await updatePost(postId, selectedDate);
      if (success) {
        // Refresh posts list
        const { data } = await supabase
          .from('posts')
          .select()
          .eq('id', postId)
          .single();
        
        if (data) {
          setPosts(posts.map(post => 
            post.id === postId ? {
              ...post,
              content: data.content,
              date: new Date(data.scheduled_for),
              platforms: [data.platform],
              image: data.image_url,
              status: data.status,
              time: format(new Date(data.scheduled_for), 'HH:mm'),
            } : post
          ));
        }
      }
      return success;
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeletePost = async (postId: string) => {
    setIsLoading(true);
    try {
      const success = await deletePost(postId);
      if (success) {
        setPosts(posts.filter(post => post.id !== postId));
      }
      return success;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    posts,
    setPosts,
    isLoading,
    handleAddPost,
    handleUpdatePost,
    handleDeletePost,
  };
}