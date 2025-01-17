import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Eye, Heart, Share2, TrendingUp } from "lucide-react";
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { format } from "date-fns";

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
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Views</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalViews.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Likes</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalLikes.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Shares</CardTitle>
            <Share2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalShares.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Engagement Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(avgEngagement || 0).toFixed(2)}%</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Performance Over Time</CardTitle>
          <Badge variant="secondary">{platform}</Badge>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ChartContainer
              config={{
                views: { theme: { light: "#0ea5e9", dark: "#0ea5e9" } },
                likes: { theme: { light: "#ec4899", dark: "#ec4899" } },
                shares: { theme: { light: "#22c55e", dark: "#22c55e" } },
              }}
            >
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <XAxis dataKey="date" />
                  <YAxis />
                  <ChartTooltip>
                    <ChartTooltipContent />
                  </ChartTooltip>
                  <Area
                    type="monotone"
                    dataKey="views"
                    stroke="var(--color-views)"
                    fill="var(--color-views)"
                    fillOpacity={0.2}
                    strokeWidth={2}
                  />
                  <Area
                    type="monotone"
                    dataKey="likes"
                    stroke="var(--color-likes)"
                    fill="var(--color-likes)"
                    fillOpacity={0.2}
                    strokeWidth={2}
                  />
                  <Area
                    type="monotone"
                    dataKey="shares"
                    stroke="var(--color-shares)"
                    fill="var(--color-shares)"
                    fillOpacity={0.2}
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}