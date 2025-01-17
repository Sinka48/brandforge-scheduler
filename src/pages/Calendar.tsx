import { useState, useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { PlusCircle, Instagram, Twitter, Facebook, Linkedin, CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { PostDialog } from "@/components/calendar/PostDialog";
import { PostList } from "@/components/calendar/PostList";
import { usePostManagement } from "@/hooks/usePostManagement";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

const platforms = [
  { id: 'instagram', name: 'Instagram', icon: <Instagram className="h-4 w-4" /> },
  { id: 'twitter', name: 'Twitter', icon: <Twitter className="h-4 w-4" /> },
  { id: 'facebook', name: 'Facebook', icon: <Facebook className="h-4 w-4" /> },
  { id: 'linkedin', name: 'LinkedIn', icon: <Linkedin className="h-4 w-4" /> },
];

export default function CalendarPage() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<any>(null);
  const navigate = useNavigate();
  
  // Check authentication status
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/');
      }
    };
    
    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        navigate('/');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const {
    posts,
    setPosts,
    isLoading: isManagementLoading,
    newPost,
    setNewPost,
    handleAddPost,
    handleSaveAsDraft,
    handleDeletePost,
    handlePlatformToggle,
    handleUpdatePost,
  } = usePostManagement();

  const { isLoading: isQueryLoading } = useQuery({
    queryKey: ['posts'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('Not authenticated');
      }

      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('user_id', session.user.id)
        .order('scheduled_for', { ascending: true });

      if (error) throw error;

      const formattedPosts = data.map(post => ({
        id: post.id,
        content: post.content,
        date: new Date(post.scheduled_for),
        platforms: [post.platform],
        image: post.image_url,
        status: post.status as 'draft' | 'scheduled',
        time: format(new Date(post.scheduled_for), 'HH:mm'),
      }));

      setPosts(formattedPosts);
      return formattedPosts;
    },
  });

  const handleEditPost = (post: any) => {
    setEditingPost(post);
    setNewPost({
      content: post.content,
      platforms: post.platforms,
      image: post.image || '',
      time: post.time,
      status: post.status,
    });
    setIsDialogOpen(true);
  };

  const onAddPost = async () => {
    let success;
    if (editingPost) {
      success = await handleUpdatePost(editingPost.id, selectedDate);
    } else {
      success = await handleAddPost(selectedDate);
    }
    if (success) {
      setIsDialogOpen(false);
      setEditingPost(null);
    }
  };

  const onSaveAsDraft = async () => {
    const success = await handleSaveAsDraft(selectedDate);
    if (success) {
      setIsDialogOpen(false);
      setEditingPost(null);
    }
  };

  const onDialogClose = (open: boolean) => {
    if (!open) {
      setEditingPost(null);
      setNewPost({
        content: '',
        platforms: [],
        image: '',
        time: format(new Date(), 'HH:mm'),
        status: 'scheduled',
      });
    }
    setIsDialogOpen(open);
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
                handleEditPost={handleEditPost}
                isLoading={isQueryLoading || isManagementLoading}
              />
            </div>
          </div>
        </div>

        <PostDialog
          isOpen={isDialogOpen}
          onOpenChange={onDialogClose}
          newPost={newPost}
          setNewPost={setNewPost}
          handleAddPost={onAddPost}
          handleSaveAsDraft={onSaveAsDraft}
          handlePlatformToggle={handlePlatformToggle}
          selectedDate={selectedDate}
          editMode={!!editingPost}
        />
      </div>
    </Layout>
  );
}