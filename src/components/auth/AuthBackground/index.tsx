"use client";
import { cn } from "@/lib/utils";
import Image from "next/image";

const AuthBackground = () => {
  return (
    <div
      className={cn(
        "fixed w-[45%] hidden lg:flex justify-center items-center overflow-hidden h-screen"
      )}
    >
      {/* Vibrant gradient background matching the image */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black">
        {/* Animated colorful liquid-like blobs */}
        <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-gradient-to-br from-red-500 via-orange-500 to-yellow-500 rounded-full mix-blend-screen opacity-30 blur-3xl animate-pulse"></div>
        <div className="absolute top-1/4 right-0 w-[350px] h-[350px] bg-gradient-to-br from-blue-400 via-cyan-400 to-blue-600 rounded-full mix-blend-screen opacity-25 blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-0 left-1/3 w-[300px] h-[300px] bg-gradient-to-br from-green-400 via-emerald-500 to-green-600 rounded-full mix-blend-screen opacity-30 blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-1/4 right-1/4 w-[250px] h-[250px] bg-gradient-to-br from-purple-500 via-pink-500 to-red-500 rounded-full mix-blend-screen opacity-25 blur-3xl animate-pulse" style={{ animationDelay: '0.5s' }}></div>
      </div>
      
      {/* Logo overlay */}
      <div className="relative z-10">
        <Image
          src="/logo/social.png"
          alt="Logo"
          className="select-none pointer-events-none w-auto h-auto max-w-[400px] max-h-[400px] drop-shadow-2xl"
          width={1000}
          height={1000}
          priority
          loading="eager"
        />
      </div>
    </div>
  );
};

export default AuthBackground;
