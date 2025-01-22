import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PostList } from "./PostList";
import { PlatformId } from "@/constants/platforms";
import { FileText, Trash2 } from "lucide-react";
import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { DraftFilters } from "./draft-manager/DraftFilters";
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

  const handlePublishPost = async (postId: string) => {
    try {
      const { error } = await supabase
        .from('posts')
        .update({ 
          status: 'scheduled',
          published_at: new Date().toISOString()
        })
        .eq('id', postId);

      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Post scheduled for publishing",
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
          
          <DraftFilters
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            selectedPlatform={selectedPlatform}
            setSelectedPlatform={setSelectedPlatform}
            sortBy={sortBy}
            setSortBy={setSortBy}
            platforms={platforms}
          />
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
        handlePublishPost={handlePublishPost}
        isLoading={isLoading}
        selectedPosts={selectedDrafts}
        onSelectPost={handleSelectDraft}
      />
    </div>
  );
}