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
  keywords: ["baby products", "premium baby essentials", "organic baby clothes", "baby gear", "innovative baby toys"],
  authors: [{ name: "TinyDreams Team" }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://tinydreams.store',
    siteName: 'TinyDreams',
    title: 'TinyDreams | Premium Baby Essentials',
    description: 'Curated collection of premium, safe, and innovative baby products.',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?q=80&w=1200&h=630&auto=format&fit=crop',
        width: 1200,
        height: 630,
        alt: 'TinyDreams Premium Baby Essentials',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TinyDreams | Premium Baby Essentials',
    description: 'Curated collection of premium, safe, and innovative baby products.',
    images: ['https://images.unsplash.com/photo-1519689680058-324335c77eba?q=80&w=1200&h=630&auto=format&fit=crop'],
  },
  icons: {
    icon: '/favicon.ico',
  },
  robots: {
    index: true,
    follow: true,
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
