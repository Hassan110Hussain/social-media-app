"use client";
import { Button } from "@/components/ui/button";
import { RotateCw, WifiOff } from "lucide-react";
import { useEffect, useState } from "react";

const NoInternetWrapper = ({ children }: { children: React.ReactNode }) => {
  const [isOnline, setOnline] = useState(true);

  useEffect(() => {
    setOnline(navigator.onLine);

    window.addEventListener("online", () => {
      setOnline(true);
    });

    window.addEventListener("offline", () => {
      setOnline(false);
    });

    return () => {
      window.removeEventListener("online", () => {
        setOnline(true);
      });
      window.removeEventListener("offline", () => {
        setOnline(false);
      });
    };
  }, []);

  if (isOnline) {
    return children;
  } else {
    return (
      <div className="w-full h-screen flex flex-col items-center justify-center gap-6">
        <WifiOff className="w-16 h-16 text-primary" />
        <h1 className="text-3xl text-primary">No internet connection!</h1>
        <p className="text-primaryDark">Please check your network connection</p>
        <Button
          size="sm"
          variant="outline"
          className="w-40 flex cursor-pointer items-center gap-2"
          onClick={() => window.location.reload()}
        >
          Try Again <RotateCw className="w-4 h-4" />
        </Button>
      </div>
    );
  }
};

export default NoInternetWrapper;