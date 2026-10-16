import type { Metadata } from "next";
import WeddingWishes from "@/components/wedding-wishes";

export const metadata: Metadata = {
  title: "Wedding Wishes · Afifa & Rehan",
  description: "Leave a wish for Afifa & Rehan, and read the love everyone has sent.",
  openGraph: {
    title: "Wedding Wishes · Afifa & Rehan",
    description: "Leave a wish for Afifa & Rehan, and read the love everyone has sent.",
    url: "https://www.afifaziya.com/wishes",
    siteName: "Afifa & Rehan Wedding",
    images: [{ url: "/OG.png", width: 1200, height: 630, alt: "Afifa & Rehan" }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Wedding Wishes · Afifa & Rehan",
    description: "Leave a wish for Afifa & Rehan.",
    images: ["/OG.png"],
  },
};

export default function WishesPage() {
  return <WeddingWishes />;
}
