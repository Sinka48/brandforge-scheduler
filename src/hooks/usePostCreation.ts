import { format } from "date-fns";
import { usePostState } from "./usePostState";
import { usePostActions } from "./usePostActions";

export function usePostCreation() {
  const { newPost, setNewPost, handlePlatformToggle } = usePostState();
  const { createPost, saveDraft } = usePostActions();

  const handleAddPost = async (selectedDate: Date | undefined) => {
    const success = await createPost(newPost, selectedDate);
    if (success) {
      setNewPost({
        content: '',
        platforms: [],
        image: '',
        time: format(new Date(), 'HH:mm'),
        status: 'scheduled',
      });
    }
    return success;
  };

  const handleSaveAsDraft = async (selectedDate: Date | undefined) => {
    const success = await saveDraft(newPost, selectedDate);
    if (success) {
      setNewPost({
        content: '',
        platforms: [],
        image: '',
        time: format(new Date(), 'HH:mm'),
        status: 'draft',
      });
    }
    return success;
  };

  return {
    newPost,
    setNewPost,
    handleAddPost,
    handleSaveAsDraft,
    handlePlatformToggle,
  };
}