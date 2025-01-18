import { cn } from "@/lib/utils";
import { PlatformId } from "@/constants/platforms";
import { Badge } from "@/components/ui/badge";
import { Clock, CheckCircle2, AlertCircle } from "lucide-react";

interface PostIndicatorProps {
  platform: PlatformId;
  status: 'draft' | 'scheduled' | 'published';
}

const platformColors: Record<PlatformId, string> = {
  instagram: "bg-pink-500/20 text-pink-700 dark:text-pink-400",
  linkedin: "bg-blue-500/20 text-blue-700 dark:text-blue-400",
  twitter: "bg-sky-500/20 text-sky-700 dark:text-sky-400",
  facebook: "bg-indigo-500/20 text-indigo-700 dark:text-indigo-400",
};

const statusIcons = {
  draft: AlertCircle,
  scheduled: Clock,
  published: CheckCircle2,
};

export function PostIndicator({ platform, status }: PostIndicatorProps) {
  const StatusIcon = statusIcons[status];
  
  return (
    <Badge 
      variant="secondary" 
      className={cn(
        "flex items-center gap-1 text-xs",
        platformColors[platform]
      )}
    >
      <StatusIcon className="h-3 w-3" />
      <span className="capitalize">{platform}</span>
    </Badge>
  );
}