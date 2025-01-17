import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { PlusCircle, Instagram, Twitter, Facebook, Linkedin, CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { PostDialog } from "@/components/calendar/PostDialog";
import { PostList } from "@/components/calendar/PostList";
import { usePostManagement } from "@/hooks/usePostManagement";

interface Platform {
  id: string;
  name: string;
  icon: React.ReactNode;
}

const platforms: Platform[] = [
  { id: 'instagram', name: 'Instagram', icon: <Instagram className="h-4 w-4" /> },
  { id: 'twitter', name: 'Twitter', icon: <Twitter className="h-4 w-4" /> },
  { id: 'facebook', name: 'Facebook', icon: <Facebook className="h-4 w-4" /> },
  { id: 'linkedin', name: 'LinkedIn', icon: <Linkedin className="h-4 w-4" /> },
];

export default function CalendarPage() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const {
    posts,
    newPost,
    setNewPost,
    handleAddPost,
    handleSaveAsDraft,
    handleDeletePost,
    handlePlatformToggle,
  } = usePostManagement();

  const onAddPost = async () => {
    const success = await handleAddPost(selectedDate);
    if (success) {
      setIsDialogOpen(false);
    }
  };

  const onSaveAsDraft = async () => {
    const success = await handleSaveAsDraft(selectedDate);
    if (success) {
      setIsDialogOpen(false);
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Content Calendar</h1>
            <p className="text-muted-foreground">
              Plan and schedule your social media content.
            </p>
          </div>
          <Button onClick={() => setIsDialogOpen(true)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            New Post
          </Button>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div className="rounded-lg border bg-card">
            <div className="p-6">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="rounded-md border"
              />
            </div>
          </div>
          
          <div className="rounded-lg border bg-card">
            <div className="p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <CalendarIcon className="h-5 w-5" />
                {selectedDate ? (
                  `Posts for ${format(selectedDate, 'MMMM d, yyyy')}`
                ) : (
                  "Select a date to view posts"
                )}
              </h2>
              <PostList
                selectedDate={selectedDate}
                posts={posts}
                platforms={platforms}
                handleDeletePost={handleDeletePost}
              />
            </div>
          </div>
        </div>

        <PostDialog
          isOpen={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          newPost={newPost}
          setNewPost={setNewPost}
          handleAddPost={onAddPost}
          handleSaveAsDraft={onSaveAsDraft}
          handlePlatformToggle={handlePlatformToggle}
        />
      </div>
    </Layout>
  );
}