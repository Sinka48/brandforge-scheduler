
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

interface DraftsPageProps {
  session: Session | null;
}

export default function DraftsPage({ session }: DraftsPageProps) {
  const {
    posts,
    handleDeletePost,
    handleEditPost,
    handleAddPost,
    isLoading
  } = usePostManagement();

  const [isPostDialogOpen, setIsPostDialogOpen] = useState(false);
  const [newPost, setNewPost] = useState({
    content: "",
    platforms: [],
    status: "draft",
    time: format(new Date(), 'HH:mm'),
    date: new Date(),
  });

  if (!session) {
    return null;
  }

  const draftPosts = posts.filter(post => post.status === 'draft');
  const publishedPosts = posts.filter(post => post.status === 'scheduled' && post.published_at);
  const scheduledPosts = posts.filter(post => post.status === 'scheduled' && !post.published_at);

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

  return (
    <Layout session={session}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight">Posts</h1>
            <p className="text-muted-foreground">
              Manage your posts, drafts, and view post history.
            </p>
          </div>
          <Button 
            onClick={() => setIsPostDialogOpen(true)}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Create Post
          </Button>
        </div>

        <Tabs defaultValue="posts" className="space-y-4">
          <TabsList>
            <TabsTrigger value="posts">Scheduled</TabsTrigger>
            <TabsTrigger value="drafts">Drafts</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>

          <TabsContent value="posts" className="space-y-4">
            <PostList
              selectedDate={undefined}
              posts={scheduledPosts}
              platforms={PLATFORMS}
              handleDeletePost={handleDeletePost}
              handleEditPost={handleEditPost}
              handlePublishPost={() => {}}
              isLoading={isLoading}
            />
          </TabsContent>

          <TabsContent value="drafts">
            <DraftManager
              posts={draftPosts}
              platforms={PLATFORMS}
              handleDeletePost={handleDeletePost}
              handleEditPost={handleEditPost}
              isLoading={isLoading}
            />
          </TabsContent>

          <TabsContent value="history">
            <div className="rounded-lg border">
              <div className="p-4">
                <h2 className="text-xl font-semibold">Published Posts</h2>
                <p className="text-sm text-muted-foreground">View your previously published posts</p>
              </div>
              <PostList
                selectedDate={undefined}
                posts={publishedPosts}
                platforms={PLATFORMS}
                handleDeletePost={handleDeletePost}
                handleEditPost={handleEditPost}
                handlePublishPost={() => {}}
                isLoading={isLoading}
              />
            </div>
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
        />
      </div>
    </Layout>
  );
}
