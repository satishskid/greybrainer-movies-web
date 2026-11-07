import type { Metadata } from "next";
import { PrivacyControls } from "@/components/PrivacyControls";
import { Navigation } from "@/components/Navigation";
import { absoluteUrl, NOINDEX, SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/site";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} | Deep AI Film Analysis`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: `${SITE_NAME} | Deep AI Film Analysis`,
    description: SITE_DESCRIPTION,
    url: absoluteUrl("/"),
    siteName: SITE_NAME,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} | Deep AI Film Analysis`,
    description: SITE_DESCRIPTION,
  },
  robots: {
    index: !NOINDEX,
    follow: !NOINDEX,
    googleBot: {
      index: !NOINDEX,
      follow: !NOINDEX,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="h-full antialiased bg-slate-900 text-slate-200"
    >
      <body className="min-h-full flex flex-col">
        <Navigation />
        {children}
        <PrivacyControls enabled={!NOINDEX} />
      </body>
    </html>
  );
}
