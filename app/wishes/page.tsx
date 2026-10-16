import type { Metadata } from "next";
import WeddingWishes from "@/components/wedding-wishes";

export const metadata: Metadata = {
  title: "Wedding Wishes · Afifa & Rehan",
  description: "Our first anniversary is almost here. Write us a little love, and read the wishes everyone has sent.",
  openGraph: {
    title: "Leave a wish for Afifa & Rehan ♥",
    description: "Our first anniversary is almost here. Write us a little love, and read the wishes everyone has sent.",
    url: "https://www.afifaziya.com/wishes",
    siteName: "Afifa & Rehan Wedding",
    images: [{ url: "/og-wishes.jpg", width: 1200, height: 630, alt: "Wedding Wishes for Afifa & Rehan" }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Leave a wish for Afifa & Rehan ♥",
    description: "Our first anniversary is almost here. Write us a little love, and read the wishes everyone has sent.",
    images: ["/og-wishes.jpg"],
  },
};

export default function WishesPage() {
  return <WeddingWishes />;
}
