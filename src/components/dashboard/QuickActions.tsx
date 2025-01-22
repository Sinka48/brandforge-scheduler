import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HelpCircle, Wand2, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function QuickActions() {
  const navigate = useNavigate();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4 md:grid-cols-3">
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
          onClick={() => navigate("/campaigns")}
        >
          <Wand2 className="h-4 w-4" />
          AI Campaign Beta
        </Button>
        <Button 
          variant="outline" 
          className="w-full justify-start gap-2"
          onClick={() => navigate("/calendar")}
        >
          <Plus className="h-4 w-4" />
          New Post
        </Button>
      </CardContent>
    </Card>
  );
}