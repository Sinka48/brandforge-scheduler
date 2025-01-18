import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Calendar, FileText, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function QuickActions() {
  const navigate = useNavigate();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Button 
          variant="outline" 
          className="w-full justify-start gap-2"
          onClick={() => navigate("/calendar")}
        >
          <Plus className="h-4 w-4" />
          New Post
        </Button>
        <Button 
          variant="outline" 
          className="w-full justify-start gap-2"
          onClick={() => navigate("/calendar")}
        >
          <Calendar className="h-4 w-4" />
          Schedule Content
        </Button>
        <Button 
          variant="outline" 
          className="w-full justify-start gap-2"
          onClick={() => navigate("/campaigns")}
        >
          <Users className="h-4 w-4" />
          New Campaign
        </Button>
        <Button 
          variant="outline" 
          className="w-full justify-start gap-2"
          onClick={() => navigate("/calendar")}
        >
          <FileText className="h-4 w-4" />
          View Drafts
        </Button>
      </CardContent>
    </Card>
  );
}