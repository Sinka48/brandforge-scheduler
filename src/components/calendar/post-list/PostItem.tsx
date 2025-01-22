import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { PlatformId } from "@/constants/platforms";
import { Edit, Trash2, MoreVertical, Calendar, Send, FileText } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { format } from "date-fns";
import { useState } from "react";
import { LucideIcon } from "lucide-react";

interface Platform {
  id: PlatformId;
  name: string;
  icon: LucideIcon;
}

interface Post {
  id: string;
  content: string;
  date: Date;
  platforms: PlatformId[] | PlatformId;
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
  platforms: readonly Platform[];
  onEdit: (post: Post) => void;
  onDelete: (postId: string) => void;
  onPublish: (postId: string) => void;
  isSelected?: boolean;
  onSelect?: (postId: string) => void;
}

export function PostItem({ 
  post, 
  platforms, 
  onEdit, 
  onDelete,
  onPublish,
  isSelected,
  onSelect
}: PostItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const platformsArray = Array.isArray(post.platforms) ? post.platforms : [post.platforms];
  const postPlatforms = platforms.filter(p => platformsArray.includes(p.id));

  const truncatedContent = isExpanded ? post.content : post.content.slice(0, 150);
  const shouldTruncate = post.content.length > 150;

  return (
    <Card className={`p-6 transition-colors ${isSelected ? 'bg-muted' : ''}`}>
      <div className="flex items-start gap-4">
        {post.status === 'draft' && onSelect && (
          <Checkbox
            checked={isSelected}
            onCheckedChange={() => onSelect(post.id)}
            className="mt-1"
          />
        )}
        
        <div className="flex-1 space-y-4">
          {post.time && (
            <p className="text-sm text-muted-foreground">
              {format(post.date, 'PPP')} at {post.time}
            </p>
          )}

          <div className="space-y-3">
            <p className="font-medium break-words">
              {truncatedContent}
              {shouldTruncate && !isExpanded && "..."}
            </p>
            {shouldTruncate && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-muted-foreground hover:text-foreground"
              >
                {isExpanded ? "Show less" : "Read more"}
              </Button>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            {postPlatforms.map((platform) => {
              const Icon = platform.icon;
              return (
                <Badge key={platform.id} variant="secondary" className="flex items-center gap-1.5">
                  <Icon className="h-3 w-3" />
                  {platform.name}
                </Badge>
              );
            })}
            
            {post.campaign && (
              <Badge variant="outline" className="flex items-center gap-1.5">
                <Calendar className="h-3 w-3" />
                {post.campaign.name}
              </Badge>
            )}

            <Badge 
              variant={post.status === 'scheduled' ? 'default' : 'secondary'}
              className="flex items-center gap-1.5"
            >
              <FileText className="h-3 w-3" />
              {post.status}
            </Badge>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          {post.status === 'draft' && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPublish(post.id)}
              className="flex items-center gap-2"
            >
              <Send className="h-4 w-4" />
              Publish
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