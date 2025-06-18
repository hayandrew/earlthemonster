import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

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
    <html lang="en">
      <body className="bg-[#1f7285] min-h-screen flex flex-col">
        <Header />
        <main className="pt-16 flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
