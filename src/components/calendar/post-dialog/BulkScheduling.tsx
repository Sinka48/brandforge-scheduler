import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { CalendarDays, X } from "lucide-react";

interface BulkSchedulingProps {
  selectedDates: Date[];
  onDatesChange: (dates: Date[]) => void;
}

export function BulkScheduling({ selectedDates, onDatesChange }: BulkSchedulingProps) {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const handleDateSelect = (date: Date | undefined) => {
    if (!date) return;
    
    const dateExists = selectedDates.some(
      d => d.toDateString() === date.toDateString()
    );

    if (dateExists) {
      onDatesChange(selectedDates.filter(
        d => d.toDateString() !== date.toDateString()
      ));
    } else {
      onDatesChange([...selectedDates, date]);
    }
  };

  const removeDate = (dateToRemove: Date) => {
    onDatesChange(selectedDates.filter(
      date => date.toDateString() !== dateToRemove.toDateString()
    ));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={() => setIsCalendarOpen(!isCalendarOpen)}
          className="w-full"
        >
          <CalendarDays className="mr-2 h-4 w-4" />
          {selectedDates.length === 0 
            ? "Select dates for bulk scheduling" 
            : `${selectedDates.length} date${selectedDates.length === 1 ? '' : 's'} selected`}
        </Button>
      </div>

      {isCalendarOpen && (
        <Calendar
          mode="multiple"
          selected={selectedDates}
          onSelect={(date) => handleDateSelect(date)}
          className="rounded-md border"
        />
      )}

      {selectedDates.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedDates
            .sort((a, b) => a.getTime() - b.getTime())
            .map((date) => (
              <Badge
                key={date.toISOString()}
                variant="secondary"
                className="flex items-center gap-1"
              >
                {format(date, 'MMM d, yyyy')}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-4 w-4 p-0 hover:bg-transparent"
                  onClick={() => removeDate(date)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            ))}
        </div>
      )}
    </div>
  );
}