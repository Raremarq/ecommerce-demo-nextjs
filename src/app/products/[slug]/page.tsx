"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, ShoppingCart, Minus, Plus } from "lucide-react";
import Link from "next/link";
import { getProductBySlug, addToCart } from "@/app/actions";
import { Button } from "@/lib/components/ui/button";
import { Badge } from "@/lib/components/ui/badge";
import { formatCurrency } from "@/lib/utils/format-currency";
import { useAuthStore } from "@/lib/stores/auth";
import { useCartStore } from "@/lib/stores/cart";
import { useToastStore } from "@/lib/stores/toast";
import type { Product } from "@/db/schema";

export default function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const router = useRouter();
  const currentUser = useAuthStore((s) => s.currentUser);
  const openAuthModal = useAuthStore((s) => s.openAuthModal);
  const { openDrawer } = useCartStore();
  const toast = useToastStore();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    getProductBySlug(slug)
      .then(setProduct)
      .finally(() => setLoading(false));
  }, [slug]);

  async function handleAddToCart() {
    if (!currentUser) {
      openAuthModal();
      return;
    }
    if (!product) return;
    setAdding(true);
    await addToCart(currentUser.id, product.id, quantity);
    toast.success(`${product.title} added to cart`);
    openDrawer();
    setAdding(false);
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid md:grid-cols-2 gap-12">
          <div className="aspect-square bg-neutral-100 rounded-xl animate-pulse" />
          <div className="space-y-4">
            <div className="h-8 bg-neutral-100 rounded w-3/4 animate-pulse" />
            <div className="h-6 bg-neutral-100 rounded w-1/4 animate-pulse" />
            <div className="h-24 bg-neutral-100 rounded animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Product not found</h1>
        <Link href="/products">
          <Button variant="outline">Back to Products</Button>
        </Link>
      </div>
    );
  }

  const outOfStock = product.stock <= 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link
        href="/products"
        className="inline-flex items-center gap-1 text-sm text-neutral-500 hover:text-neutral-700 mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Products
      </Link>

      <div className="grid md:grid-cols-2 gap-12">
        <div className="aspect-square rounded-xl overflow-hidden bg-neutral-100">
          <img
            src={product.imageUrl}
            alt={product.title}
            className="h-full w-full object-cover"
          />
        </div>

        <div>
          <Badge className="mb-3">{product.category}</Badge>
          <h1 className="text-3xl font-bold text-neutral-900 mb-2">
            {product.title}
          </h1>

          <div className="flex items-center gap-3 mb-4">
            <span className="text-2xl font-bold text-neutral-900">
              {formatCurrency(product.priceCents)}
            </span>
            {product.compareAtPriceCents && (
              <span className="text-lg text-neutral-400 line-through">
                {formatCurrency(product.compareAtPriceCents)}
              </span>
            )}
          </div>

          <p className="text-neutral-600 mb-6 leading-relaxed">
            {product.description}
          </p>

          <div className="flex items-center gap-2 mb-4">
            <span className="text-sm text-neutral-500">
              {outOfStock ? (
                <span className="text-red-600 font-medium">Out of stock</span>
              ) : (
                <span>
                  <span className="font-medium text-green-600">In stock</span>{" "}
                  — {product.stock} available
                </span>
              )}
            </span>
          </div>

          {!outOfStock && (
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center border border-neutral-200 rounded-lg">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 hover:bg-neutral-50"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-12 text-center font-medium">{quantity}</span>
                <button
                  onClick={() =>
                    setQuantity(Math.min(product.stock, quantity + 1))
                  }
                  className="p-2 hover:bg-neutral-50"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          <Button
            size="lg"
            className="w-full sm:w-auto"
            disabled={outOfStock}
            loading={adding}
            onClick={handleAddToCart}
          >
            <ShoppingCart className="h-5 w-5" />
            {outOfStock ? "Out of Stock" : "Add to Cart"}
          </Button>
        </div>
      </div>
    </div>
  );
}
