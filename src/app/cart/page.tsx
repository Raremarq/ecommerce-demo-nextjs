"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ShoppingBag, Minus, Plus, Trash2 } from "lucide-react";
import { useAuthStore } from "@/lib/stores/auth";
import { useToastStore } from "@/lib/stores/toast";
import {
  getCartItems,
  updateCartItemQuantity,
  removeCartItem,
} from "@/app/actions";
import { Button } from "@/lib/components/ui/button";
import { EmptyState } from "@/lib/components/ui/empty-state";
import { formatCurrency } from "@/lib/utils/format-currency";

type CartItemWithProduct = Awaited<ReturnType<typeof getCartItems>>[number];

export default function CartPage() {
  const currentUser = useAuthStore((s) => s.currentUser);
  const openAuthModal = useAuthStore((s) => s.openAuthModal);
  const toast = useToastStore();
  const [items, setItems] = useState<CartItemWithProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (currentUser) {
      setLoading(true);
      getCartItems(currentUser.id)
        .then(setItems)
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [currentUser]);

  async function refresh() {
    if (currentUser) {
      setItems(await getCartItems(currentUser.id));
    }
  }

  async function handleUpdateQty(id: number, qty: number) {
    await updateCartItemQuantity(id, qty);
    await refresh();
  }

  async function handleRemove(id: number) {
    await removeCartItem(id);
    toast.success("Item removed");
    await refresh();
  }

  const subtotal = items.reduce(
    (sum, item) => sum + item.product.priceCents * item.quantity,
    0,
  );
  const shipping = 599;
  const tax = Math.round(subtotal * 0.08);
  const total = subtotal + shipping + tax;

  if (!currentUser) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <EmptyState
          icon={ShoppingBag}
          title="Sign in to view your cart"
          description="You need to be signed in to manage your shopping cart"
          action={<Button onClick={openAuthModal}>Sign In</Button>}
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-neutral-900 mb-8">
        Shopping Cart
      </h1>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-24 bg-neutral-100 rounded-lg animate-pulse"
            />
          ))}
        </div>
      ) : items.length === 0 ? (
        <EmptyState
          icon={ShoppingBag}
          title="Your cart is empty"
          description="Browse products and add items to your cart"
          action={
            <Link href="/products">
              <Button>Browse Products</Button>
            </Link>
          }
        />
      ) : (
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex gap-4 p-4 rounded-xl border border-neutral-200"
              >
                <img
                  src={item.product.imageUrl}
                  alt={item.product.title}
                  className="h-24 w-24 object-cover rounded-lg"
                />
                <div className="flex-1 min-w-0">
                  <Link
                    href={`/products/${item.product.slug}`}
                    className="font-medium text-neutral-900 hover:text-primary-600"
                  >
                    {item.product.title}
                  </Link>
                  <p className="text-sm text-neutral-500 mt-0.5">
                    {formatCurrency(item.product.priceCents)} each
                  </p>
                  <div className="flex items-center gap-3 mt-3">
                    <div className="flex items-center border border-neutral-200 rounded-lg">
                      <button
                        onClick={() =>
                          handleUpdateQty(item.id, item.quantity - 1)
                        }
                        className="p-1.5 hover:bg-neutral-50"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="w-8 text-center text-sm">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          handleUpdateQty(item.id, item.quantity + 1)
                        }
                        className="p-1.5 hover:bg-neutral-50"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                    <button
                      onClick={() => handleRemove(item.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-semibold">
                    {formatCurrency(item.product.priceCents * item.quantity)}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-neutral-50 rounded-xl p-6 h-fit">
            <h2 className="font-semibold text-lg mb-4">Order Summary</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-neutral-600">Subtotal</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-600">Shipping</span>
                <span>{formatCurrency(shipping)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-600">Tax (8%)</span>
                <span>{formatCurrency(tax)}</span>
              </div>
              <div className="border-t border-neutral-200 pt-2 mt-2">
                <div className="flex justify-between font-semibold text-base">
                  <span>Total</span>
                  <span>{formatCurrency(total)}</span>
                </div>
              </div>
            </div>
            <Link href="/checkout">
              <Button className="w-full mt-6">Proceed to Checkout</Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
