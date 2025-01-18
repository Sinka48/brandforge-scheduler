import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, X } from "lucide-react";
import { useState } from "react";

interface TimeSlot {
  time: string;
  days: string[];
}

interface TimeSlotSelectorProps {
  timeSlots: TimeSlot[];
  onTimeSlotsChange: (slots: TimeSlot[]) => void;
}

export function TimeSlotSelector({ timeSlots, onTimeSlotsChange }: TimeSlotSelectorProps) {
  const [selectedTime, setSelectedTime] = useState("09:00");
  const [selectedDays, setSelectedDays] = useState<string[]>([]);

  const days = [
    "Monday", "Tuesday", "Wednesday", "Thursday",
    "Friday", "Saturday", "Sunday"
  ];

  const commonTimes = [
    "09:00", "12:00", "15:00", "18:00", "21:00"
  ];

  const handleAddTimeSlot = () => {
    if (selectedDays.length === 0) return;
    onTimeSlotsChange([...timeSlots, { time: selectedTime, days: selectedDays }]);
    setSelectedDays([]);
  };

  const handleRemoveTimeSlot = (index: number) => {
    const newSlots = timeSlots.filter((_, i) => i !== index);
    onTimeSlotsChange(newSlots);
  };

  const toggleDay = (day: string) => {
    setSelectedDays(prev =>
      prev.includes(day)
        ? prev.filter(d => d !== day)
        : [...prev, day]
    );
  };

  return (
    <div className="space-y-4">
      <Label>Preferred Time Slots</Label>
      
      <div className="space-y-2">
        <div className="flex gap-2">
          <Select value={selectedTime} onValueChange={setSelectedTime}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select time" />
            </SelectTrigger>
            <SelectContent>
              {commonTimes.map(time => (
                <SelectItem key={time} value={time}>{time}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={handleAddTimeSlot} disabled={selectedDays.length === 0}>
            <Plus className="h-4 w-4 mr-2" />
            Add Time Slot
          </Button>
        </div>

        <div className="flex flex-wrap gap-2">
          {days.map(day => (
            <Badge
              key={day}
              variant={selectedDays.includes(day) ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => toggleDay(day)}
            >
              {day}
            </Badge>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        {timeSlots.map((slot, index) => (
          <div key={index} className="flex items-center justify-between bg-muted p-2 rounded-md">
            <div className="flex items-center gap-2">
              <span className="font-medium">{slot.time}</span>
              <div className="flex gap-1">
                {slot.days.map(day => (
                  <Badge key={day} variant="secondary">{day}</Badge>
                ))}
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleRemoveTimeSlot(index)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}