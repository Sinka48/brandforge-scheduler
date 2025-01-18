import { Card } from "@/components/ui/card";

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
  onCreatePost?: () => void;
  onPostClick?: (post: Post) => void;
}

export function CalendarView({ 
  selectedDate, 
  onSelectDate, 
  posts = [],
  onCreatePost,
  onPostClick
}: CalendarViewProps) {
  // Filter out draft posts, only show scheduled posts
  const scheduledPosts = posts.filter(post => post.status === 'scheduled');

  return (
    <Card className="p-4">
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
            posts={scheduledPosts}
            onCreatePost={onCreatePost}
            onPostClick={onPostClick}
          />
        </TabsContent>

        <TabsContent value="week" className="mt-0">
          <WeekView 
            selectedDate={selectedDate} 
            onSelectDate={onSelectDate}
            posts={scheduledPosts}
          />
        </TabsContent>

        <TabsContent value="day" className="mt-0">
          <DayView
            selectedDate={selectedDate}
            onSelectDate={onSelectDate}
            posts={scheduledPosts}
          />
        </TabsContent>
      </Tabs>
    </Card>
  );
}
