import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Wand2, HelpCircle, GitBranch } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { PostDialog } from "@/components/calendar/PostDialog";

export function QuickActions() {
  const navigate = useNavigate();
  const [isPostDialogOpen, setIsPostDialogOpen] = useState(false);
  const [newPost, setNewPost] = useState({
    content: "",
    platforms: [],
    status: "draft",
    time: "",
  });

  const handleAddPost = async () => {
    setIsPostDialogOpen(false);
  };

  const handleSaveAsDraft = () => {
    setIsPostDialogOpen(false);
  };

  const handlePlatformToggle = (platformId: string) => {
    setNewPost(prev => ({
      ...prev,
      platforms: prev.platforms.includes(platformId)
        ? prev.platforms.filter(p => p !== platformId)
        : [...prev.platforms, platformId]
    }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4 md:grid-cols-3">
        <Button 
          variant="outline" 
          className="w-full justify-start gap-2"
          onClick={() => navigate("/campaigns")}
        >
          <Wand2 className="h-4 w-4" />
          AI Campaign
          <Badge variant="secondary" className="ml-auto">
            Beta
          </Badge>
        </Button>
        
        <Button 
          variant="outline" 
          className="w-full justify-start gap-2"
          onClick={() => navigate("/how-it-works")}
        >
          <HelpCircle className="h-4 w-4" />
          How It Works
        </Button>

        <Button 
          variant="outline" 
          className="w-full justify-start gap-2"
          onClick={() => navigate("/roadmap")}
        >
          <GitBranch className="h-4 w-4 text-blue-500" />
          Roadmap
        </Button>

        <PostDialog
          isOpen={isPostDialogOpen}
          onOpenChange={setIsPostDialogOpen}
          newPost={newPost}
          setNewPost={setNewPost}
          handleAddPost={handleAddPost}
          handleSaveAsDraft={handleSaveAsDraft}
          handlePlatformToggle={handlePlatformToggle}
        />
      </CardContent>
    </Card>
  );
}