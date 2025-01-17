import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Clock } from "lucide-react";
import { useState } from "react";

interface TimeSelectorProps {
  time: string;
  onTimeChange: (time: string) => void;
}

export function TimeSelector({ time, onTimeChange }: TimeSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  const quickTimes = [
    "09:00", "12:00", "15:00", "18:00", "21:00"
  ];

  return (
    <div className="space-y-2">
      <Label htmlFor="time" className="text-sm font-medium flex items-center gap-2">
        <Clock className="h-4 w-4" />
        Schedule Time
      </Label>
      <div className="space-y-2">
        <Input
          type="time"
          id="time"
          value={time}
          onChange={(e) => onTimeChange(e.target.value)}
          className="w-full"
        />
        <div className="flex flex-wrap gap-2">
          {quickTimes.map((quickTime) => (
            <Button
              key={quickTime}
              variant="outline"
              size="sm"
              onClick={() => onTimeChange(quickTime)}
              className={time === quickTime ? "bg-primary text-primary-foreground" : ""}
            >
              {quickTime}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}