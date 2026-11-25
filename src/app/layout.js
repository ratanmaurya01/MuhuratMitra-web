import "./globals.css";
import { Suspense } from "react";
import Navbar from "@/components/Navbar";

export const metadata = {
  title: {
    default: "MuhuratMitra",
    template: "%s | MuhuratMitra",
  },
  description:
    "Discover daily Panchang, auspicious Muhurat, pujas and trusted Pandits with MuhuratMitra.",
  applicationName: "MuhuratMitra",
};

export default function RootLayout({ children }) {
  return (
    <html lang="hi">
      <body className="min-h-screen bg-background text-foreground antialiased">
        <Suspense
          fallback={
            <div className="h-20 w-full border-b border-border bg-background" />
          }
        >
          <Navbar />
        </Suspense>

        <main className="w-full">{children}</main>
      </body>
    </html>
  );
}