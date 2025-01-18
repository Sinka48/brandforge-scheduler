import { PostItem } from "./PostItem";
import { EmptyState } from "./EmptyState";
import { LoadingState } from "./LoadingState";
import { Button } from "@/components/ui/button";
import { ChevronDown, Filter } from "lucide-react";
import { filterPostsByDate } from "../utils/dateUtils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { PlatformId } from "@/constants/platforms";

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

  if (filteredPosts.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Platforms</DropdownMenuLabel>
            {platforms.map((platform) => (
              <DropdownMenuCheckboxItem
                key={platform.id}
                checked={selectedPlatforms.includes(platform.id)}
                onCheckedChange={(checked) => {
                  setSelectedPlatforms(prev =>
                    checked
                      ? [...prev, platform.id]
                      : prev.filter(p => p !== platform.id)
                  );
                }}
              >
                {/* Render the icon component directly */}
                <div className="h-4 w-4 mr-2">
                  {platform.icon}
                </div>
                {platform.name}
              </DropdownMenuCheckboxItem>
            ))}
            {campaigns.length > 0 && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuLabel>Campaigns</DropdownMenuLabel>
                {campaigns.map((campaign) => (
                  <DropdownMenuCheckboxItem
                    key={campaign.id}
                    checked={selectedCampaigns.includes(campaign.id)}
                    onCheckedChange={(checked) => {
                      setSelectedCampaigns(prev =>
                        checked
                          ? [...prev, campaign.id]
                          : prev.filter(id => id !== campaign.id)
                      );
                    }}
                  >
                    {campaign.name}
                  </DropdownMenuCheckboxItem>
                ))}
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
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