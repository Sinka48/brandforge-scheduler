import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon, AlertCircle } from "lucide-react";
import { format, isAfter, isBefore, addDays, addWeeks, addMonths } from "date-fns";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface RecurringOptionsProps {
  isRecurring: boolean;
  onIsRecurringChange: (value: boolean) => void;
  pattern: string;
  onPatternChange: (value: string) => void;
  endDate: Date | undefined;
  onEndDateChange: (date: Date | undefined) => void;
  startDate?: Date;
}

export function RecurringOptions({
  isRecurring,
  onIsRecurringChange,
  pattern,
  onPatternChange,
  endDate,
  onEndDateChange,
  startDate,
}: RecurringOptionsProps) {
  const today = new Date();
  const minEndDate = startDate || today;
  
  const getMaxEndDate = () => {
    switch (pattern) {
      case 'daily':
        return addDays(minEndDate, 90); // 90 days max for daily
      case 'weekly':
        return addWeeks(minEndDate, 52); // 1 year max for weekly
      case 'monthly':
        return addMonths(minEndDate, 12); // 1 year max for monthly
      default:
        return addMonths(minEndDate, 12);
    }
  };

  const maxEndDate = getMaxEndDate();
  const isEndDateValid = endDate && isAfter(endDate, minEndDate) && isBefore(endDate, maxEndDate);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label htmlFor="recurring" className="text-sm font-medium">
          Recurring Post
        </Label>
        <Switch
          id="recurring"
          checked={isRecurring}
          onCheckedChange={onIsRecurringChange}
        />
      </div>

      {isRecurring && (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="pattern">Repeat</Label>
            <Select value={pattern} onValueChange={onPatternChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select frequency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>End Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={`w-full justify-start text-left font-normal ${!endDate && "text-muted-foreground"}`}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {endDate ? format(endDate, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={endDate}
                  onSelect={onEndDateChange}
                  disabled={(date) => 
                    isBefore(date, minEndDate) || isAfter(date, maxEndDate)
                  }
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {pattern && !isEndDateValid && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Please select an end date between {format(minEndDate, "PPP")} and {format(maxEndDate, "PPP")} for {pattern} recurring posts.
              </AlertDescription>
            </Alert>
          )}

          <Alert variant="default" className="bg-muted">
            <AlertDescription>
              {pattern === 'daily' && "Posts will be created daily until the end date"}
              {pattern === 'weekly' && "Posts will be created on the same day each week until the end date"}
              {pattern === 'monthly' && "Posts will be created on the same date each month until the end date"}
            </AlertDescription>
          </Alert>
        </div>
      )}
    </div>
  );
}