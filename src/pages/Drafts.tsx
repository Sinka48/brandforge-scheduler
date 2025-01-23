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
            onClick={() => setIsPostDialogOpen(true)}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Create Post
          </Button>
        </div>

        <Tabs defaultValue="drafts" className="space-y-4">
          <TabsList>
            <TabsTrigger value="published">Published</TabsTrigger>
            <TabsTrigger value="drafts">Drafts</TabsTrigger>
          </TabsList>

          <TabsContent value="published" className="space-y-4">
            <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-4">Published Posts</h3>
                <PostList
                  selectedDate={undefined}
                  posts={scheduledPosts}
                  platforms={PLATFORMS}
                  handleDeletePost={handleDeletePost}
                  handleEditPost={handleEditPost}
                  handlePublishPost={() => {}}
                  isLoading={isLoading}
                  showScheduledOnly={true}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="drafts">
            <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-4">Draft Posts</h3>
                <DraftManager
                  posts={draftPosts}
                  platforms={PLATFORMS}
                  handleDeletePost={handleDeletePost}
                  handleEditPost={handleEditPost}
                  isLoading={isLoading}
                />
              </div>
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