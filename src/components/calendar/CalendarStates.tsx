import { Card } from "@/components/ui/card";

interface CalendarStateProps {
  children: React.ReactNode;
}

export function CalendarState({ children }: CalendarStateProps) {
  return (
    <Card className="p-4">
      <div className="text-center py-8">
        {children}
      </div>
    </Card>
  );
}

export function LoadingState() {
  return (
    <CalendarState>
      <p className="text-muted-foreground">Loading posts...</p>
    </CalendarState>
  );
}

export function AuthCheckingState() {
  return (
    <CalendarState>
      <p className="text-muted-foreground">Checking authentication...</p>
    </CalendarState>
  );
}

export function UnauthenticatedState() {
  return (
    <CalendarState>
      <p className="text-muted-foreground">Please sign in to view your posts</p>
    </CalendarState>
  );
}

export function ErrorState() {
  return (
    <CalendarState>
      <p className="text-destructive">Error loading posts. Please try again.</p>
    </CalendarState>
  );
}