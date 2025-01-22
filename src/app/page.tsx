import ShiftImageUploader from "@/components/shift-image-uploader";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";

import { LucideCircleHelp } from "lucide-react";

import Image from "next/image";

export default function Home() {
  return (
    <main className="flex flex-col gap-4 p-4 w-screen h-screen items-center ">
      <h1 className="text-4xl font-bold mb-4">
        Shift Schedule Image Processor
      </h1>
      <p className="max-w-2xl mb-4">
        Upload an image of your shift schedule, and our OCR technology will
        process it into a CSV format. You can then adjust the shift times,
        remove days, and download the updated schedule.
      </p>

      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" className="flex gap-2">
            <span>How to use this?</span>
            <LucideCircleHelp />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>How to use this?</DialogTitle>
            <DialogDescription>
              It&apos;s pretty simple. You just have to take screenshot of your
              shifts from the smartplan app. You can then customize the shifts
              and download the file with the shifts in text format or just copy
              it to your clipboard and send to David immediatelly.
            </DialogDescription>
          </DialogHeader>
          <ol className="list-decimal pl-5 space-y-2">
            <li>
              <p>Take a screenshot of the shifts from Smartplan</p>
              <Dialog>
                <DialogTrigger asChild>
                  <div className="cursor-pointer hover:opacity-90 transition-opacity">
                    <Image
                      src="/shifts-image.png"
                      alt="Image with shifts from smartplan"
                      width={200}
                      height={200}
                    />
                  </div>
                </DialogTrigger>
                <DialogContent className="max-w-4xl">
                  <DialogHeader>
                    <DialogTitle>Shift Schedule Screenshot</DialogTitle>
                  </DialogHeader>
                  <Image
                    src="/shifts-image.png"
                    alt="Image with shifts from smartplan"
                    width={800}
                    height={800}
                    className="w-full h-auto"
                  />
                </DialogContent>
              </Dialog>
            </li>
            <li>Upload the image on the website</li>
            <li>Process the image</li>
            <li>Customize the shifts if needed</li>
            <li>
              Download the text or csv file with the shifts or simply copy the
              text to your clipboard
            </li>
          </ol>
        </DialogContent>
      </Dialog>

      <ShiftImageUploader />
    </main>
  );
}
