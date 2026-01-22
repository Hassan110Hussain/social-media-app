import type { Metadata } from "next";
import "./globals.css";
import NextLoader from "./nextLoader";
import NoInternetWrapper from "./noInternet";
import { Toaster } from "@/components/ui/sonner";
import SignOutProviderWrapper from "@/components/providers/SignOutProviderWrapper";
import { ThemeProvider } from "@/components/providers/ThemeProvider";

export const metadata: Metadata = {
  title: "Social Media Web App",
  description: "A social media app for connecting with people worldwide for sharing thoughts, ideas, and experiences.",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false, // Equivalent to user-scalable=no
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <NextLoader />
          <NoInternetWrapper>
            <SignOutProviderWrapper>
              {children}
            </SignOutProviderWrapper>
          </NoInternetWrapper>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
