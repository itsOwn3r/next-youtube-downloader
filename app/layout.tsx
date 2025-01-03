import type { Metadata } from "next";
import "./globals.css";

import localFont from "next/font/local";
import { ThemeProvider } from "@/components/theme-provider";


const karla = localFont({
  src: "../public/fonts/Karla-VariableFont_wght.ttf"
});

export const metadata: Metadata = {
  title: "Youtube Downloader",
  description: "Youtube Downloader app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${karla.className} antialiased`}
      >
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
      </body>
    </html>
  );
}
