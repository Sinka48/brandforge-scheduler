import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { PlatformId } from "@/constants/platforms";

interface TimeSelectorProps {
  time: string;
  onTimeChange: (time: string) => void;
  selectedPlatforms: PlatformId[];
}

export function TimeSelector({ time, onTimeChange, selectedPlatforms }: TimeSelectorProps) {
  const [error, setError] = useState<string | null>(null);

  const validateTime = (timeStr: string) => {
    if (!timeStr) {
      setError("Please select a time");
      return false;
    }

    const currentTime = new Date();
    const [hours, minutes] = timeStr.split(':').map(Number);
    const selectedTime = new Date();
    selectedTime.setHours(hours, minutes);

    if (selectedTime < currentTime) {
      setError("Selected time cannot be in the past");
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

  return (
    <div className="space-y-2">
      <Label htmlFor="time">Posting Time</Label>
      <div className="space-y-2">
        <Input
          type="time"
          id="time"
          value={time}
          onChange={(e) => {
            if (validateTime(e.target.value)) {
              onTimeChange(e.target.value);
            }
          }}
          className="w-full md:w-auto"
        />
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {selectedPlatforms.length > 0 && (
          <p className="text-sm text-muted-foreground">
            Post will be scheduled for {time} on {selectedPlatforms.join(', ')}
          </p>
        )}
      </div>
    </div>
  );
}