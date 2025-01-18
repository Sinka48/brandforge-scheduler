import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarDays, Calendar as CalendarIcon, Clock } from "lucide-react";
import { WeekView } from "./calendar-views/WeekView";
import { DayView } from "./calendar-views/DayView";
import { MonthView } from "./calendar-views/MonthView";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { format } from "date-fns";
import { ScrollArea } from "@/components/ui/scroll-area";
import { BulkActions } from "./BulkActions";
import { Filters } from "./Filters";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface Post {
  id: string;
  content: string;
  date: Date;
  platforms: string[];
  image?: string;
  status: 'draft' | 'scheduled';
  time?: string;
}

interface CalendarViewProps {
  selectedDate: Date | undefined;
  onSelectDate: (date: Date | undefined) => void;
  posts?: Post[];
}

export function CalendarView({ selectedDate, onSelectDate, posts = [] }: CalendarViewProps) {
  const [selectedPosts, setSelectedPosts] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<('draft' | 'scheduled' | 'published')[]>([]);
  const { toast } = useToast();

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPlatform = selectedPlatforms.length === 0 || 
      post.platforms.some(p => selectedPlatforms.includes(p));
    const matchesStatus = selectedStatuses.length === 0 || 
      selectedStatuses.includes(post.status);
    return matchesSearch && matchesPlatform && matchesStatus;
  });

  const selectedDatePosts = filteredPosts.filter(
    post => post.status === 'scheduled' && 
    format(post.date, 'yyyy-MM-dd') === (selectedDate ? format(selectedDate, 'yyyy-MM-dd') : '')
  );

  const handleBulkDelete = async (postId: string) => {
    toast({
      title: "Post deleted",
      description: "The post has been deleted."
    });
    setSelectedPosts(selectedPosts.filter(id => id !== postId));
  };

  const handleBulkDuplicate = async (postIds: string[]) => {
    toast({
      title: "Posts duplicated",
      description: `${postIds.length} posts have been duplicated.`
    });
    setSelectedPosts([]);
  };

  const handleBulkReschedule = async (postIds: string[]) => {
    toast({
      title: "Posts rescheduled",
      description: `${postIds.length} posts have been rescheduled.`
    });
    setSelectedPosts([]);
  };

  const handleEditPost = (post: Post) => {
    toast({
      title: "Edit post",
      description: "Opening post editor..."
    });
  };

  const handleViewPost = (post: Post) => {
    onSelectDate(post.date);
  };

  return (
    <Card className="p-4">
      <div className="mb-4 flex items-center justify-between">
        <Filters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedPlatforms={selectedPlatforms}
          onPlatformChange={setSelectedPlatforms}
          selectedStatuses={selectedStatuses}
          onStatusChange={setSelectedStatuses}
        />
        
        <BulkActions
          selectedPosts={selectedPosts}
          onDelete={handleBulkDelete}
          onDuplicate={handleBulkDuplicate}
          onReschedule={handleBulkReschedule}
        />
      </div>

      <Tabs defaultValue="month" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="month" className="flex items-center gap-2">
            <CalendarIcon className="h-4 w-4" />
            Month
          </TabsTrigger>
          <TabsTrigger value="week" className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4" />
            Week
          </TabsTrigger>
          <TabsTrigger value="day" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Day
          </TabsTrigger>
        </TabsList>

        <TabsContent value="month" className="mt-0">
          <MonthView 
            selectedDate={selectedDate}
            onSelectDate={onSelectDate}
            posts={filteredPosts}
            selectedPosts={selectedPosts}
            onSelectPost={(postId) => {
              setSelectedPosts(prev => 
                prev.includes(postId)
                  ? prev.filter(id => id !== postId)
                  : [...prev, postId]
              );
            }}
            onEditPost={handleEditPost}
            onDeletePost={handleBulkDelete}
            onViewPost={handleViewPost}
          />
        </TabsContent>

        <TabsContent value="week" className="mt-0">
          <WeekView 
            selectedDate={selectedDate} 
            onSelectDate={onSelectDate}
            posts={filteredPosts}
          />
        </TabsContent>

        <TabsContent value="day" className="mt-0">
          <DayView
            selectedDate={selectedDate}
            onSelectDate={onSelectDate}
            posts={filteredPosts}
          />
        </TabsContent>
      </Tabs>

      <Dialog 
        open={!!selectedDate && selectedDatePosts.length > 0} 
        onOpenChange={() => onSelectDate(undefined)}
      >
        <DialogContent className="max-w-2xl">
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">
              Posts for {selectedDate ? format(selectedDate, 'MMMM d, yyyy') : ''}
            </h2>
            <ScrollArea className="h-[60vh]">
              <div className="space-y-4">
                {selectedDatePosts.map((post) => (
                  <Card key={post.id} className="p-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        {post.time}
                      </div>
                      <p className="text-sm">{post.content}</p>
                      {post.image && (
                        <img 
                          src={post.image} 
                          alt="Post preview" 
                          className="rounded-md max-h-32 object-cover"
                        />
                      )}
                      <div className="flex flex-wrap gap-2">
                        {post.platforms.map((platform) => (
                          <span 
                            key={platform}
                            className="text-xs bg-muted px-2 py-1 rounded-full"
                          >
                            {platform}
                          </span>
                        ))}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
