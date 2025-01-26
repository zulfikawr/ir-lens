import "./globals.css";
import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ArticleContextProvider from "@/context/ArticleContext";
import { Toaster } from "@/components/ui/toaster"

export const metadata: Metadata = {
  title: "IR Lens",
  description: "International Relations News",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link
          rel="icon"
          href="/images/IR.png"
          type="image/x-icon"
        />
      </head>
      <body>
        <ArticleContextProvider>
          <Header />
          <main>
            {children}
            <Toaster />
          </main>
          <Footer />
        </ArticleContextProvider>
      </body>
    </html>
  );
}
