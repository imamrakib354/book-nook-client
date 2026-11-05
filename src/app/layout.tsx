import type { Metadata } from "next";
import { Suspense } from "react";
import { Inter, DM_Serif_Display } from "next/font/google";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { ThemeProvider } from "@/components/theme-provider";
import { ToastContainer } from "react-toastify";
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
    <html
      lang="en"
      suppressHydrationWarning
      className={`${dmSerif.variable} h-full antialiased`}
    >
      <body
        className={`${inter.className} flex min-h-screen flex-col bg-background text-foreground`}
      >
        <ThemeProvider>
          <Suspense
            fallback={
              <div className="h-[76px] border-b border-border bg-chrome" />
            }
          >
            <Navbar />
          </Suspense>

          <div className="flex flex-1 flex-col">
            {children}
          </div>

          <Footer />

          <ToastContainer
            position="top-center"
            autoClose={3000}
            theme="dark"
            newestOnTop
            closeOnClick
            toastStyle={{
              background: "var(--card)",
              color: "var(--foreground)",
              border: "1px solid var(--border)",
              borderRadius: "12px",
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  );
};

export default RootLayout;
