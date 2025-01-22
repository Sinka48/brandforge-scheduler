import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function Roadmap() {
  const roadmapItems = [
    {
      title: "Q2 2024",
      status: "in-progress",
      features: [
        "Enhanced AI Campaign Generation",
        "Multi-Platform Analytics Dashboard",
        "Advanced Content Calendar",
      ]
    },
    {
      title: "Q3 2024",
      status: "planned",
      features: [
        "AI Image Generation",
        "Team Collaboration Features",
        "Custom Workflow Automation",
      ]
    },
    {
      title: "Q4 2024",
      status: "planned",
      features: [
        "Advanced Analytics & Reporting",
        "Content Performance Predictions",
        "Integration with More Platforms",
      ]
    }
  ];

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Product Roadmap</h1>
        <p className="text-muted-foreground">
          Our vision for the future of social media management
        </p>
      </div>

      <div className="grid gap-6">
        {roadmapItems.map((quarter) => (
          <Card key={quarter.title}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{quarter.title}</CardTitle>
                <Badge variant={quarter.status === "in-progress" ? "default" : "secondary"}>
                  {quarter.status === "in-progress" ? "In Progress" : "Planned"}
                </Badge>
              </div>
              <CardDescription>Upcoming features and improvements</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {quarter.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                    {feature}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}