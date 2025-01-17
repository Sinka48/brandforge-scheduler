import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";

interface CalendarViewProps {
  selectedDate: Date | undefined;
  onSelectDate: (date: Date | undefined) => void;
}

export function CalendarView({ selectedDate, onSelectDate }: CalendarViewProps) {
  return (
    <div className="rounded-lg border bg-card">
      <div className="p-6">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={onSelectDate}
          className="rounded-md border"
        />
      </div>
    </div>
  );
}