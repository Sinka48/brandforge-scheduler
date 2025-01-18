import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { PlatformId } from "@/constants/platforms";
import { Edit, Trash2, MoreVertical, Calendar, Pause, Play } from "lucide-react";
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
  platforms: PlatformId[];
  image?: string;
  status: 'draft' | 'scheduled' | 'paused';
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
  const postPlatforms = platforms.filter(p => post.platforms.includes(p.id));

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
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <p className="font-medium break-words">{post.content}</p>
              {post.time && (
                <p className="text-sm text-muted-foreground">
                  {format(post.date, 'PPP')} at {post.time}
                </p>
              )}
              <div className="flex flex-wrap gap-2 mt-2">
                {/* Platform badges */}
                {postPlatforms.map((platform) => (
                  <Badge key={platform.id} variant="secondary" className="flex items-center gap-1">
                    {platform.icon}
                    {platform.name}
                  </Badge>
                ))}
                
                {/* Campaign badge if post is part of a campaign */}
                {post.campaign && (
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {post.campaign.name}
                  </Badge>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-2">
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

          {post.image && (
            <img
              src={post.image}
              alt="Post preview"
              className="rounded-md max-h-32 object-cover"
            />
          )}
        </div>
      </div>
    </Card>
  );
}