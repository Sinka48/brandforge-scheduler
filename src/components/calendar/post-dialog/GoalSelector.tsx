import { Button } from "@/components/ui/button";

const POST_GOALS = [
  { id: 'followers', label: 'Get New Followers' },
  { id: 'engagement', label: 'Boost Engagement' },
  { id: 'awareness', label: 'Raise Brand Awareness' },
  { id: 'traffic', label: 'Drive Website Traffic' },
  { id: 'leads', label: 'Generate Leads' },
  { id: 'sales', label: 'Increase Sales' },
  { id: 'community', label: 'Build Community' },
  { id: 'authority', label: 'Establish Authority' }
];

interface GoalSelectorProps {
  selectedGoal: string | null;
  onGoalSelect: (goal: string | null) => void;
}

export function GoalSelector({ selectedGoal, onGoalSelect }: GoalSelectorProps) {
  return (
    <div className="space-y-2">
      <p className="text-xs text-muted-foreground">Select post goal (optional)</p>
      <div className="flex flex-wrap gap-1.5">
        {POST_GOALS.map((goal) => (
          <Button
            key={goal.id}
            size="sm"
            variant={selectedGoal === goal.id ? "default" : "outline"}
            className="text-xs h-7"
            onClick={() => onGoalSelect(selectedGoal === goal.id ? null : goal.id)}
          >
            {goal.label}
          </Button>
        ))}
      </div>
    </div>
  );
}