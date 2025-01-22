import { useNextPostTimer } from "@/hooks/useNextPostTimer";

export function CalendarHeader() {
  const nextPostTime = useNextPostTimer();

  return (
    <div>
      <p className="text-sm text-muted-foreground">
        {nextPostTime}
      </p>
    </div>
  );
}