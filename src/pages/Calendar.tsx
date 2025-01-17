import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { PlusCircle, Instagram, Twitter, Facebook, Linkedin, CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { PostDialog } from "@/components/calendar/PostDialog";
import { PostList } from "@/components/calendar/PostList";
import { supabase } from "@/lib/supabase";

interface Platform {
  id: string;
  name: string;
  icon: React.ReactNode;
}

interface Post {
  id: string;
  content: string;
  date: Date;
  platforms: string[];
  image?: string;
  status: 'draft' | 'scheduled';
  time?: string;
}

const platforms: Platform[] = [
  { id: 'instagram', name: 'Instagram', icon: <Instagram className="h-4 w-4" /> },
  { id: 'twitter', name: 'Twitter', icon: <Twitter className="h-4 w-4" /> },
  { id: 'facebook', name: 'Facebook', icon: <Facebook className="h-4 w-4" /> },
  { id: 'linkedin', name: 'LinkedIn', icon: <Linkedin className="h-4 w-4" /> },
];

export default function CalendarPage() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPost, setNewPost] = useState({
    content: '',
    platforms: [] as string[],
    image: '',
    time: format(new Date(), 'HH:mm'),
    status: 'scheduled' as const,
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleAddPost = async () => {
    if (!selectedDate) {
      toast({
        title: "Error",
        description: "Please select a date first.",
        variant: "destructive",
      });
      return;
    }
    
    if (!newPost.content) {
      toast({
        title: "Error",
        description: "Please enter some content for your post.",
        variant: "destructive",
      });
      return;
    }

    if (newPost.platforms.length === 0) {
      toast({
        title: "Error",
        description: "Please select at least one platform.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data, error } = await supabase
        .from('posts')
        .insert({
          content: newPost.content,
          platforms: newPost.platforms,
          image_url: newPost.image || null,
          scheduled_for: new Date(
            selectedDate.getFullYear(),
            selectedDate.getMonth(),
            selectedDate.getDate(),
            parseInt(newPost.time.split(':')[0]),
            parseInt(newPost.time.split(':')[1])
          ).toISOString(),
          status: 'scheduled'
        })
        .select()
        .single();

      if (error) throw error;

      if (data) {
        setPosts([...posts, {
          ...data,
          date: new Date(data.scheduled_for),
          image: data.image_url,
        }]);
      }

      setNewPost({
        content: '',
        platforms: [],
        image: '',
        time: format(new Date(), 'HH:mm'),
        status: 'scheduled',
      });
      setIsDialogOpen(false);
      
      toast({
        title: "Success",
        description: "Your post has been scheduled.",
      });
    } catch (error) {
      console.error('Error scheduling post:', error);
      toast({
        title: "Error",
        description: "Failed to schedule post. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handlePlatformToggle = (platformId: string) => {
    setNewPost(prev => ({
      ...prev,
      platforms: prev.platforms.includes(platformId)
        ? prev.platforms.filter(id => id !== platformId)
        : [...prev.platforms, platformId]
    }));
  };

  const handleDeletePost = async (postId: string) => {
    try {
      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', postId);

      if (error) throw error;

      setPosts(posts.filter(post => post.id !== postId));
      toast({
        title: "Post Deleted",
        description: "The post has been removed from your calendar.",
      });
    } catch (error) {
      console.error('Error deleting post:', error);
      toast({
        title: "Error",
        description: "Failed to delete post. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSaveAsDraft = async () => {
    if (!selectedDate) return;
    
    try {
      const { data, error } = await supabase
        .from('posts')
        .insert({
          content: newPost.content,
          platforms: newPost.platforms,
          image_url: newPost.image || null,
          scheduled_for: new Date(
            selectedDate.getFullYear(),
            selectedDate.getMonth(),
            selectedDate.getDate(),
            parseInt(newPost.time.split(':')[0]),
            parseInt(newPost.time.split(':')[1])
          ).toISOString(),
          status: 'draft'
        })
        .select()
        .single();

      if (error) throw error;

      if (data) {
        setPosts([...posts, {
          ...data,
          date: new Date(data.scheduled_for),
          image: data.image_url,
        }]);
      }

      setNewPost({
        content: '',
        platforms: [],
        image: '',
        time: format(new Date(), 'HH:mm'),
        status: 'scheduled',
      });
      setIsDialogOpen(false);
      
      toast({
        title: "Draft Saved",
        description: "Your post has been saved as a draft.",
      });
    } catch (error) {
      console.error('Error saving draft:', error);
      toast({
        title: "Error",
        description: "Failed to save draft. Please try again.",
        variant: "destructive",
      });
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
          handleAddPost={handleAddPost}
          handleSaveAsDraft={handleSaveAsDraft}
          handlePlatformToggle={handlePlatformToggle}
        />
      </div>
    </Layout>
  );
}