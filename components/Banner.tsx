"use client";

import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const Banner = () => {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const bannerFlag = localStorage.getItem("showBanner");
    if (bannerFlag) {
      setShowBanner(true);
      localStorage.removeItem("showBanner"); // Remove the flag after showing the banner
    }
  }, []);

  if (!showBanner) return null;

  return (
    <Dialog open={showBanner} onOpenChange={setShowBanner}>
      <DialogContent className="bg-blue-200 w-[350px] md:w-full">
        <DialogHeader>
          <DialogTitle>You can also connect more than one bank!</DialogTitle>
          <DialogDescription>
            Try connecting multiple bank accounts to get the most out of our
            service.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button onClick={() => setShowBanner(false)}>Got it!</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default Banner;
