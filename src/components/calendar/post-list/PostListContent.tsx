import { PostItem } from "./PostItem";
import { EmptyState } from "./EmptyState";
import { LoadingState } from "./LoadingState";
import { Button } from "@/components/ui/button";
import { ChevronDown, Clock } from "lucide-react";
import { filterPostsByDate } from "../utils/dateUtils";
import { useState, useEffect } from "react";
import { PlatformId } from "@/constants/platforms";
import { formatDistanceToNow, differenceInHours, differenceInMinutes } from "date-fns";
import { Badge } from "@/components/ui/badge";

interface PostListContentProps {
  selectedDate: Date | undefined;
  posts: any[];
  platforms: any[];
  handleDeletePost: (postId: string) => void;
  handleEditPost: (post: any) => void;
  showAllPosts: boolean;
  setShowAllPosts: (show: boolean) => void;
  selectedPosts?: string[];
  onSelectPost?: (postId: string) => void;
}

export function PostListContent({
  selectedDate,
  posts,
  platforms,
  handleDeletePost,
  handleEditPost,
  showAllPosts,
  setShowAllPosts,
  selectedPosts = [],
  onSelectPost
}: PostListContentProps) {
  const [selectedPlatforms, setSelectedPlatforms] = useState<PlatformId[]>([]);
  const [selectedCampaigns, setSelectedCampaigns] = useState<string[]>([]);
  const [nextPost, setNextPost] = useState<any>(null);
  const [timeLeft, setTimeLeft] = useState<string>("");
  const [exactTimeLeft, setExactTimeLeft] = useState<string>("");

  // Get unique campaigns from posts
  const campaigns = Array.from(new Set(posts
    .filter(post => post.campaign)
    .map(post => post.campaign)))
    .map(campaign => ({
      id: campaign.id,
      name: campaign.name
    }));

  const filteredPosts = filterPostsByDate(posts, selectedDate)
    .filter(post => 
      (selectedPlatforms.length === 0 || post.platforms.some(p => selectedPlatforms.includes(p))) &&
      (selectedCampaigns.length === 0 || (post.campaign && selectedCampaigns.includes(post.campaign.id)))
    );

  const displayPosts = selectedDate
    ? filteredPosts
    : showAllPosts 
      ? filteredPosts
      : filteredPosts.slice(0, 3);

  useEffect(() => {
    // Find the next upcoming post
    const now = new Date();
    const upcomingPosts = posts
      .filter(post => new Date(post.date) > now)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    if (upcomingPosts.length > 0) {
      setNextPost(upcomingPosts[0]);
    }
  }, [posts]);

  useEffect(() => {
    if (!nextPost) return;

    const timer = setInterval(() => {
      const now = new Date();
      const postDate = new Date(nextPost.date);
      const timeUntilPost = formatDistanceToNow(postDate, { addSuffix: true });
      setTimeLeft(timeUntilPost);

      // Calculate exact hours and minutes
      const hoursLeft = differenceInHours(postDate, now);
      const minutesLeft = differenceInMinutes(postDate, now) % 60;
      setExactTimeLeft(`${hoursLeft}h ${minutesLeft}m`);
    }, 1000);

    return () => clearInterval(timer);
  }, [nextPost]);

  if (filteredPosts.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col space-y-4">
        {nextPost && (
          <div className="flex flex-col bg-muted p-3 rounded-md space-y-2">
            <div className="flex items-center justify-end gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                Next post {timeLeft}
              </span>
            </div>
            <div className="text-right text-sm text-muted-foreground/80">
              Next post in: {exactTimeLeft}
            </div>
          </div>
        )}

        <div className="flex flex-wrap gap-2">
          {platforms.map((platform) => (
            <Badge
              key={platform.id}
              variant={selectedPlatforms.includes(platform.id) ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => {
                setSelectedPlatforms(prev =>
                  prev.includes(platform.id)
                    ? prev.filter(p => p !== platform.id)
                    : [...prev, platform.id]
                );
              }}
            >
              <div className="h-4 w-4 mr-2">
                {platform.icon}
              </div>
              {platform.name}
            </Badge>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {displayPosts.map((post, index) => (
          <div
            key={post.id}
            className="transform transition-all duration-200 hover:translate-y-[-2px]"
            style={{
              animationDelay: `${index * 100}ms`,
              animation: 'fade-in 0.5s ease-out forwards'
            }}
          >
            <PostItem
              post={post}
              platforms={platforms}
              onEdit={handleEditPost}
              onDelete={handleDeletePost}
              isSelected={selectedPosts.includes(post.id)}
              onSelect={onSelectPost}
            />
          </div>
        ))}
      </div>
      
      {!selectedDate && filteredPosts.length > 3 && (
        <div className="text-center pt-4">
          <Button
            variant="ghost"
            className="w-full hover:bg-accent transition-all duration-200 group"
            onClick={() => setShowAllPosts(!showAllPosts)}
          >
            <ChevronDown 
              className={`mr-2 h-4 w-4 transition-transform duration-200 group-hover:scale-110 ${
                showAllPosts ? 'rotate-180' : ''
              }`} 
            />
            {showAllPosts ? "Show Less" : `Show ${filteredPosts.length - 3} More Posts`}
          </Button>
        </div>
      )}

      <style>
        {`
          @keyframes fade-in {
            from {
              opacity: 0;
              transform: translateY(10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}
      </style>
    </div>
  );
}