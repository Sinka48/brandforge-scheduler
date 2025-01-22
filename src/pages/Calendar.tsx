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
import { useToast } from "@/hooks/use-toast";

interface CalendarPageProps {
  session: Session;
}

export default function CalendarPage({ session }: CalendarPageProps) {
  useCalendarAuth();
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const [isSelectMode, setIsSelectMode] = useState(false);
  const [selectedPosts, setSelectedPosts] = useState<string[]>([]);

  const {
    selectedDate,
    setSelectedDate,
    isDialogOpen,
    setIsDialogOpen,
    isCampaignDialogOpen,
    setIsCampaignDialogOpen,
    editingPost,
    setEditingPost,
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

  const handleToggleSelectMode = () => {
    setIsSelectMode(!isSelectMode);
    setSelectedPosts([]);
  };

  const handleSelectPost = (postId: string) => {
    setSelectedPosts(prev => 
      prev.includes(postId) 
        ? prev.filter(id => id !== postId)
        : [...prev, postId]
    );
  };

  const handleExport = () => {
    toast({
      title: "Export",
      description: "Export functionality coming soon!",
    });
  };

  const handleBulkDelete = async () => {
    if (selectedPosts.length === 0) return;
    
    for (const postId of selectedPosts) {
      await handleDeletePost(postId);
    }
    
    toast({
      title: "Success",
      description: `Deleted ${selectedPosts.length} posts`,
    });
    
    setSelectedPosts([]);
    setIsSelectMode(false);
  };

  return (
    <Layout session={session}>
      <div className="space-y-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Feed</h1>
          <p className="text-muted-foreground">
            View and manage your social media posts
          </p>
        </div>

        <div className="space-y-6">
          <div className="flex flex-col gap-4">
            <CalendarHeader 
              onNewPost={() => setIsDialogOpen(true)}
              onNewCampaign={() => setIsCampaignDialogOpen(true)}
              onToggleSelectMode={handleToggleSelectMode}
              isSelectMode={isSelectMode}
              onExport={handleExport}
            />
            
            {isSelectMode && selectedPosts.length > 0 && (
              <div className="flex items-center justify-between bg-muted p-4 rounded-lg">
                <p className="text-sm">
                  {selectedPosts.length} post{selectedPosts.length !== 1 ? 's' : ''} selected
                </p>
                <Button 
                  variant="destructive" 
                  size="sm"
                  onClick={handleBulkDelete}
                >
                  Delete Selected
                </Button>
              </div>
            )}
          </div>
          
          <CalendarView 
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
            selectedPosts={isSelectMode ? selectedPosts : []}
            onSelectPost={isSelectMode ? handleSelectPost : undefined}
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