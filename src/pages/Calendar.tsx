import { Layout } from "@/components/layout/Layout";
import { PostDialog } from "@/components/calendar/PostDialog";
import { CalendarHeader } from "@/components/calendar/CalendarHeader";
import { CalendarView } from "@/components/calendar/CalendarView";
import { AICampaignDialog } from "@/components/calendar/AICampaignDialog";
import { useCalendarAuth } from "@/hooks/useCalendarAuth";
import { useCalendarState } from "@/components/calendar/hooks/useCalendarState";
import { useCalendarHandlers } from "@/components/calendar/hooks/useCalendarHandlers";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { Session } from "@supabase/supabase-js";
import { Plus } from "lucide-react";
import { useState } from "react";

interface CalendarPageProps {
  session: Session;
}

export default function CalendarPage({ session }: CalendarPageProps) {
  useCalendarAuth();
  const isMobile = useIsMobile();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const {
    isDialogOpen,
    setIsDialogOpen,
    isCampaignDialogOpen,
    setIsCampaignDialogOpen,
    editingPost,
    setEditingPost,
    toast,
    newPost,
    setNewPost,
    handleAddPost,
    handleSaveAsDraft,
    handleDeletePost,
    handlePlatformToggle,
    handleUpdatePost,
  } = useCalendarState();

  const {
    handleGenerateCampaign,
    handleEditPost,
    onAddPost,
    onSaveAsDraft,
    onDialogClose,
  } = useCalendarHandlers({
    setEditingPost,
    setNewPost,
    setIsDialogOpen,
    handleAddPost,
    handleUpdatePost,
    toast,
    selectedDate,
  });

  const handleCreatePost = () => {
    setIsDialogOpen(true);
  };

  const handleCreateCampaign = () => {
    setIsCampaignDialogOpen(true);
  };

  return (
    <Layout session={session}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight">Feed</h1>
            <p className="text-muted-foreground">Schedule and manage your social media posts in one place</p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={handleCreateCampaign}
              className="flex items-center gap-2"
            >
              AI Campaign
            </Button>
            <Button
              onClick={handleCreatePost}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Create Post
            </Button>
          </div>
        </div>

        <div className="space-y-6">
          <CalendarHeader />
          
          <CalendarView 
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
            onCreatePost={handleCreatePost}
            onPostClick={handleEditPost}
          />
        </div>

        {isMobile && (
          <Button
            className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg"
            onClick={() => setIsDialogOpen(true)}
          >
            <Plus className="h-6 w-6" />
          </Button>
        )}

        <PostDialog
          isOpen={isDialogOpen}
          onOpenChange={(open) => onDialogClose(open, setNewPost)}
          newPost={newPost}
          setNewPost={setNewPost}
          handleAddPost={() => onAddPost(editingPost, selectedDate)}
          handleSaveAsDraft={() => onSaveAsDraft(handleSaveAsDraft)}
          handlePlatformToggle={handlePlatformToggle}
          selectedDate={selectedDate}
          editMode={!!editingPost}
        />

        <AICampaignDialog
          isOpen={isCampaignDialogOpen}
          onOpenChange={setIsCampaignDialogOpen}
          onGenerateCampaign={handleGenerateCampaign}
        />
      </div>
    </Layout>
  );
}