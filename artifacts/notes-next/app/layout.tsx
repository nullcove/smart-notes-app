import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/lib/providers";

export const metadata: Metadata = {
  title: "Smart Ins-Note — AI-Powered Note Taking",
  description: "Smart Ins-Note is a powerful, privacy-first note-taking app with AI features, markdown, tags, search, and seamless cloud sync.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
