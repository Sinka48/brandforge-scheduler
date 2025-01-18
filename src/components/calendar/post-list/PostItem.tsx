import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { PlatformId } from "@/constants/platforms";
import { Edit, Trash2, MoreVertical, Calendar } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { format } from "date-fns";

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
  status: 'draft' | 'scheduled';
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
  const postPlatforms = platforms.filter(p => post.platforms.includes(p.id));

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
              {post.campaign && (
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {post.campaign.name}
                  </Badge>
                </div>
              )}
            </div>
            
            <div className="flex items-center gap-2">
              <div className="flex -space-x-1">
                {postPlatforms.map((platform) => (
                  <div
                    key={platform.id}
                    className="h-6 w-6 rounded-full bg-background border-2 border-muted flex items-center justify-center"
                  >
                    {platform.icon}
                  </div>
                ))}
              </div>

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