import { Layout } from "@/components/layout/Layout";
import { PostDialog } from "@/components/calendar/PostDialog";
import { PostList } from "@/components/calendar/PostList";
import { DraftManager } from "@/components/calendar/DraftManager";
import { CalendarHeader } from "@/components/calendar/CalendarHeader";
import { CalendarView } from "@/components/calendar/CalendarView";
import { PLATFORMS } from "@/constants/platforms";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarDays, FileText, Plus } from "lucide-react";
import { AICampaignDialog } from "@/components/calendar/AICampaignDialog";
import { useCalendarAuth } from "@/hooks/useCalendarAuth";
import { useCalendarState } from "@/components/calendar/hooks/useCalendarState";
import { useCalendarHandlers } from "@/components/calendar/hooks/useCalendarHandlers";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";

export default function CalendarPage() {
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
    <Layout>
      <div className="flex flex-col h-[calc(100vh-4rem)] overflow-hidden">
        <div className="flex-none p-4 md:p-6">
          <CalendarHeader 
            onNewPost={() => setIsDialogOpen(true)}
            onNewCampaign={() => setIsCampaignDialogOpen(true)}
          />
        </div>
        
        <div className="flex-1 overflow-hidden">
          <Tabs defaultValue="calendar" className="h-full">
            <div className="px-4 md:px-6">
              <TabsList className="w-full md:w-auto">
                <TabsTrigger value="calendar" className="flex items-center gap-2">
                  <CalendarDays className="h-4 w-4" />
                  Calendar
                </TabsTrigger>
                <TabsTrigger value="drafts" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Drafts
                </TabsTrigger>
              </TabsList>
            </div>
            
            <ScrollArea className="flex-1 p-4 md:p-6">
              <TabsContent value="calendar" className="mt-0 h-full">
                <div className="flex flex-col gap-6">
                  <div className="min-h-[300px]">
                    <PostList
                      selectedDate={selectedDate}
                      posts={posts}
                      platforms={platforms}
                      handleDeletePost={handleDeletePost}
                      handleEditPost={handleEditPost}
                      isLoading={isQueryLoading || isManagementLoading}
                    />
                  </div>
                  
                  <div className="min-h-[500px]">
                    <CalendarView 
                      selectedDate={selectedDate}
                      onSelectDate={setSelectedDate}
                      posts={posts}
                    />
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="drafts" className="mt-0">
                <DraftManager
                  posts={posts}
                  platforms={platforms}
                  handleDeletePost={handleDeletePost}
                  handleEditPost={handleEditPost}
                  isLoading={isQueryLoading || isManagementLoading}
                />
              </TabsContent>
            </ScrollArea>
          </Tabs>
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