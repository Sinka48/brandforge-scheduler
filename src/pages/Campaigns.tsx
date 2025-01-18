import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Play, Pause, Edit, Trash2, Plus, Wand2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { useState } from "react";
import { AICampaignDialog } from "@/components/calendar/AICampaignDialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PlatformSelector } from "@/components/calendar/post-dialog/PlatformSelector";
import { Layout } from "@/components/layout/Layout";
import { Session } from "@supabase/supabase-js";

interface CampaignsPageProps {
  session: Session;
}

export default function CampaignsPage({ session }: CampaignsPageProps) {
  const { toast } = useToast();
  const [isAIDialogOpen, setIsAIDialogOpen] = useState(false);
  const [isManualDialogOpen, setIsManualDialogOpen] = useState(false);
  const [newCampaign, setNewCampaign] = useState({
    name: "",
    description: "",
    platforms: [] as string[],
    duration: "7",
    tone: "professional"
  });

  const { data: campaigns, isLoading, refetch } = useQuery({
    queryKey: ['campaigns'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('Not authenticated');
      }

      const { data, error } = await supabase
        .from('campaigns')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const handleStatusChange = async (campaignId: string, newStatus: string) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('Not authenticated');
      }

      const { error } = await supabase
        .from('campaigns')
        .update({ status: newStatus })
        .eq('id', campaignId)
        .eq('user_id', session.user.id);

      if (error) throw error;

      toast({
        title: "Campaign Updated",
        description: `Campaign status changed to ${newStatus}`,
      });

      refetch();
    } catch (error) {
      console.error('Error updating campaign:', error);
      toast({
        title: "Error",
        description: "Failed to update campaign status",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (campaignId: string) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('Not authenticated');
      }

      const { error } = await supabase
        .from('campaigns')
        .delete()
        .eq('id', campaignId)
        .eq('user_id', session.user.id);

      if (error) throw error;

      toast({
        title: "Campaign Deleted",
        description: "Campaign has been deleted successfully",
      });

      refetch();
    } catch (error) {
      console.error('Error deleting campaign:', error);
      toast({
        title: "Error",
        description: "Failed to delete campaign",
        variant: "destructive",
      });
    }
  };

  const handleCreateManualCampaign = async () => {
    if (!newCampaign.name.trim() || !newCampaign.description.trim() || newCampaign.platforms.length === 0) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('Not authenticated');
      }

      const { error } = await supabase
        .from('campaigns')
        .insert({
          name: newCampaign.name,
          description: newCampaign.description,
          platforms: newCampaign.platforms,
          status: 'draft',
          settings: {
            duration: parseInt(newCampaign.duration),
            tone: newCampaign.tone
          },
          user_id: session.user.id
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Campaign created successfully",
      });

      setIsManualDialogOpen(false);
      setNewCampaign({
        name: "",
        description: "",
        platforms: [],
        duration: "7",
        tone: "professional"
      });
      refetch();
    } catch (error) {
      console.error('Error creating campaign:', error);
      toast({
        title: "Error",
        description: "Failed to create campaign",
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      draft: "bg-gray-500",
      scheduled: "bg-blue-500",
      active: "bg-green-500",
      paused: "bg-yellow-500",
      completed: "bg-purple-500",
    };
    return colors[status] || "bg-gray-500";
  };

  const handlePlatformToggle = (platformId: string) => {
    setNewCampaign(prev => ({
      ...prev,
      platforms: prev.platforms.includes(platformId)
        ? prev.platforms.filter(p => p !== platformId)
        : [...prev.platforms, platformId]
    }));
  };

  return (
    <Layout session={session}>
      <div className="container mx-auto py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Campaigns</h1>
            <p className="text-muted-foreground mt-1">
              Manage and track your marketing campaigns
            </p>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => setIsManualDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              New Campaign
            </Button>
            <Button onClick={() => setIsAIDialogOpen(true)} variant="secondary">
              <Wand2 className="h-4 w-4 mr-2" />
              AI Campaign
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-8">Loading campaigns...</div>
        ) : campaigns?.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-muted-foreground">No campaigns found. Create your first campaign!</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {campaigns?.map((campaign) => (
              <Card key={campaign.id}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-xl font-semibold">
                    {campaign.name}
                  </CardTitle>
                  <Badge className={getStatusColor(campaign.status)}>
                    {campaign.status}
                  </Badge>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-muted-foreground mb-4">
                    {campaign.description}
                  </div>
                  <div className="flex flex-col gap-2 sm:flex-row sm:gap-4">
                    <div className="text-sm">
                      Start: {campaign.start_date ? format(new Date(campaign.start_date), 'PPP') : 'Not set'}
                    </div>
                    <div className="text-sm">
                      End: {campaign.end_date ? format(new Date(campaign.end_date), 'PPP') : 'Not set'}
                    </div>
                    <div className="text-sm">
                      Platforms: {campaign.platforms.join(', ')}
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4">
                    {campaign.status === 'active' ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleStatusChange(campaign.id, 'paused')}
                      >
                        <Pause className="h-4 w-4 mr-2" />
                        Pause
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleStatusChange(campaign.id, 'active')}
                        disabled={campaign.status === 'completed'}
                      >
                        <Play className="h-4 w-4 mr-2" />
                        Start
                      </Button>
                    )}
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(campaign.id)}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <AICampaignDialog 
          isOpen={isAIDialogOpen}
          onOpenChange={setIsAIDialogOpen}
          onGenerateCampaign={() => {
            refetch();
            setIsAIDialogOpen(false);
          }}
        />

        <Dialog open={isManualDialogOpen} onOpenChange={setIsManualDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Create New Campaign</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Campaign Name</Label>
                <Input
                  id="name"
                  value={newCampaign.name}
                  onChange={(e) => setNewCampaign(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter campaign name"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newCampaign.description}
                  onChange={(e) => setNewCampaign(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Enter campaign description"
                />
              </div>

              <PlatformSelector
                selectedPlatforms={newCampaign.platforms}
                onPlatformToggle={handlePlatformToggle}
              />

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="duration">Campaign Duration (days)</Label>
                  <Select 
                    value={newCampaign.duration}
                    onValueChange={(value) => setNewCampaign(prev => ({ ...prev, duration: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select duration" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="3">3 days</SelectItem>
                      <SelectItem value="7">1 week</SelectItem>
                      <SelectItem value="14">2 weeks</SelectItem>
                      <SelectItem value="30">1 month</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tone">Campaign Tone</Label>
                  <Select 
                    value={newCampaign.tone}
                    onValueChange={(value) => setNewCampaign(prev => ({ ...prev, tone: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select tone" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="professional">Professional</SelectItem>
                      <SelectItem value="casual">Casual</SelectItem>
                      <SelectItem value="friendly">Friendly</SelectItem>
                      <SelectItem value="humorous">Humorous</SelectItem>
                      <SelectItem value="formal">Formal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsManualDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateManualCampaign}>
                Create Campaign
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
}
