import { useToast } from "@/hooks/use-toast";
import { usePostState } from "./usePostState";
import { usePostActions } from "./usePostActions";
import { format } from "date-fns";

export function usePostCreation() {
  const { newPost, setNewPost, handlePlatformToggle } = usePostState();
  const { createPost } = usePostActions();
  const { toast } = useToast();

  const handleAddPost = async (selectedDate: Date | undefined) => {
    const result = await createPost(newPost, selectedDate);
    if (result) {
      setNewPost({
        content: '',
        platforms: [],
        image: '',
        time: format(new Date(), 'HH:mm'),
        status: 'scheduled',
      });
      return result;
    }
    return false;
  };

  const handleSaveAsDraft = async (selectedDate: Date | undefined) => {
    const result = await createPost(
      { ...newPost, status: 'draft' },
      selectedDate
    );
    if (result) {
      setNewPost({
        content: '',
        platforms: [],
        image: '',
        time: format(new Date(), 'HH:mm'),
        status: 'scheduled',
      });
      return result;
    }
    return false;
  };

  return {
    newPost,
    setNewPost,
    handleAddPost,
    handleSaveAsDraft,
    handlePlatformToggle,
  };
}