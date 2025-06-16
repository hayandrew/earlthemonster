import type { Metadata } from "next";
import { Libre_Baskerville, Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const libreBaskerville = Libre_Baskerville({
  weight: ['400', '700'],
  subsets: ["latin"],
  display: 'swap',
  variable: '--font-libre-baskerville',
});

const inter = Inter({
  subsets: ["latin"],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://earlselasticstretchysocks.com'),
  title: "Earl's Elastic, Stretchy Socks",
  description: "A whimsical bedtime story about a happy monster and his magical socks, perfect for anyone who loves socks or likes spending time with a big yellow monster.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${libreBaskerville.variable} ${inter.variable}`}>
      <body className={`${inter.className} bg-[#1f7285] min-h-screen`}>
        <Header />
        <main className="pt-16">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
