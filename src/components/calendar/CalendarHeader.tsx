import { Button } from "@/components/ui/button";
import { Plus, Wand2, Clock } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";
import { formatDistanceToNow } from "date-fns";

interface CalendarHeaderProps {
  onNewPost: () => void;
  onNewCampaign: () => void;
}

export function CalendarHeader({ onNewPost, onNewCampaign }: CalendarHeaderProps) {
  const [timeLeft, setTimeLeft] = useState<string>("No upcoming posts");

  const { data: posts = [] } = useQuery({
    queryKey: ['posts'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) {
        return [];
      }

      const { data, error } = await supabase
        .from('posts')
        .select('scheduled_for')
        .eq('user_id', session.user.id)
        .order('scheduled_for', { ascending: true });

      if (error) {
        console.error('Error fetching posts:', error);
        return [];
      }

      return data.map(post => ({
        date: new Date(post.scheduled_for),
      }));
    }
  });

  // Sort posts by scheduled time, earliest first
  const sortedPosts = [...posts].sort((a, b) => a.date.getTime() - b.date.getTime());

  // Find next upcoming post and calculate time left
  useEffect(() => {
    const updateTimeLeft = () => {
      const now = new Date();
      const nextPost = sortedPosts.find(post => post.date > now);
      
      if (nextPost) {
        const timeUntilPost = formatDistanceToNow(nextPost.date, { addSuffix: true });
        setTimeLeft(timeUntilPost);
      } else {
        setTimeLeft("No upcoming posts");
      }
    };

    updateTimeLeft();
    const timer = setInterval(updateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [sortedPosts]);

  return (
    <div className="flex items-center justify-between gap-4 flex-wrap">
      <div className="flex items-center gap-2">
        <h2 className="text-lg font-semibold">Next post in: {timeLeft}</h2>
        <Clock className="h-4 w-4 text-muted-foreground" />
      </div>

      <div className="flex items-center gap-2">
        <div className="hidden sm:block">
          <Button
            variant="outline"
            onClick={onNewCampaign}
            className="flex items-center gap-2"
          >
            <Wand2 className="h-4 w-4" />
            AI Campaign
          </Button>
        </div>
        <div className="hidden sm:block">
          <Button onClick={onNewPost} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            New Post
          </Button>
        </div>
        
        <div className="sm:hidden">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="icon">
                <Plus className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onNewPost}>
                <Plus className="h-4 w-4 mr-2" />
                New Post
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onNewCampaign}>
                <Wand2 className="h-4 w-4 mr-2" />
                AI Campaign
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}