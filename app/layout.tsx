import type { Metadata } from "next";
import { Instrument_Serif, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: ["400"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400"],
});

export const metadata: Metadata = {
  title: "Afifa & Rehan Wedding Countdown",
  description: "Wedding countdown for Afifa & Rehan - October 22, 2025. Join us for the Haldi ceremony on October 20th, Mehendi celebration on October 21st, and the Nikah ceremony on October 22nd, 2025.",
  keywords: ["wedding", "countdown", "Afifa", "Rehan", "October 2025", "Haldi", "Mehendi", "Nikah"],
  authors: [{ name: "Afifa & Rehan" }],
  openGraph: {
    title: "Afifa & Rehan Wedding Countdown",
    description: "Wedding countdown for Afifa & Rehan - October 22, 2025. Join us for the Haldi ceremony on October 20th, Mehendi celebration on October 21st, and the Nikah ceremony on October 22nd, 2025.",
    url: "https://www.afifaziya.com/",
    siteName: "Afifa & Rehan Wedding",
    images: [
      {
        url: "/OG.png",
        width: 1200,
        height: 630,
        alt: "Afifa & Rehan Wedding Countdown - October 22, 2025",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Afifa & Rehan Wedding Countdown",
    description: "Wedding countdown for Afifa & Rehan - October 22, 2025. Join us for the celebrations!",
    images: ["/OG.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
  viewport: "width=device-width, initial-scale=1",
  themeColor: "#d87558",
  icons: {
    icon: [
      { url: "/Icon-32w.png", sizes: "32x32", type: "image/png" },
      { url: "/Icon-256w.png", sizes: "256x256", type: "image/png" },
    ],
    shortcut: "/Icon-32w.png",
    apple: [
      { url: "/Icon-256w.png", sizes: "256x256", type: "image/png" },
    ],
  },
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${instrumentSerif.variable} ${jetbrainsMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
