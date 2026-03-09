"use client";

import Link from "next/link";
import { ShoppingCart, Menu, X, Store } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuthStore } from "@/lib/stores/auth";
import { useCartStore } from "@/lib/stores/cart";
import { UserMenu } from "@/lib/components/auth/user-menu";
import { Button } from "@/lib/components/ui/button";
import { getCartCount } from "@/app/actions";

export function Navbar() {
  const { currentUser, openAuthModal } = useAuthStore();
  const { openDrawer } = useCartStore();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    if (currentUser) {
      getCartCount(currentUser.id).then(setCartCount);
    } else {
      setCartCount(0);
    }
  }, [currentUser]);

  // Poll cart count periodically when user is logged in
  useEffect(() => {
    if (!currentUser) return;
    const interval = setInterval(() => {
      getCartCount(currentUser.id).then(setCartCount);
    }, 2000);
    return () => clearInterval(interval);
  }, [currentUser]);

  const navLinks = [
    { href: "/products", label: "Products" },
    ...(currentUser?.role === "admin"
      ? [{ href: "/admin", label: "Admin" }]
      : []),
  ];

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <Link
              href="/"
              className="flex items-center gap-2 text-xl font-bold text-neutral-900"
            >
              <Store className="h-6 w-6 text-primary-600" />
              Store
            </Link>
            <nav className="hidden md:flex items-center gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm font-medium text-neutral-600 hover:text-neutral-900 transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-3">
            {currentUser && (
              <button
                onClick={openDrawer}
                className="relative p-2 text-neutral-600 hover:text-neutral-900 transition-colors"
              >
                <ShoppingCart className="h-5 w-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-primary-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </button>
            )}

            <div className="hidden md:block">
              {currentUser ? (
                <UserMenu />
              ) : (
                <Button size="sm" onClick={openAuthModal}>
                  Sign In
                </Button>
              )}
            </div>

            <button
              className="md:hidden p-2 text-neutral-600"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div className="md:hidden border-t border-neutral-100 py-4 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="block px-2 py-2 text-sm font-medium text-neutral-600 hover:text-neutral-900"
              >
                {link.label}
              </Link>
            ))}
            {!currentUser && (
              <Button
                size="sm"
                className="w-full"
                onClick={() => {
                  setMobileOpen(false);
                  openAuthModal();
                }}
              >
                Sign In
              </Button>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
