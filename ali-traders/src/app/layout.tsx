import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { StoreProvider } from "@/context/StoreContext";
import AuthProvider from "@/components/AuthProvider";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Ali Traders – Your Trusted Tech Accessories Store",
  description: "Shop quality mobile phones, headphones, chargers, cables and more at Ali Traders, Rahim Yar Khan.",
  keywords: "tech accessories, mobile phones, headphones, chargers, power banks, Rahim Yar Khan",
  openGraph: {
    title: "Ali Traders",
    description: "Your Trusted Tech Accessories Store in Rahim Yar Khan",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <AuthProvider>
            <StoreProvider>
              <Header />
              <main>{children}</main>
              <Footer />
              <WhatsAppButton />
            </StoreProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
