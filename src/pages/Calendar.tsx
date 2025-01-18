import { Layout } from "@/components/layout/Layout";
import { PostDialog } from "@/components/calendar/PostDialog";
import { CalendarHeader } from "@/components/calendar/CalendarHeader";
import { CalendarView } from "@/components/calendar/CalendarView";
import { PLATFORMS } from "@/constants/platforms";
import { Plus } from "lucide-react";
import { AICampaignDialog } from "@/components/calendar/AICampaignDialog";
import { useCalendarAuth } from "@/hooks/useCalendarAuth";
import { useCalendarState } from "@/components/calendar/hooks/useCalendarState";
import { useCalendarHandlers } from "@/components/calendar/hooks/useCalendarHandlers";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { Session } from "@supabase/supabase-js";

interface CalendarPageProps {
  session: Session;
}

export default function CalendarPage({ session }: CalendarPageProps) {
  useCalendarAuth();
  const isMobile = useIsMobile();

  const {
    selectedDate,
    setSelectedDate,
    isDialogOpen,
    setIsDialogOpen,
    isCampaignDialogOpen,
    setIsCampaignDialogOpen,
    editingPost,
    setEditingPost,
    toast,
    posts,
    isManagementLoading,
    isQueryLoading,
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

  const platforms = PLATFORMS.map(platform => ({
    ...platform,
    icon: <platform.icon className="h-4 w-4" />,
  }));

  return (
    <Layout session={session}>
      <div className="flex flex-col h-[calc(100vh-4rem)] overflow-hidden">
        <div className="flex-none p-4 md:p-6">
          <CalendarHeader 
            onNewPost={() => setIsDialogOpen(true)}
            onNewCampaign={() => setIsCampaignDialogOpen(true)}
          />
        </div>
        
        <div className="flex-1 p-4 md:p-6 overflow-auto">
          <CalendarView 
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
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