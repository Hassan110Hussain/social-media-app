import type { Metadata } from "next";
import "./globals.css";
import NextLoader from "./nextLoader";
import NoInternetWrapper from "./noInternet";
import { Toaster } from "@/components/ui/sonner";

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
  const themeInitScript = `
  (function() {
    try {
      const storedTheme = window.localStorage.getItem('theme');
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const theme = storedTheme === 'light' || storedTheme === 'dark'
        ? storedTheme
        : (prefersDark ? 'dark' : 'light');
      const root = document.documentElement;
      root.classList.toggle('dark', theme === 'dark');
      root.dataset.theme = theme;
    } catch (error) {
      console.warn('Unable to set theme', error);
    }
  })();
  `;
  return (
    <html lang="en" 
    suppressHydrationWarning
    >
      <body>
        <script
          dangerouslySetInnerHTML={{ __html: themeInitScript }}
        />
         <NextLoader />
        <NoInternetWrapper>
          {children}
          </NoInternetWrapper>
        <Toaster />
      </body>
    </html>
  );
}
