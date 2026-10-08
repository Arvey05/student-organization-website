import type { Metadata } from "next";
import { Archivo, Montserrat, Space_Mono, Dela_Gothic_One } from "next/font/google";
import "./globals.css";

// Telegraf substitute → Archivo variable font (stretch + weight axes)
const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  axes: ["wdth"],
});

// Gotham substitute → Montserrat
const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

// Dela Gothic One → data / impact numerals
const delaGothic = Dela_Gothic_One({
  variable: "--font-dela-gothic",
  subsets: ["latin"],
  weight: "400",
});

// Monospace for code and caps labels
const spaceMono = Space_Mono({
  variable: "--font-space-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "BulSU MSC — Microsoft Student Community",
  description:
    "The official BulSU Microsoft Student Community member portal. Access activities, announcements, calendars, and organization programs.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${archivo.variable} ${montserrat.variable} ${delaGothic.variable} ${spaceMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-[#02001F] text-[#FDFBFB]">
        {children}
      </body>
    </html>
  );
}