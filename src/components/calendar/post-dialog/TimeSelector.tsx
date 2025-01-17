import { Input } from "@/components/ui/input";
import { Clock } from "lucide-react";

interface TimeSelectorProps {
  time: string;
  onTimeChange: (time: string) => void;
}

export function TimeSelector({ time, onTimeChange }: TimeSelectorProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Time</label>
      <div className="flex gap-2 items-center">
        <Clock className="h-4 w-4 text-muted-foreground" />
        <Input
          type="time"
          value={time}
          onChange={(e) => onTimeChange(e.target.value)}
        />
      </div>
    </div>
  );
}