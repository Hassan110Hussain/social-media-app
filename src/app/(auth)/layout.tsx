import AuthBackground from "@/components/auth/AuthBackground";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 transition-colors dark:bg-black dark:text-white">
      <div className="flex min-h-[100vh]">
        <AuthBackground />
        <div className="absolute right-0 flex min-h-screen w-full flex-col justify-center bg-white/80 backdrop-blur-md transition-colors dark:bg-black/40 lg:w-[55%]">
          <div className="flex h-full items-center justify-center">
            <div className="w-[90%] md:w-[70%] lg:w-[60%]">{children}</div>
          </div>
        </div>
      </div>
    </main>
  );
}
