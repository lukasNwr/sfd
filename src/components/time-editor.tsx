import React from "react";
import { Button } from "@/components/ui/button";
import { Plus, Minus, Clock } from "lucide-react";

interface TimeEditorProps {
  time: string;
  onTimeChange: (newTime: string) => void;
}

export function TimeEditor({ time, onTimeChange }: TimeEditorProps) {
  const [hours, minutes] = time.split(":").map(Number);

  const adjustTime = (minutesToAdd: number) => {
    const totalMinutes = hours * 60 + minutes + minutesToAdd;
    const newHours = Math.floor(totalMinutes / 60) % 24;
    const newMinutes = totalMinutes % 60;
    const newTime = `${newHours.toString().padStart(2, "0")}:${newMinutes.toString().padStart(2, "0")}`;
    onTimeChange(newTime);
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="icon"
        className="h-7 w-7"
        onClick={() => adjustTime(-5)}
      >
        <Minus className="h-3 w-3" />
      </Button>
      <div className="flex items-center">
        <Clock className="h-4 w-4 text-muted-foreground mr-2" />
        {time}
      </div>
      <Button
        variant="outline"
        size="icon"
        className="h-7 w-7"
        onClick={() => adjustTime(6)}
      >
        <Plus className="h-3 w-3" />
      </Button>
    </div>

    // <div className="flex items-center space-x-1">
    //   <Button variant="ghost" size="icon" className="h-6 w-6 p-0" onClick={() => adjustTime(-5)}>
    //     <Minus className="h-4 w-4" />
    //   </Button>
    //   <span className="text-sm font-medium min-w-[48px] text-center">{time}</span>
    //   <Button variant="ghost" size="icon" className="h-6 w-6 p-0" onClick={() => adjustTime(5)}>
    //     <Plus className="h-4 w-4" />
    //   </Button>
    // </div>
  );
}
