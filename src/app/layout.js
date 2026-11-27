
import "./globals.css";
import { Suspense } from "react";
import Navbar from "@/components/Navbar";
import { Fraunces, DM_Sans, Noto_Sans_Devanagari } from "next/font/google";
import Providers from "./providers";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const notoSans = Noto_Sans_Devanagari({
  subsets: ["devanagari"],
  variable: "--font-hindi",
  display: "swap",
});


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
      <body
        className={`
    ${fraunces.variable}
    ${dmSans.variable}
    ${notoSans.variable}
    min-h-screen bg-background text-foreground antialiased
  `}
      >
        <Providers>
          <Suspense
            fallback={
              <div className="h-20 w-full border-b border-border bg-background" />
            }
          >
            <Navbar />
          </Suspense>
          <main className="w-full">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
