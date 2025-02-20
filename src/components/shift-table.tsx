import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TimeEditor } from "./time-editor";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { parse, differenceInMinutes } from "date-fns";
import { Copy, Download, Calendar, Save } from "lucide-react";
import { Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ShiftTableProps {
  csvData: string;
  onSave: (updatedCsv: string) => void;
}

interface Shift {
  day: string;
  date: string;
  startTime: string;
  endTime: string;
}

export default function ShiftTable({ csvData, onSave }: ShiftTableProps) {
  const [shifts, setShifts] = useState<Shift[]>(() => {
    const rows = csvData.trim().split("\n");
    const headers = rows[0].split(",");
    console.log("Headers: ", headers);
    return rows.slice(1).map((row) => {
      const [day, date, attendance] = row.split(",");
      const [startTime, endTime] = attendance.split(" - ");
      return { day, date, startTime, endTime };
    });
  });
  const { toast } = useToast();

  const handleTimeChange = (
    index: number,
    timeType: "startTime" | "endTime",
    newTime: string,
  ) => {
    const updatedShifts = [...shifts];
    updatedShifts[index][timeType] = newTime;
    setShifts(updatedShifts);
  };

  const handleRemoveDay = (index: number) => {
    const updatedShifts = shifts.filter((_, i) => i !== index);
    setShifts(updatedShifts);
    toast({
      title: "Day Removed",
      description: "The selected day has been removed from the schedule.",
      className: "text-left",
    });
  };

  const handleSave = () => {
    const updatedCsv = [
      "Day,Date,Attendance",
      ...shifts.map(
        (shift) =>
          `${shift.day},${shift.date},${shift.startTime} - ${shift.endTime}`,
      ),
    ].join("\n");
    onSave(updatedCsv);
    toast({
      title: "Changes Saved",
      description: "Your shift schedule has been updated.",
      className: "text-left",
    });
  };

  const calculateTotalHours = (shifts: Shift[]): string => {
    const totalMinutes = shifts.reduce((acc, shift) => {
      const [startHours, startMinutes] = shift.startTime.split(":").map(Number);
      const [endHours, endMinutes] = shift.endTime.split(":").map(Number);

      const startTotalMinutes = startHours * 60 + startMinutes;
      let endTotalMinutes = endHours * 60 + endMinutes;

      // If end time is earlier than start time, add 24 hours
      if (endTotalMinutes <= startTotalMinutes) {
        endTotalMinutes += 24 * 60;
      }

      return acc + (endTotalMinutes - startTotalMinutes);
    }, 0);

    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${hours}h ${minutes}m`;
  };

  const formatShiftsToText = (shifts: Shift[]): string => {
    const lines = shifts.map(
      (shift) =>
        `${shift.day}, ${shift.date}: ${shift.startTime} - ${shift.endTime}`,
    );

    return [...lines, `Total Hours: ${calculateTotalHours(shifts)}`].join("\n");
  };

  const handleCopyToClipboard = async () => {
    const formattedText = formatShiftsToText(shifts);
    try {
      await navigator.clipboard.writeText(formattedText);
      toast({
        title: "Copied to clipboard",
        description: "The shift schedule has been copied to your clipboard.",
      });
    } catch (err) {
      console.log(err);
      toast({
        title: "Failed to copy",
        description: "Could not copy to clipboard. Please try again.",
        variant: "destructive",
      });
    }
  };

  const downloadTextFile = () => {
    const formattedText = formatShiftsToText(shifts);
    const blob = new Blob([formattedText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "shift-schedule.txt";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast({
      title: "File downloaded",
      description: "The shift schedule has been downloaded as a text file.",
    });
  };

  return (
    <div className="space-y-4 rounded-md border w-full p-2">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Day</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Start Time</TableHead>
            <TableHead>End Time</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {shifts.map((shift, index) => (
            <TableRow key={index}>
              <TableCell className="font-medium">{shift.day}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  {shift.date}
                </div>
              </TableCell>
              <TableCell>
                <TimeEditor
                  time={shift.startTime}
                  onTimeChange={(newTime) =>
                    handleTimeChange(index, "startTime", newTime)
                  }
                />
              </TableCell>
              <TableCell>
                <TimeEditor
                  time={shift.endTime}
                  onTimeChange={(newTime) =>
                    handleTimeChange(index, "endTime", newTime)
                  }
                />
              </TableCell>
              <TableCell className="text-right">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemoveDay(index)}
                  className="h-8 w-8 text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* <div className="flex justify-between items-center">
          <span className="font-medium">Total Working Hours:</span>
          <span className="font-semibold">{calculateTotalHours(shifts)}</span>
        </div> */}

      {/* Total Hours */}
      <div className="flex justify-between items-center p-4 bg-muted rounded-lg">
        <span className="font-semibold">Total Working Hours:</span>
        <Badge variant="secondary" className="text-lg">
          {calculateTotalHours(shifts)}
        </Badge>
      </div>
      <div className="mt-4 flex justify-end gap-4">
        <Button
          variant="outline"
          onClick={handleCopyToClipboard}
          className="flex items-center gap-2"
        >
          <Copy className="h-4 w-4" />
          Copy Schedule
        </Button>
        <Button
          variant="outline"
          onClick={downloadTextFile}
          className="flex items-center gap-2"
        >
          <Download className="h-4 w-4" />
          Download TXT
        </Button>
        <Button onClick={handleSave}>
          <Save className="mr-2 h-4 w-4" />
          Save Changes
        </Button>
      </div>
    </div>
  );
}
