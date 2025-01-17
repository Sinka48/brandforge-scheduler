import { Input } from "@/components/ui/input";

interface TimeSelectorProps {
  time: string;
  onTimeChange: (time: string) => void;
}

export function TimeSelector({ time, onTimeChange }: TimeSelectorProps) {
  return (
    <div className="space-y-2">
      <label htmlFor="time" className="text-sm font-medium">
        Schedule Time
      </label>
      <Input
        type="time"
        id="time"
        value={time}
        onChange={(e) => onTimeChange(e.target.value)}
      />
    </div>
  );
}