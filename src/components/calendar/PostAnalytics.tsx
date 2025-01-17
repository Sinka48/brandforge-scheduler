import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { Eye, Heart, Share2, TrendingUp } from "lucide-react";
import { format } from "date-fns";
import { MetricCard } from "./analytics/MetricCard";
import { PerformanceChart } from "./analytics/PerformanceChart";

interface PostAnalytics {
  views: number;
  likes: number;
  shares: number;
  engagement_rate: number;
  measured_at: string;
}

interface PostAnalyticsProps {
  postId: string;
  platform: string;
}

export function PostAnalytics({ postId, platform }: PostAnalyticsProps) {
  const [timeframe] = useState("7d");

  const { data: analytics, isLoading } = useQuery({
    queryKey: ["post-analytics", postId, timeframe],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("post_analytics")
        .select("*")
        .eq("post_id", postId)
        .order("measured_at", { ascending: true });

      if (error) throw error;
      return data as PostAnalytics[];
    },
  });

  if (isLoading) {
    return <Skeleton className="h-[300px] w-full" />;
  }

  const totalViews = analytics?.reduce((sum, item) => sum + (item.views || 0), 0) || 0;
  const totalLikes = analytics?.reduce((sum, item) => sum + (item.likes || 0), 0) || 0;
  const totalShares = analytics?.reduce((sum, item) => sum + (item.shares || 0), 0) || 0;
  const avgEngagement = analytics?.reduce((sum, item) => sum + (item.engagement_rate || 0), 0) / (analytics?.length || 1);

  const chartData = analytics?.map((item) => ({
    date: format(new Date(item.measured_at), "MMM dd"),
    views: item.views,
    likes: item.likes,
    shares: item.shares,
  }));

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard
          title="Total Views"
          value={totalViews.toLocaleString()}
          icon={Eye}
        />
        <MetricCard
          title="Total Likes"
          value={totalLikes.toLocaleString()}
          icon={Heart}
        />
        <MetricCard
          title="Total Shares"
          value={totalShares.toLocaleString()}
          icon={Share2}
        />
        <MetricCard
          title="Engagement Rate"
          value={`${(avgEngagement || 0).toFixed(2)}%`}
          icon={TrendingUp}
        />
      </div>

      <PerformanceChart data={chartData || []} platform={platform} />
    </div>
  );
}