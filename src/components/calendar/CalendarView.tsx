import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarDays, Calendar as CalendarIcon, Clock } from "lucide-react";
import { WeekView } from "./calendar-views/WeekView";
import { DayView } from "./calendar-views/DayView";
import { MonthView } from "./calendar-views/MonthView";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { format } from "date-fns";
import { ScrollArea } from "@/components/ui/scroll-area";

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
  const selectedDatePosts = posts.filter(
    post => post.status === 'scheduled' && 
    format(post.date, 'yyyy-MM-dd') === (selectedDate ? format(selectedDate, 'yyyy-MM-dd') : '')
  );

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
            posts={posts}
          />
        </TabsContent>

        <TabsContent value="week" className="mt-0">
          <WeekView 
            selectedDate={selectedDate} 
            onSelectDate={onSelectDate}
            posts={posts}
          />
        </TabsContent>

        <TabsContent value="day" className="mt-0">
          <DayView
            selectedDate={selectedDate}
            onSelectDate={onSelectDate}
            posts={posts}
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