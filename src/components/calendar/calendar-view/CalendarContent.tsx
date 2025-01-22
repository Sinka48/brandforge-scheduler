import { Post } from "@/components/calendar/types";
import { PostList } from "../../calendar/PostList";
import { Button } from "@/components/ui/button";
import { Plus, Wand2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { PLATFORMS } from "@/constants/platforms";

interface CalendarContentProps {
  selectedDate: Date | undefined;
  posts: Post[];
  handleDeletePost: (postId: string) => void;
  handleEditPost: (post: Post) => void;
  handlePublishPost: (postId: string) => void;
  isLoading: boolean;
  onNewPost: () => void;
  onNewCampaign: () => void;
}

export function CalendarContent({
  selectedDate,
  posts,
  handleDeletePost,
  handleEditPost,
  handlePublishPost,
  isLoading,
  onNewPost,
  onNewCampaign,
}: CalendarContentProps) {
  return (
    <div className="p-4 md:p-6 space-y-4">
      <div className="flex items-center justify-end gap-2">
        <Button
          variant="outline"
          onClick={onNewCampaign}
          className="flex items-center gap-2"
        >
          <Wand2 className="h-4 w-4" />
          AI Campaign
          <Badge variant="secondary" className="ml-1 text-[10px] px-1 py-0">
            BETA
          </Badge>
        </Button>
        <Button onClick={onNewPost} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          New Post
        </Button>
      </div>

      <PostList
        selectedDate={selectedDate}
        posts={posts}
        platforms={PLATFORMS}
        handleDeletePost={handleDeletePost}
        handleEditPost={handleEditPost}
        handlePublishPost={handlePublishPost}
        isLoading={isLoading}
      />
    </div>
  );
}