import { Layout } from "@/components/layout/Layout";
import { Session } from "@supabase/supabase-js";
import { DraftManager } from "@/components/calendar/DraftManager";
import { PLATFORMS } from "@/constants/platforms";
import { usePostManagement } from "@/hooks/usePostManagement";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PostList } from "@/components/calendar/PostList";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";
import { PostDialog } from "@/components/calendar/PostDialog";
import { format } from "date-fns";
import { usePostData } from "@/hooks/post/usePostData";
import { Post } from "@/components/calendar/types";

interface DraftsPageProps {
  session: Session | null;
}

export default function DraftsPage({ session }: DraftsPageProps) {
  const {
    handleDeletePost,
    handleEditPost,
    handleAddPost,
    isLoading: isManagementLoading
  } = usePostManagement();

  const { data: posts = [], isLoading: isPostsLoading } = usePostData(session);

  const [isPostDialogOpen, setIsPostDialogOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [newPost, setNewPost] = useState({
    content: "",
    platforms: [],
    status: "draft" as const,
    time: format(new Date(), 'HH:mm'),
    date: new Date(),
  });

  if (!session) {
    return null;
  }

  const scheduledPosts = posts.filter(post => post.status === 'scheduled');
  const draftPosts = posts.filter(post => post.status === 'draft');

  const handlePlatformToggle = (platformId: string) => {
    setNewPost(prev => ({
      ...prev,
      platforms: prev.platforms.includes(platformId)
        ? prev.platforms.filter(p => p !== platformId)
        : [...prev.platforms, platformId]
    }));
  };

  const handleSaveAsDraft = () => {
    handleAddPost(newPost.date, { ...newPost, status: 'draft' });
    setIsPostDialogOpen(false);
    setNewPost({
      content: "",
      platforms: [],
      status: "draft",
      time: format(new Date(), 'HH:mm'),
      date: new Date(),
    });
  };

  const onEditPost = (post: Post) => {
    setEditingPost(post);
    setNewPost({
      content: post.content,
      platforms: post.platforms,
      status: post.status,
      time: post.time || format(new Date(), 'HH:mm'),
      date: post.date,
    });
    setIsPostDialogOpen(true);
  };

  const isLoading = isManagementLoading || isPostsLoading;

  return (
    <Layout session={session}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight">Posts</h1>
            <p className="text-muted-foreground">
              Manage your posts and drafts.
            </p>
          </div>
          <Button 
            onClick={() => {
              setEditingPost(null);
              setNewPost({
                content: "",
                platforms: [],
                status: "draft",
                time: format(new Date(), 'HH:mm'),
                date: new Date(),
              });
              setIsPostDialogOpen(true);
            }}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Create Post
          </Button>
        </div>

        <Tabs defaultValue="drafts" className="space-y-4">
          <TabsList>
            <TabsTrigger value="posts">Published</TabsTrigger>
            <TabsTrigger value="drafts">Drafts</TabsTrigger>
          </TabsList>

          <TabsContent value="posts" className="space-y-4">
            <PostList
              selectedDate={undefined}
              posts={scheduledPosts}
              platforms={PLATFORMS}
              handleDeletePost={handleDeletePost}
              handleEditPost={onEditPost}
              handlePublishPost={() => {}}
              isLoading={isLoading}
            />
          </TabsContent>

          <TabsContent value="drafts">
            <DraftManager
              posts={draftPosts}
              platforms={PLATFORMS}
              handleDeletePost={handleDeletePost}
              handleEditPost={onEditPost}
              isLoading={isLoading}
            />
          </TabsContent>
        </Tabs>

        <PostDialog
          isOpen={isPostDialogOpen}
          onOpenChange={setIsPostDialogOpen}
          newPost={newPost}
          setNewPost={setNewPost}
          handleAddPost={handleSaveAsDraft}
          handleSaveAsDraft={handleSaveAsDraft}
          handlePlatformToggle={handlePlatformToggle}
          selectedDate={newPost.date}
          editMode={!!editingPost}
        />
      </div>
    </Layout>
  );
}