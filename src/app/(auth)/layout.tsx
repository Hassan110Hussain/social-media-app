import AuthBackground from "@/components/auth/AuthBackground";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="min-h-screen bg-black">
      <div className="min-h-[100vh] flex">
        <AuthBackground />
        <div className="min-h-screen flex flex-col justify-center w-full lg:w-[55%] absolute right-0 bg-black/40 backdrop-blur-sm">
          <div className="h-full flex items-center justify-center">
            <div className="w-[90%] md:w-[70%] lg:w-[60%]">{children}</div>
          </div>
        </div>
      </div>
    </main>
  );
}
