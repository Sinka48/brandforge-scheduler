import { cn } from "@/lib/utils";
import { PlatformId } from "@/constants/platforms";
import { Post } from "../MonthView";

interface PlatformIndicatorsProps {
  posts: Post[];
}

const platformColors: Record<PlatformId, string> = {
  instagram: "bg-pink-500",
  linkedin: "bg-blue-500",
  twitter: "bg-sky-500",
  facebook: "bg-indigo-500",
};

export function PlatformIndicators({ posts }: PlatformIndicatorsProps) {
  const platforms = Array.from(new Set(posts.flatMap(post => post.platforms)));

  if (platforms.length === 0) return null;

  return (
    <div className="absolute bottom-0 left-0 right-0 flex justify-center gap-0.5">
      {platforms.map((platform) => (
        <div
          key={platform}
          className={cn(
            "h-1.5 w-1.5 rounded-full transition-transform",
            platformColors[platform as PlatformId],
            "group-hover:scale-110"
          )}
        />
      ))}
    </div>
  );
}