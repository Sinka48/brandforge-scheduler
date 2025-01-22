import { Layout } from "@/components/layout/Layout";
import { Session } from "@supabase/supabase-js";
import { CalendarView } from "@/components/calendar/CalendarView";
import { PostList } from "@/components/calendar/PostList";
import { useState } from "react";
import { PostDialog } from "@/components/calendar/PostDialog";
import { AICampaignDialog } from "@/components/calendar/AICampaignDialog";
import { useNavigate } from "react-router-dom";
import { usePostState } from "@/hooks/usePostState";
import { useCalendarState } from "@/components/calendar/hooks/useCalendarState";
import { format } from "date-fns";

interface CalendarPageProps {
  session: Session | null;
}

export default function CalendarPage({ session }: CalendarPageProps) {
  const [isPostDialogOpen, setIsPostDialogOpen] = useState(false);
  const [isAICampaignDialogOpen, setIsAICampaignDialogOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const navigate = useNavigate();
  const { newPost, setNewPost, handlePlatformToggle } = usePostState();
  const { handleAddPost, handleSaveAsDraft } = useCalendarState();

  const handleCreatePost = () => {
    setIsPostDialogOpen(true);
  };

  const handleCreateCampaign = () => {
    setIsAICampaignDialogOpen(true);
  };

  const handleHowItWorks = () => {
    navigate("/how-it-works");
  };

  const handleGenerateCampaign = (posts: any[]) => {
    // Handle the generated campaign posts
    console.log('Generated posts:', posts);
    // You might want to update your state or perform other actions with the generated posts
  };

  return (
    <Layout session={session}>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Calendar</h1>
          <p className="text-muted-foreground">
            Schedule and manage your social media posts
          </p>
        </div>

        <div className="grid gap-8">
          <CalendarView 
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
            onCreatePost={handleCreatePost}
            onPostClick={() => {}}
          />
          <PostList
            selectedDate={selectedDate}
            posts={[]}
            platforms={[]}
            handleDeletePost={() => {}}
            handleEditPost={() => {}}
            handlePublishPost={() => {}}
          />
        </div>

        <PostDialog
          isOpen={isPostDialogOpen}
          onOpenChange={setIsPostDialogOpen}
          newPost={newPost}
          setNewPost={setNewPost}
          handleAddPost={handleAddPost}
          handleSaveAsDraft={handleSaveAsDraft}
          handlePlatformToggle={handlePlatformToggle}
          selectedDate={selectedDate}
        />

        <AICampaignDialog
          isOpen={isAICampaignDialogOpen}
          onOpenChange={setIsAICampaignDialogOpen}
          onGenerateCampaign={handleGenerateCampaign}
        />
      </div>
    </Layout>
  );
}