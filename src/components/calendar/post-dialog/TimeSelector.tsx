import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Clock, Sparkles } from "lucide-react";
import { useState } from "react";
import { getOptimalTimes } from "@/utils/schedulingUtils";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface TimeSelectorProps {
  time: string;
  onTimeChange: (time: string) => void;
  selectedPlatforms: string[];
}

export function TimeSelector({ time, onTimeChange, selectedPlatforms }: TimeSelectorProps) {
  const [showOptimal, setShowOptimal] = useState(false);
  
  const quickTimes = [
    { label: "Morning", time: "09:00" },
    { label: "Noon", time: "12:00" },
    { label: "Afternoon", time: "15:00" },
    { label: "Evening", time: "18:00" },
    { label: "Night", time: "21:00" }
  ];

  const optimalTimes = getOptimalTimes(selectedPlatforms);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label htmlFor="time" className="text-sm font-medium flex items-center gap-2">
          <Clock className="h-4 w-4" />
          Schedule Time
        </Label>
        {selectedPlatforms.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowOptimal(!showOptimal)}
            className="h-8"
          >
            <Sparkles className="h-4 w-4 mr-2" />
            {showOptimal ? "Show Quick Times" : "Show Optimal Times"}
          </Button>
        )}
      </div>
      
      <div className="space-y-2">
        <Input
          type="time"
          id="time"
          value={time}
          onChange={(e) => onTimeChange(e.target.value)}
          className="w-full"
        />
        
        {showOptimal ? (
          <div className="flex flex-wrap gap-2">
            <TooltipProvider>
              {optimalTimes.map(({ time: optimalTime, engagement, description }) => (
                <Tooltip key={optimalTime}>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onTimeChange(optimalTime)}
                      className={time === optimalTime ? "bg-primary text-primary-foreground" : ""}
                    >
                      {optimalTime}
                      <Badge 
                        variant={engagement === 'High' ? "default" : "secondary"}
                        className="ml-2"
                      >
                        {engagement}
                      </Badge>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{description}</p>
                  </TooltipContent>
                </Tooltip>
              ))}
            </TooltipProvider>
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {quickTimes.map(({ label, time: quickTime }) => (
              <Button
                key={quickTime}
                variant="outline"
                size="sm"
                onClick={() => onTimeChange(quickTime)}
                className={time === quickTime ? "bg-primary text-primary-foreground" : ""}
              >
                {label}
              </Button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}