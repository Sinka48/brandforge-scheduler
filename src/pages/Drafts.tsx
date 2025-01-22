import { Layout } from "@/components/layout/Layout";
import { Session } from "@supabase/supabase-js";
import { DraftManager } from "@/components/calendar/DraftManager";
import { PLATFORMS } from "@/constants/platforms";
import { usePostManagement } from "@/hooks/usePostManagement";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PostList } from "@/components/calendar/PostList";

interface DraftsPageProps {
  session: Session | null;
}

export default function DraftsPage({ session }: DraftsPageProps) {
  const {
    posts,
    handleDeletePost,
    handleEditPost,
    isLoading
  } = usePostManagement();

  if (!session) {
    return null;
  }

  // Explicitly filter posts by status
  const scheduledPosts = posts.filter(post => post.status === 'scheduled');
  const draftPosts = posts.filter(post => post.status === 'draft');

  console.log('Draft posts:', draftPosts); // Debug log

  return (
    <Layout session={session}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Posts</h1>
          <p className="text-muted-foreground">
            Manage your posts and drafts.
          </p>
        </div>

        <Tabs defaultValue="drafts" className="space-y-4">
          <TabsList>
            <TabsTrigger value="posts">Posts</TabsTrigger>
            <TabsTrigger value="drafts">Drafts</TabsTrigger>
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
        </Tabs>
      </div>
    </Layout>
  );
}