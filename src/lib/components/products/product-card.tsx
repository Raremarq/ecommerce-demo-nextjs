"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import type { Product } from "@/db/schema";
import { Badge } from "@/lib/components/ui/badge";
import { Button } from "@/lib/components/ui/button";
import { formatCurrency } from "@/lib/utils/format-currency";
import { useAuthStore } from "@/lib/stores/auth";
import { useCartStore } from "@/lib/stores/cart";
import { useToastStore } from "@/lib/stores/toast";
import { addToCart } from "@/app/actions";

export function ProductCard({ product }: { product: Product }) {
  const currentUser = useAuthStore((s) => s.currentUser);
  const { openDrawer } = useCartStore();
  const openAuthModal = useAuthStore((s) => s.openAuthModal);
  const toast = useToastStore();

  async function handleAddToCart(e: React.MouseEvent) {
    e.preventDefault();
    if (!currentUser) {
      openAuthModal();
      return;
    }
    await addToCart(currentUser.id, product.id);
    toast.success(`${product.title} added to cart`);
    openDrawer();
  }

  const outOfStock = product.stock <= 0;

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group block rounded-xl border border-neutral-200 bg-white overflow-hidden hover:shadow-lg transition-shadow"
    >
      <div className="relative aspect-square overflow-hidden bg-neutral-100">
        <img
          src={product.imageUrl}
          alt={product.title}
          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-3 left-3">
          <Badge>{product.category}</Badge>
        </div>
        {outOfStock && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="text-white font-semibold text-sm">
              Out of Stock
            </span>
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-medium text-neutral-900 group-hover:text-primary-600 transition-colors line-clamp-1">
          {product.title}
        </h3>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-lg font-bold text-neutral-900">
            {formatCurrency(product.priceCents)}
          </span>
          {product.compareAtPriceCents && (
            <span className="text-sm text-neutral-400 line-through">
              {formatCurrency(product.compareAtPriceCents)}
            </span>
          )}
        </div>
        <Button
          size="sm"
          variant="outline"
          className="w-full mt-3"
          disabled={outOfStock}
          onClick={handleAddToCart}
        >
          <ShoppingCart className="h-4 w-4" />
          {outOfStock ? "Out of Stock" : "Add to Cart"}
        </Button>
      </div>
    </Link>
  );
}
