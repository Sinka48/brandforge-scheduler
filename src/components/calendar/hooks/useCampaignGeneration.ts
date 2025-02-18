
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { addDays } from "date-fns";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

export function useCampaignGeneration() {
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [generatedPosts, setGeneratedPosts] = useState<any[]>([]);
  const [campaignId, setCampaignId] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const generateCampaign = async ({
    name,
    goal,
    platforms,
    duration,
    tone,
    postsCount,
    selectedBrandId,
    brands,
  }: {
    name: string;
    goal: string;
    platforms: string[];
    duration: string;
    tone: string;
    postsCount: number;
    selectedBrandId: string;
    brands: any[];
  }) => {
    if (!validateInputs({ name, goal, platforms, selectedBrandId })) return;

    setIsLoading(true);
    setProgress(0);
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('Not authenticated');
      }

      const selectedBrand = brands.find(b => b.id === selectedBrandId);
      
      const startDate = new Date();
      const endDate = addDays(startDate, parseInt(duration));

      const { data: campaignData, error: campaignError } = await supabase
        .from('campaigns')
        .insert({
          name,
          description: goal,
          platforms: platforms.map(p => p.toLowerCase()),
          status: 'draft',
          start_date: startDate.toISOString(),
          end_date: endDate.toISOString(),
          settings: {
            duration,
            tone,
            postsCount,
            brandId: selectedBrandId
          },
          user_id: session.user.id
        })
        .select()
        .single();

      if (campaignError) throw campaignError;
      setCampaignId(campaignData.id);

      const { data, error } = await supabase.functions.invoke('generate-campaign', {
        body: { 
          goal,
          platforms: platforms.map(p => p.toLowerCase()),
          duration: parseInt(duration),
          tone,
          postsCount,
          brand: {
            name: selectedBrand?.metadata?.name,
            story: selectedBrand?.metadata?.story,
            industry: selectedBrand?.metadata?.industry,
            targetAudience: selectedBrand?.metadata?.targetAudience,
            brandPersonality: selectedBrand?.metadata?.brandPersonality,
          }
        },
      });

      if (error) throw error;

      setGeneratedPosts(data.campaign);
      setProgress(100);

      toast({
        title: "Campaign Generated",
        description: "Campaign content has been generated successfully. Click Save to finalize.",
      });
    } catch (error) {
      console.error('Error generating campaign:', error);
      toast({
        title: "Generation Failed",
        description: error instanceof Error ? error.message : "Failed to generate campaign",
        variant: "destructive",
      });
      setProgress(0);
    } finally {
      setIsLoading(false);
    }
  };

  const validateInputs = ({
    name,
    goal,
    platforms,
    selectedBrandId,
  }: {
    name: string;
    goal: string;
    platforms: string[];
    selectedBrandId: string;
  }) => {
    if (!name.trim()) {
      toast({
        title: "Missing Information",
        description: "Please enter a campaign name",
        variant: "destructive",
      });
      return false;
    }

    if (!goal) {
      toast({
        title: "Missing Information",
        description: "Please select a campaign goal",
        variant: "destructive",
      });
      return false;
    }

    if (platforms.length === 0) {
      toast({
        title: "Missing Information",
        description: "Please select at least one platform",
        variant: "destructive",
      });
      return false;
    }

    if (!selectedBrandId) {
      toast({
        title: "Missing Information",
        description: "Please select a brand",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const saveCampaign = async () => {
    if (!campaignId || !generatedPosts.length) return;

    setIsLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Not authenticated');

      const startDate = new Date();

      for (const post of generatedPosts) {
        const [hours, minutes] = post.time.split(':').map(Number);
        const scheduledDate = new Date(startDate);
        scheduledDate.setHours(hours, minutes, 0, 0);
        const finalDate = addDays(scheduledDate, generatedPosts.indexOf(post));

        await supabase.from('posts').insert({
          content: post.content,
          platform: post.platform.toLowerCase(),
          status: 'draft',
          campaign_id: campaignId,
          scheduled_for: finalDate.toISOString(),
          user_id: session.user.id
        });
      }

      await queryClient.invalidateQueries({ queryKey: ['campaigns'] });
      await queryClient.invalidateQueries({ queryKey: ['posts'] });

      toast({
        title: "Campaign Saved",
        description: "Campaign and posts have been saved successfully",
      });

      navigate('/campaigns');
    } catch (error) {
      console.error('Error saving campaign:', error);
      toast({
        title: "Save Failed",
        description: error instanceof Error ? error.message : "Failed to save campaign",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const regeneratePost = async (index: number, goal: string, platforms: string[]) => {
    if (!generatedPosts[index]) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-campaign', {
        body: { 
          goal,
          platforms: [generatedPosts[index].platform.toLowerCase()],
          duration: 1,
          tone: 'professional',
        },
      });

      if (error) throw error;

      const newPost = data.campaign[0];
      const updatedPosts = [...generatedPosts];
      updatedPosts[index] = newPost;
      setGeneratedPosts(updatedPosts);

      toast({
        title: "Post Regenerated",
        description: "The post has been regenerated successfully",
      });
    } catch (error) {
      console.error('Error regenerating post:', error);
      toast({
        title: "Regeneration Failed",
        description: error instanceof Error ? error.message : "Failed to regenerate post",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    progress,
    generatedPosts,
    generateCampaign,
    saveCampaign,
    regeneratePost,
    setGeneratedPosts,
    setCampaignId
  };
}
