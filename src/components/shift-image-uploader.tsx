"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
import ShiftTable from "./shift-table";
import { Toaster } from "@/components/ui/toaster";
import { createWorker } from "tesseract.js";
import { useToast } from "@/hooks/use-toast";
import Dropzone from "react-dropzone";
import { LucideFileUp, FileText, Download } from "lucide-react";

export default function ShiftImageUploader() {
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const processImage = useCallback(async (file: File) => {
    const worker = await createWorker("eng");
    try {
      const {
        data: { text },
      } = await worker.recognize(file);
      await worker.terminate();
      return text;
    } catch (error) {
      console.error("Error in processImage:", error);
      throw new Error(
        error instanceof Error ? error.message : "Failed to process the image",
      );
    }
  }, []);

  const parseShiftData = (text: string): string => {
    try {
      if (!text || typeof text !== "string") {
        throw new Error("Invalid input: text is empty or not a string");
      }
      const lines = text.split("\n").filter((line) => line.trim() !== "");
      const csvLines = lines
        .map((line) => {
          const parts = line.split(",").map((item) => item.trim());
          if (parts.length < 2) {
            console.warn("Invalid line format:", line);
            return null;
          }
          const [dateStr, timeStr] = parts;
          const [day, ...dateParts] = (dateStr || "").split(" ");
          const date = dateParts.join(" ");
          return `${day || "Unknown"},${date || "Unknown"},${timeStr || "OFF"}`;
        })
        .filter(Boolean);

      if (csvLines.length === 0) {
        throw new Error("No valid shift data found");
      }

      return ["Day,Date,Attendance", ...csvLines].join("\n");
    } catch (error) {
      console.error("Error in parseShiftData:", error);
      throw new Error(
        "Failed to parse shift data: " +
          (error instanceof Error ? error.message : "Unknown error"),
      );
    }
  };

  const processTextOutput = (text: string): string => {
    if (!text || typeof text !== "string") {
      console.error("Invalid input in processTextOutput");
      return "";
    }
    const pattern =
      /([A-Za-z]+),?\s*(\d{1,2})(?:th|st|nd|rd)?\s+([A-Za-z]+)\.?\s*(?:[®©]\s*[A-Za-z\s]*)?\s*(\d{1,2}:\d{2}\s*-\s*\d{1,2}:\d{2})/gi;

    const csvOutput: string[] = [];
    let match: RegExpExecArray | null;

    while ((match = pattern.exec(text)) !== null) {
      const day = match[1];
      const date = `${day} ${match[2]} ${match[3]}`; // Reconstruct the date
      const timeRange = match[4];
      csvOutput.push(`${date},${timeRange}`);
    }

    if (csvOutput.length === 0) {
      console.warn("No matches found in processTextOutput. Input text:", text);
      throw new Error("No valid shift data found in the text");
    }

    return csvOutput.join("\n");
  };

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (!file) return;

      setIsLoading(true);
      setResult(null);
      try {
        const extractedText = await processImage(file);
        if (!extractedText) {
          throw new Error("No text extracted from the image");
        }

        console.log("extractedTExt: ", extractedText);

        const processedText = processTextOutput(extractedText);
        if (!processedText) {
          throw new Error("Failed to process extracted text");
        }

        console.log("processed data: ", processedText);

        const csvResult = parseShiftData(processedText);
        setResult(csvResult);
      } catch (error) {
        console.error("Error in handleSubmit:", error);
        toast({
          title: "Error",
          description:
            error instanceof Error
              ? error.message
              : "An unknown error occurred while processing the image",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    },
    [file, processImage, toast],
  );

  const handleSave = (updatedCsv: string) => {
    setResult(updatedCsv);
  };

  const handleDownload = () => {
    if (!result) return;

    const blob = new Blob([result], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "shift_schedule.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 w-full flex flex-col justify-center items-center">
      <form onSubmit={handleSubmit}>
        <Dropzone
          onDrop={(acceptedFiles) => {
            if (acceptedFiles && acceptedFiles.length > 0) {
              const file = acceptedFiles[0];
              if (file.type.startsWith("image/")) {
                setFile(file);
              } else {
                toast({
                  title: "Invalid file type",
                  description: "Please upload an image file",
                  variant: "destructive",
                });
              }
            }
          }}
          accept={{
            "image/*": [".png", ".jpg", ".jpeg", ".gif", ".bmp"],
          }}
        >
          {({ getRootProps, getInputProps, isDragActive }) => (
            <section
              className={`flex flex-col gap-4  p-6 items-center justify-center bg-gray-50 w-[620px] min-w-[200px] border-dashed border-2 rounded-lg text-muted-foreground text-center ${isDragActive ? "border-blue-500 border-2" : ""}`}
            >
              <div {...getRootProps()}>
                <input {...getInputProps()} />
                <div className="flex flex-col gap-2 items-center cursor-pointer">
                  {file ? (
                    <div className="flex gap-2">
                      <FileText />
                      <div className="flex gap-1 items-center">
                        <p className="text-green-600">File uploaded:</p>
                        <p> {file.name}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="w-full flex flex-col items-center gap-2 justify-center">
                      <LucideFileUp />
                      <p>
                        {isDragActive
                          ? "Drop the image here..."
                          : "Drag and drop (or click) to upload image..."}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-2 justify-center">
                <div className="flex gap-2 w-full justify-center">
                  {file && (
                    <Button type="submit" disabled={!file || isLoading}>
                      {isLoading ? "Processing..." : "Process Shift Image"}
                    </Button>
                  )}
                  {result && (
                    <Button onClick={handleDownload} variant="outline">
                      <Download className="mr-2 h-4 w-4" />
                      Download CSV
                    </Button>
                  )}
                </div>
              </div>
            </section>
          )}
        </Dropzone>
      </form>

      {result && (
        <div className="mt-4 space-y-4">
          <div>
            <h2 className="text-xl font-semibold mb-2">
              Processed Shift Schedule:
            </h2>
            <ShiftTable csvData={result} onSave={handleSave} />
          </div>
        </div>
      )}
      <Toaster />
    </div>
  );
}
