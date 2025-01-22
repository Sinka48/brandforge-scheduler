import { useNextPostTimer } from "@/hooks/useNextPostTimer";

export function CalendarHeader() {
  const nextPostTime = useNextPostTimer();

  return (
    <div>
      <h1 className="text-sm text-muted-foreground">
        {nextPostTime}
      </h1>
    </div>
  );
}