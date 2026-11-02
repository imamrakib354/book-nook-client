import type { Metadata } from "next";
import { Suspense } from "react";
import { Inter, DM_Serif_Display } from "next/font/google";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
});

const dmSerif = DM_Serif_Display({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-dm-serif",
});

export const metadata: Metadata = {
  title: "BookNook",
  description: "Discover, borrow, and share books.",
};

const RootLayout = ({ children }: LayoutProps<"/">) => {
  return (
    <html lang="en" className={`${dmSerif.variable} h-full antialiased`}>
      <body className={`${inter.className} flex min-h-screen flex-col bg-[#0b191a] text-white`}>
        <Suspense fallback={<div className="h-[76px] border-b border-white/5 bg-[#0e1d1e]" />}>
          <Navbar />
        </Suspense>
        <div className="flex flex-1 flex-col">{children}</div>
        <Footer />
      </body>
    </html>
  );
};

export default RootLayout;
