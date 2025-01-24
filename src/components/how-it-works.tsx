import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { HelpCircle } from "lucide-react";

import Image from "next/image";

export function HowItWorks() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="text-muted-foreground hover:text-primary inline-flex items-center gap-2">
          <HelpCircle className="h-4 w-4" />
          <span className="text-sm">How to use this?</span>
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>How to use the Shift Schedule Processor</DialogTitle>
          <DialogDescription>
            Follow these simple steps to process your schedule:
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 pt-4">
          <div className="space-y-2">
            <h3 className="font-medium">1. Upload Your Schedule</h3>
            <p className="text-sm text-muted-foreground">
              Take a clear photo or screenshot (it can also be from phone app)
              of your shift schedule from Smartplan just like the one below, and
              upload it to the app.
            </p>
            <Image
              src="/shifts-image.png"
              alt="Image with shifts from smartplan"
              width={400}
              height={400}
            />
          </div>
          <div className="space-y-2">
            <h3 className="font-medium">2. Process the Image</h3>
            <p className="text-sm text-muted-foreground">
              The app will analyze the image and extract all shift information
              automatically.
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="font-medium">3. Review and Edit</h3>
            <p className="text-sm text-muted-foreground">
              Check the extracted schedule, adjust times if needed, and remove
              any unwanted shifts.
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="font-medium">4. Download or Save</h3>
            <p className="text-sm text-muted-foreground">
              Export your schedule in various formats or save the changes for
              later use (you can also just copy the schedule into your
              clipboard).
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
