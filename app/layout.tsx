import type { Metadata } from "next";
import "./globals.css";

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
    icon: "/brand/msc-stacked-color.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth" className="h-full antialiased">
      <body className="flex min-h-full flex-col bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}
