import { Card } from "@/components/ui/card";
import { PostList } from "../PostList";
import { PlatformId, PLATFORMS } from "@/constants/platforms";
import { Post } from "../types";
import { LucideIcon } from "lucide-react";

interface Platform {
  id: PlatformId;
  name: string;
  icon: LucideIcon;
}

interface CalendarContentProps {
  posts: Post[];
  selectedDate: Date | undefined;
  handleDeletePost: (postId: string) => void;
  handleEditPost: (post: Post) => void;
  handlePublishPost: (postId: string) => void;
  isLoading: boolean;
  onNewPost: () => void;
  onNewCampaign: () => void;
}

export function CalendarContent({
  posts,
  selectedDate,
  handleDeletePost,
  handleEditPost,
  handlePublishPost,
  isLoading,
  onNewPost,
  onNewCampaign
}: CalendarContentProps) {
  return (
    <div className="p-4 md:p-6 space-y-4">
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