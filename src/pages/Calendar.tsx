import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { PlusCircle, Image, Instagram, Twitter, Facebook, Linkedin, Clock, Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";

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

  const handleAddPost = () => {
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

    const post: Post = {
      id: Date.now().toString(),
      content: newPost.content,
      date: selectedDate,
      platforms: newPost.platforms,
      image: newPost.image,
      status: newPost.status,
      time: newPost.time,
    };

    setPosts([...posts, post]);
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
  };

  const handlePlatformToggle = (platformId: string) => {
    setNewPost(prev => ({
      ...prev,
      platforms: prev.platforms.includes(platformId)
        ? prev.platforms.filter(id => id !== platformId)
        : [...prev.platforms, platformId]
    }));
  };

  const handleDeletePost = (postId: string) => {
    setPosts(posts.filter(post => post.id !== postId));
    toast({
      title: "Post Deleted",
      description: "The post has been removed from your calendar.",
    });
  };

  const handleSaveAsDraft = () => {
    if (!selectedDate) return;
    
    const post: Post = {
      id: Date.now().toString(),
      content: newPost.content,
      date: selectedDate,
      platforms: newPost.platforms,
      image: newPost.image,
      status: 'draft',
      time: newPost.time,
    };

    setPosts([...posts, post]);
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
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                New Post
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Create New Post</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <Textarea
                  placeholder="Write your post content..."
                  value={newPost.content}
                  onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                  className="min-h-[100px]"
                />
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Platforms</label>
                  <div className="flex gap-2">
                    {platforms.map((platform) => (
                      <Button
                        key={platform.id}
                        variant={newPost.platforms.includes(platform.id) ? "default" : "outline"}
                        size="sm"
                        onClick={() => handlePlatformToggle(platform.id)}
                      >
                        {platform.icon}
                        <span className="ml-2">{platform.name}</span>
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Image URL (optional)</label>
                  <div className="flex gap-2">
                    <Input
                      type="url"
                      placeholder="Enter image URL..."
                      value={newPost.image}
                      onChange={(e) => setNewPost({ ...newPost, image: e.target.value })}
                    />
                    <Button variant="outline" size="icon">
                      <Image className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Time</label>
                  <div className="flex gap-2 items-center">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <Input
                      type="time"
                      value={newPost.time}
                      onChange={(e) => setNewPost({ ...newPost, time: e.target.value })}
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={handleSaveAsDraft}>
                    Save as Draft
                  </Button>
                  <Button onClick={handleAddPost}>
                    Schedule Post
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
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
              <div className="space-y-4">
                {posts
                  .filter(
                    (post) =>
                      selectedDate &&
                      post.date.toDateString() === selectedDate.toDateString()
                  )
                  .map((post) => (
                    <div
                      key={post.id}
                      className="p-4 rounded-md border bg-background"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex gap-2">
                          {post.platforms.map((platformId) => {
                            const platform = platforms.find(p => p.id === platformId);
                            return platform?.icon;
                          })}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">
                            {post.time}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-destructive hover:text-destructive"
                            onClick={() => handleDeletePost(post.id)}
                          >
                            Delete
                          </Button>
                        </div>
                      </div>
                      <p className="text-sm">{post.content}</p>
                      {post.image && (
                        <img
                          src={post.image}
                          alt="Post preview"
                          className="mt-2 rounded-md max-h-32 object-cover"
                        />
                      )}
                      <div className="mt-2 text-xs text-muted-foreground">
                        Status: {post.status}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}