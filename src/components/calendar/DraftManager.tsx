import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { PostList } from "./PostList";
import { PlatformId } from "@/constants/platforms";
import { Search, FileText } from "lucide-react";
import { useState } from "react";

interface Platform {
  id: PlatformId;
  name: string;
  icon: React.ReactNode;
}

interface Post {
  id: string;
  content: string;
  date: Date;
  platforms: PlatformId[];
  image?: string;
  status: 'draft' | 'scheduled';
  time?: string;
}

interface DraftManagerProps {
  posts: Post[];
  platforms: Platform[];
  handleDeletePost: (postId: string) => void;
  handleEditPost: (post: Post) => void;
  isLoading?: boolean;
}

export function DraftManager({
  posts,
  platforms,
  handleDeletePost,
  handleEditPost,
  isLoading
}: DraftManagerProps) {
  const [searchQuery, setSearchQuery] = useState("");
  
  const draftPosts = posts.filter(post => 
    post.status === 'draft' && 
    post.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          <h2 className="text-lg font-semibold">Drafts</h2>
          <Badge variant="secondary">{draftPosts.length}</Badge>
        </div>
        <div className="relative w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search drafts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      <PostList
        selectedDate={undefined}
        posts={draftPosts}
        platforms={platforms}
        handleDeletePost={handleDeletePost}
        handleEditPost={handleEditPost}
        isLoading={isLoading}
      />
    </div>
  );
}
