import { Input } from "@/components/ui/input";
import { Clock } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface TimeSelectorProps {
  time: string;
  onTimeChange: (time: string) => void;
  selectedPlatforms: string[];
}

export function TimeSelector({ time, onTimeChange, selectedPlatforms }: TimeSelectorProps) {
  const [error, setError] = useState<string | null>(null);

  const validateTime = (timeStr: string) => {
    if (!timeStr) {
      setError("Required");
      return false;
    }

    const currentTime = new Date();
    const [hours, minutes] = timeStr.split(':').map(Number);
    const selectedTime = new Date();
    selectedTime.setHours(hours, minutes);

    if (selectedTime < currentTime) {
      setError("Future time required");
      return false;
    }

    setError(null);
    return true;
  };

  useEffect(() => {
    if (time) {
      validateTime(time);
    }
  }, [time]);

  const commonTimes = [
    "09:00", "12:00", "15:00", "18:00", "21:00"
  ];

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button 
          variant="outline" 
          size="icon"
          className={error ? "border-destructive" : ""}
        >
          <Clock className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-48 p-2">
        <div className="space-y-2">
          <Input
            type="time"
            value={time}
            onChange={(e) => {
              if (validateTime(e.target.value)) {
                onTimeChange(e.target.value);
              }
            }}
            className="w-full"
          />
          <div className="grid grid-cols-2 gap-1">
            {commonTimes.map((t) => (
              <Button
                key={t}
                variant="ghost"
                size="sm"
                onClick={() => {
                  if (validateTime(t)) {
                    onTimeChange(t);
                  }
                }}
                className="text-xs"
              >
                {format(new Date(`2000-01-01T${t}`), 'h:mm a')}
              </Button>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}