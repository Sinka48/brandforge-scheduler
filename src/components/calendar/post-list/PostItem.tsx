import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { PlatformId } from "@/constants/platforms";
import { Edit, Trash2, MoreVertical, Calendar, Pause, Play, Send } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { format } from "date-fns";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Platform {
  id: PlatformId;
  name: string;
  icon: React.ReactNode;
}

interface Post {
  id: string;
  content: string;
  date: Date;
  platforms: PlatformId[] | PlatformId;
  image?: string;
  status: 'draft' | 'scheduled' | 'published' | 'paused';
  time?: string;
  campaign?: {
    id: string;
    name: string;
    description: string;
  };
}

interface PostItemProps {
  post: Post;
  platforms: Platform[];
  onEdit: (post: Post) => void;
  onDelete: (postId: string) => void;
  isSelected?: boolean;
  onSelect?: (postId: string) => void;
}

export function PostItem({ 
  post, 
  platforms, 
  onEdit, 
  onDelete,
  isSelected,
  onSelect
}: PostItemProps) {
  const [isPaused, setIsPaused] = useState(post.status === 'paused');
  const { toast } = useToast();
  
  const platformsArray = Array.isArray(post.platforms) ? post.platforms : [post.platforms];
  const postPlatforms = platforms.filter(p => platformsArray.includes(p.id));

  const handlePauseToggle = async () => {
    try {
      const newStatus = isPaused ? 'scheduled' : 'paused';
      const { error } = await supabase
        .from('posts')
        .update({ status: newStatus })
        .eq('id', post.id);

      if (error) throw error;

      setIsPaused(!isPaused);
      toast({
        title: isPaused ? "Post Activated" : "Post Paused",
        description: isPaused 
          ? "The post has been activated and will be published as scheduled." 
          : "The post has been paused and won't be published until activated.",
      });
    } catch (error) {
      console.error('Error toggling post status:', error);
      toast({
        title: "Error",
        description: "Failed to update post status. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handlePublishNow = async () => {
    try {
      const { error } = await supabase
        .from('posts')
        .update({ 
          status: 'published',
          published_at: new Date().toISOString()
        })
        .eq('id', post.id);

      if (error) throw error;

      toast({
        title: "Post Published",
        description: "Your post has been published successfully.",
      });
    } catch (error) {
      console.error('Error publishing post:', error);
      toast({
        title: "Error",
        description: "Failed to publish post. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = () => {
    const statusConfig = {
      draft: { variant: "secondary", label: "Draft" },
      scheduled: { variant: "outline", label: "Scheduled" },
      published: { variant: "default", label: "Published" },
      paused: { variant: "destructive", label: "Paused" }
    };

    const config = statusConfig[post.status] || statusConfig.draft;
    return (
      <Badge variant={config.variant as any}>
        {config.label}
      </Badge>
    );
  };

  return (
    <Card className={`p-4 transition-colors ${isSelected ? 'bg-muted' : ''}`}>
      <div className="flex items-start gap-4">
        {onSelect && (
          <Checkbox
            checked={isSelected}
            onCheckedChange={() => onSelect(post.id)}
            className="mt-1"
          />
        )}
        
        <div className="flex-1 space-y-2">
          {post.time && (
            <p className="text-sm text-muted-foreground">
              {format(post.date, 'PPP')} at {post.time}
            </p>
          )}

          <div className="space-y-2">
            <p className="font-medium break-words">{post.content}</p>
          </div>

          <div className="flex flex-wrap gap-2 mt-2">
            {postPlatforms.map((platform) => (
              <Badge key={platform.id} variant="secondary" className="flex items-center gap-1">
                {platform.icon}
                {platform.name}
              </Badge>
            ))}
            
            {post.campaign && (
              <Badge variant="outline" className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {post.campaign.name}
              </Badge>
            )}

            {getStatusBadge()}
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {post.status !== 'published' && (
            <Button
              variant="ghost"
              size="icon"
              onClick={handlePublishNow}
              className="h-8 w-8"
              title="Publish Now"
            >
              <Send className="h-4 w-4" />
            </Button>
          )}

          {post.status === 'scheduled' && (
            <Button
              variant="ghost"
              size="icon"
              onClick={handlePauseToggle}
              className="h-8 w-8"
            >
              {isPaused ? (
                <Play className="h-4 w-4" />
              ) : (
                <Pause className="h-4 w-4" />
              )}
            </Button>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit(post)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onDelete(post.id)}
                className="text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </Card>
  );
}