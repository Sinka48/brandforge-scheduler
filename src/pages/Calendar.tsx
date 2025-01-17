import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { format } from "date-fns";
import { PostDialog } from "@/components/calendar/PostDialog";
import { PostList } from "@/components/calendar/PostList";
import { usePostManagement } from "@/hooks/usePostManagement";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useCalendarAuth } from "@/hooks/useCalendarAuth";
import { CalendarHeader } from "@/components/calendar/CalendarHeader";
import { CalendarView } from "@/components/calendar/CalendarView";
import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

export default function CalendarPage() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<any>(null);
  
  const platforms = [
    {
      id: 'facebook',
      name: 'Facebook',
      icon: <Facebook className="h-4 w-4" />,
    },
    {
      id: 'twitter',
      name: 'Twitter',
      icon: <Twitter className="h-4 w-4" />,
    },
    {
      id: 'instagram',
      name: 'Instagram',
      icon: <Instagram className="h-4 w-4" />,
    },
    {
      id: 'linkedin',
      name: 'LinkedIn',
      icon: <Linkedin className="h-4 w-4" />,
    },
  ];
  
  useCalendarAuth();

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
        <CalendarHeader onNewPost={() => setIsDialogOpen(true)} />
        
        <div className="grid md:grid-cols-2 gap-6">
          <CalendarView 
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
          />
          
          <PostList
            selectedDate={selectedDate}
            posts={posts}
            platforms={platforms}
            handleDeletePost={handleDeletePost}
            handleEditPost={handleEditPost}
            isLoading={isQueryLoading || isManagementLoading}
          />
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