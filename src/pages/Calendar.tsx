import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { PlusCircle } from "lucide-react";

interface Post {
  id: string;
  content: string;
  date: Date;
  platforms: string[];
  image?: string;
  status: 'draft' | 'scheduled';
}

export default function CalendarPage() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPost, setNewPost] = useState({
    content: '',
    platforms: [] as string[],
    image: '',
  });
  const { toast } = useToast();

  const handleAddPost = () => {
    if (!selectedDate) return;
    
    const post: Post = {
      id: Date.now().toString(),
      content: newPost.content,
      date: selectedDate,
      platforms: newPost.platforms,
      image: newPost.image,
      status: 'scheduled'
    };

    setPosts([...posts, post]);
    setNewPost({ content: '', platforms: [], image: '' });
    
    toast({
      title: "Post Scheduled",
      description: "Your post has been successfully scheduled.",
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
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                New Post
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Post</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Textarea
                    placeholder="Write your post content..."
                    value={newPost.content}
                    onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Input
                    type="url"
                    placeholder="Image URL (optional)"
                    value={newPost.image}
                    onChange={(e) => setNewPost({ ...newPost, image: e.target.value })}
                  />
                </div>
                <Button onClick={handleAddPost} className="w-full">
                  Schedule Post
                </Button>
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
              <h2 className="text-lg font-semibold mb-4">
                {selectedDate ? (
                  `Posts for ${selectedDate.toLocaleDateString()}`
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