import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SiteBanner from "@/components/layout/SiteBanner";
import { CartProvider } from "@/context/CartContext";
import CartDrawer from "@/components/layout/CartDrawer";
import { AuthProvider } from "@/context/AuthContext";
import { ToastProvider } from "@/context/ToastContext";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    template: '%s | TinyDreams',
    default: 'TinyDreams | Premium Baby Essentials',
  },
  description: "Discover TinyDreams' curated collection of premium, safe, and innovative baby products. From ergonomic carriers to organic clothing, we have everything your little one needs.",
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body className={`${montserrat.variable} antialiased font-sans bg-background text-foreground`}>
        <SiteBanner />
        <ToastProvider>
          <AuthProvider>
            <CartProvider>
              <Header />
              <CartDrawer />
              <main className="min-h-screen pt-20">
                {children}
              </main>
              <Footer />
            </CartProvider>
          </AuthProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
