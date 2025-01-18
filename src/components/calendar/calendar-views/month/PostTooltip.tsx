import { format } from "date-fns";
import { Instagram, Linkedin, Twitter, Facebook } from "lucide-react";
import { PlatformId } from "@/constants/platforms";
import { Post } from "../MonthView";
import {
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface PostTooltipProps {
  date: Date;
  posts: Post[];
  children: React.ReactNode;
}

const platformIcons: Record<PlatformId, React.ReactNode> = {
  instagram: <Instagram className="h-3 w-3" />,
  linkedin: <Linkedin className="h-3 w-3" />,
  twitter: <Twitter className="h-3 w-3" />,
  facebook: <Facebook className="h-3 w-3" />,
};

export function PostTooltip({ date, posts, children }: PostTooltipProps) {
  if (posts.length === 0) return children;

  return (
    <TooltipProvider>
      <TooltipTrigger asChild>
        {children}
      </TooltipTrigger>
      <TooltipContent className="p-2 space-y-2">
        <p className="text-xs font-medium">{format(date, 'MMMM d, yyyy')}</p>
        <div className="space-y-1.5">
          {posts.map((post) => (
            <div 
              key={post.id} 
              className="flex items-start gap-2 text-xs group/post animate-in fade-in-50 duration-200"
            >
              <div className="flex items-center gap-1 min-w-[60px] text-muted-foreground">
                {platformIcons[post.platforms[0] as PlatformId]}
                <span>{post.time}</span>
              </div>
              <p className="line-clamp-2 group-hover/post:text-primary transition-colors">
                {post.content}
              </p>
            </div>
          ))}
        </div>
      </TooltipContent>
    </TooltipProvider>
  );
}