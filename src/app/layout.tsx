import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { urlFor } from "@/sanity/imageUrl";
import { client } from "@/sanity/client";
import "./globals.css";

const SITE_SETTINGS_QUERY = `*[_type == "globalSettings"][0]
{
 websiteTitle,
 websiteDescription,
 metadataImage,
 favicon
}`;

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  const siteSettings = await client.fetch(SITE_SETTINGS_QUERY);

  const title = siteSettings?.websiteTitle || "Captain Falc Studios";
  const description =
    siteSettings?.websiteDescription ||
    "Official Website for Captain Falc Studios";
  const siteUrl = "https://captainfalc.com";
  const imageUrl = siteSettings?.metadataImage
    ? urlFor(siteSettings.metadataImage).width(1200).height(630).url()
    : `${siteUrl}/default-og.jpg`;

  return {
    title,
    description,
    keywords: [
      "audio",
      "music",
      "studio",
      "hardcore",
      "metalcore",
      "heavy metal",
      "punk",
    ],
    creator: "Captain Falc Studios",
    applicationName: "Captain Falc Studios",

    openGraph: {
      title,
      description,
      url: siteUrl,
      siteName: title,
      type: "website",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: "Captain Falc Studios branding",
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      title,
      description,
      site: "@captainfalc",
      images: [imageUrl],
    },

    icons: {
      icon: {
        url: urlFor(siteSettings.favicon).width(64).height(64).url(),
        type: "image/png",
      },
      apple: "/apple-touch-icon.png",
    },

    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-snippet": -1,
        "max-image-preview": "large",
        "max-video-preview": -1,
      },
    },
  };
}

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
        {children}
      </body>
    </html>
  );
}
