import type { Metadata } from "next";
import { Inter, Space_Grotesk, Space_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

const spaceMono = Space_Mono({
  variable: "--font-space-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  ),
  title: {
    default: "BulSU MSC — Microsoft Student Community",
    template: "%s | BulSU MSC",
  },
  description:
    "Official website of the BulSU MSC (Bulacan State University Microsoft Student Community). Connect with student activities, announcements, calendars, and member programs.",
  keywords: [
    "BulSU",
    "Bulacan State University",
    "MSC",
    "Microsoft Student Community",
    "Student Organization",
    "BulSU MSC",
  ],
  authors: [{ name: "BulSU MSC" }],
  openGraph: {
    type: "website",
    locale: "en_PH",
    url: "/",
    siteName: "BulSU MSC",
    title: "BulSU MSC — Microsoft Student Community",
    description:
      "Official website of the BulSU MSC (Bulacan State University Microsoft Student Community).",
  },
  icons: {
    icon: "/favicon.ico",
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
      className={`${inter.variable} ${spaceGrotesk.variable} ${spaceMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-black text-white">
        {children}
      </body>
    </html>
  );
}