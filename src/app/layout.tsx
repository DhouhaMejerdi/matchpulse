import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import '../styles/globals.scss';
import SiteHeader from "@/components/layout/SiteHeader";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MatchPulse — Live Match Center",
  description: "Follow live fixtures, timelines, and team stats.",
};

export const viewport: Viewport = {
  themeColor: "#FF4D4F",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SiteHeader />
        <main className="container">{children}</main>

        <footer className="container" style={{ padding: '24px 0' }}>
          <span className="small">© {new Date().getFullYear()} MatchPulse</span>
        </footer>
      </body>
    </html>
  );
}
