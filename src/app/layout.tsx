import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/lib/components/layout/navbar";
import { Footer } from "@/lib/components/layout/footer";
import { CartDrawer } from "@/lib/components/cart/cart-drawer";
import { MockAuthModal } from "@/lib/components/auth/mock-auth-modal";
import { AuthProvider } from "@/lib/components/auth/auth-provider";
import { ToastContainer } from "@/lib/components/ui/toast-container";

export const metadata: Metadata = {
  title: "Store - Ecommerce Demo",
  description: "Demo ecommerce app built with Next.js and SQLite",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-white text-neutral-900">
        <AuthProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
          <CartDrawer />
          <MockAuthModal />
          <ToastContainer />
        </AuthProvider>
      </body>
    </html>
  );
}
