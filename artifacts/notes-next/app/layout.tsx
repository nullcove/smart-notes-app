import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/lib/providers";

export const metadata: Metadata = {
  title: "Smart Ins-Note — AI-Powered Note Taking",
  description: "Smart Ins-Note is a powerful, privacy-first note-taking app with AI features, markdown, tags, search, and seamless cloud sync.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head suppressHydrationWarning>
        <script suppressHydrationWarning dangerouslySetInnerHTML={{ __html: `
          try {
            var t = localStorage.getItem('smart-ins-note-theme');
            if (t === 'light') { document.documentElement.classList.remove('dark'); }
            else { document.documentElement.classList.add('dark'); }
          } catch(e) { document.documentElement.classList.add('dark'); }
        `}} />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
