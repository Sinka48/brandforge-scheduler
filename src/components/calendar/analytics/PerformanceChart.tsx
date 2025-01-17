import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChartContainer } from "@/components/ui/chart";
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";

interface ChartData {
  date: string;
  views: number;
  likes: number;
  shares: number;
}

interface PerformanceChartProps {
  data: ChartData[];
  platform: string;
}

export function PerformanceChart({ data, platform }: PerformanceChartProps) {
  return (
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
              <AreaChart data={data}>
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="rounded-lg border bg-background p-2 shadow-sm">
                        <div className="grid grid-cols-2 gap-2">
                          <div className="flex flex-col">
                            <span className="text-[0.70rem] uppercase text-muted-foreground">
                              {label}
                            </span>
                          </div>
                          {payload.map((item) => (
                            <div
                              key={item.name}
                              className="flex flex-col gap-1"
                            >
                              <span className="text-[0.70rem] uppercase text-muted-foreground">
                                {item.name}
                              </span>
                              <span className="font-bold">
                                {item.value}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  }
                  return null;
                }} />
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
  );
}