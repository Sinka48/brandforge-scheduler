import { Layout } from "@/components/layout/Layout";
import { Session } from "@supabase/supabase-js";
import { DraftManager } from "@/components/calendar/DraftManager";
import { PLATFORMS } from "@/constants/platforms";
import { usePostManagement } from "@/hooks/usePostManagement";

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

  return (
    <Layout session={session}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Drafts</h1>
          <p className="text-muted-foreground">
            Manage your draft posts before publishing them.
          </p>
        </div>
        <DraftManager
          posts={posts}
          platforms={PLATFORMS}
          handleDeletePost={handleDeletePost}
          handleEditPost={handleEditPost}
          isLoading={isLoading}
        />
      </div>
    </Layout>
  );
}