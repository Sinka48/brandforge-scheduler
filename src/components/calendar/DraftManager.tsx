import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { PostList } from "./PostList";
import { PlatformId } from "@/constants/platforms";
import { Search, FileText, Filter, Trash2 } from "lucide-react";
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";

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
}

interface DraftManagerProps {
  posts: Post[];
  platforms: Platform[];
  handleDeletePost: (postId: string) => void;
  handleEditPost: (post: Post) => void;
  isLoading?: boolean;
}

export function DraftManager({
  posts,
  platforms,
  handleDeletePost,
  handleEditPost,
  isLoading
}: DraftManagerProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPlatform, setSelectedPlatform] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"date" | "content">("date");
  const [selectedDrafts, setSelectedDrafts] = useState<string[]>([]);
  const { toast } = useToast();

  const draftPosts = posts.filter(post => {
    const matchesSearch = post.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPlatform = selectedPlatform === "all" || post.platforms.includes(selectedPlatform as PlatformId);
    return post.status === 'draft' && matchesSearch && matchesPlatform;
  }).sort((a, b) => {
    if (sortBy === "date") {
      return b.date.getTime() - a.date.getTime();
    }
    return a.content.localeCompare(b.content);
  });

  const handleSelectDraft = (postId: string) => {
    setSelectedDrafts(prev => 
      prev.includes(postId) 
        ? prev.filter(id => id !== postId)
        : [...prev, postId]
    );
  };

  const handleSelectAll = () => {
    if (selectedDrafts.length === draftPosts.length) {
      setSelectedDrafts([]);
    } else {
      setSelectedDrafts(draftPosts.map(post => post.id));
    }
  };

  const handleBulkDelete = () => {
    if (selectedDrafts.length === 0) return;

    // Show confirmation toast
    toast({
      title: `Delete ${selectedDrafts.length} drafts?`,
      description: "This action cannot be undone.",
      action: (
        <Button
          variant="destructive"
          size="sm"
          onClick={() => {
            selectedDrafts.forEach(id => handleDeletePost(id));
            setSelectedDrafts([]);
            toast({
              title: "Drafts deleted",
              description: `${selectedDrafts.length} drafts have been deleted.`
            });
          }}
        >
          Delete
        </Button>
      ),
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          <h2 className="text-lg font-semibold">Drafts</h2>
          <Badge variant="secondary">{draftPosts.length}</Badge>
        </div>
        
        <div className="flex items-center gap-4">
          {selectedDrafts.length > 0 && (
            <Button
              variant="destructive"
              size="sm"
              onClick={handleBulkDelete}
              className="flex items-center gap-2"
            >
              <Trash2 className="h-4 w-4" />
              Delete ({selectedDrafts.length})
            </Button>
          )}
          
          <Select value={sortBy} onValueChange={(value: "date" | "content") => setSortBy(value)}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date">Sort by Date</SelectItem>
              <SelectItem value="content">Sort by Content</SelectItem>
            </SelectContent>
          </Select>

          <Select value={selectedPlatform} onValueChange={setSelectedPlatform}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Platform" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Platforms</SelectItem>
              {platforms.map((platform) => (
                <SelectItem key={platform.id} value={platform.id}>
                  <div className="flex items-center gap-2">
                    {platform.icon}
                    {platform.name}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="relative w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search drafts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>
      </div>

      {draftPosts.length > 0 && (
        <div className="flex items-center gap-2 py-2">
          <Checkbox
            checked={selectedDrafts.length === draftPosts.length}
            onCheckedChange={handleSelectAll}
          />
          <span className="text-sm text-muted-foreground">
            {selectedDrafts.length === 0 
              ? "Select all"
              : `${selectedDrafts.length} selected`}
          </span>
        </div>
      )}

      <PostList
        selectedDate={undefined}
        posts={draftPosts}
        platforms={platforms}
        handleDeletePost={handleDeletePost}
        handleEditPost={handleEditPost}
        isLoading={isLoading}
        selectedPosts={selectedDrafts}
        onSelectPost={handleSelectDraft}
      />
    </div>
  );
}