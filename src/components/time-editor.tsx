import React from "react";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Plus, Minus, Clock } from "lucide-react";

interface TimeEditorProps {
  time: string;
  onTimeChange: (newTime: string) => void;
}

export function TimeEditor({ time, onTimeChange }: TimeEditorProps) {
  const [hours, minutes] = time.split(":").map(Number);

  const handleHoursChange = (value: number[]) => {
    const newHours = value[0];
    const newTime = `${String(newHours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
    onTimeChange(newTime);
  };

  const handleMinutesChange = (value: number[]) => {
    const newMinutes = value[0];
    const newTime = `${String(hours).padStart(2, "0")}:${String(newMinutes).padStart(2, "0")}`;
    onTimeChange(newTime);
  };
  const handleIncrement = () => {
    const [hours, minutes] = time.split(":").map(Number);
    let newMinutes = minutes + 5;
    let newHours = hours;

    if (newMinutes >= 60) {
      newMinutes = newMinutes - 60;
      newHours = (hours + 1) % 24;
    }

    const newTime = `${String(newHours).padStart(2, "0")}:${String(newMinutes).padStart(2, "0")}`;
    onTimeChange(newTime);
  };

  const handleDecrement = () => {
    const [hours, minutes] = time.split(":").map(Number);
    let newMinutes = minutes - 5;
    let newHours = hours;

    if (newMinutes < 0) {
      newMinutes = newMinutes + 60;
      newHours = (hours - 1 + 24) % 24;
    }

    const newTime = `${String(newHours).padStart(2, "0")}:${String(newMinutes).padStart(2, "0")}`;
    onTimeChange(newTime);
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="icon"
        className="h-7 w-7"
        onClick={handleDecrement}
      >
        <Minus className="h-3 w-3" />
      </Button>
      <Popover>
        <PopoverTrigger asChild>
          <div className="flex items-center cursor-pointer">
            <Clock className="h-4 w-4 text-muted-foreground mr-2" />
            {time}
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-4">
          <div className="grid gap-4">
            <div className="space-y-2">
              <h4 className="font-medium leading-none">Set Time</h4>
              <p className="text-sm text-muted-foreground">
                Adjust the hours and minutes.
              </p>
            </div>
            <div className="grid gap-2">
              <div className="grid grid-cols-3 items-center gap-4">
                <label htmlFor="hours">Hours</label>
                <Slider
                  id="hours"
                  max={23}
                  step={1}
                  value={[hours]}
                  onValueChange={handleHoursChange}
                  className="col-span-2 h-4"
                />
                <Input
                  id="hours-input"
                  type="number"
                  min={0}
                  max={23}
                  value={hours}
                  onChange={(e) => handleHoursChange([Number(e.target.value)])}
                  className="col-span-1"
                />
              </div>
              <div className="grid grid-cols-3 items-center gap-4">
                <label htmlFor="minutes">Minutes</label>
                <Slider
                  id="minutes"
                  max={55}
                  step={5}
                  value={[minutes]}
                  onValueChange={handleMinutesChange}
                  className="col-span-2 h-4"
                />
                <Input
                  id="minutes-input"
                  type="number"
                  min={0}
                  max={55}
                  step={5}
                  value={minutes}
                  onChange={(e) => handleMinutesChange([Number(e.target.value)])}
                  className="col-span-1"
                />
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
      <Button
        variant="outline"
        size="icon"
        className="h-7 w-7"
        onClick={handleIncrement}
      >
        <Plus className="h-3 w-3" />
      </Button>
    </div>
  );
}
