import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/lib/providers";

export const metadata: Metadata = {
  title: "InsNote Smart — Your Ideas, Beautifully Organized",
  description: "InsNote Smart is a powerful, privacy-first note-taking app with markdown, tags, search, and seamless sync.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
