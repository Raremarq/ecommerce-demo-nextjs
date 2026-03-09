"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { X, ShoppingBag } from "lucide-react";
import { useCartStore } from "@/lib/stores/cart";
import { useAuthStore } from "@/lib/stores/auth";
import { getCartItems, updateCartItemQuantity, removeCartItem } from "@/app/actions";
import { Button } from "@/lib/components/ui/button";
import { EmptyState } from "@/lib/components/ui/empty-state";
import { formatCurrency } from "@/lib/utils/format-currency";
import { useToastStore } from "@/lib/stores/toast";

type CartItemWithProduct = Awaited<ReturnType<typeof getCartItems>>[number];

export function CartDrawer() {
  const { isDrawerOpen, closeDrawer } = useCartStore();
  const currentUser = useAuthStore((s) => s.currentUser);
  const toast = useToastStore();
  const [items, setItems] = useState<CartItemWithProduct[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isDrawerOpen && currentUser) {
      setLoading(true);
      getCartItems(currentUser.id)
        .then(setItems)
        .finally(() => setLoading(false));
    }
  }, [isDrawerOpen, currentUser]);

  async function handleUpdateQty(id: number, qty: number) {
    await updateCartItemQuantity(id, qty);
    if (currentUser) {
      const updated = await getCartItems(currentUser.id);
      setItems(updated);
    }
  }

  async function handleRemove(id: number) {
    await removeCartItem(id);
    toast.success("Item removed from cart");
    if (currentUser) {
      const updated = await getCartItems(currentUser.id);
      setItems(updated);
    }
  }

  const subtotal = items.reduce(
    (sum, item) => sum + item.product.priceCents * item.quantity,
    0
  );

  if (!isDrawerOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/50" onClick={closeDrawer} />
      <div className="relative bg-white w-full max-w-md flex flex-col shadow-xl">
        <div className="flex items-center justify-between p-4 border-b border-neutral-200">
          <h2 className="text-lg font-semibold">Shopping Cart</h2>
          <button
            onClick={closeDrawer}
            className="text-neutral-400 hover:text-neutral-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-20 bg-neutral-100 rounded-lg animate-pulse"
                />
              ))}
            </div>
          ) : items.length === 0 ? (
            <EmptyState
              icon={ShoppingBag}
              title="Cart is empty"
              description="Add some products to get started"
            />
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-3 p-3 rounded-lg border border-neutral-100"
                >
                  <img
                    src={item.product.imageUrl}
                    alt={item.product.title}
                    className="h-16 w-16 object-cover rounded-md"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-neutral-900 truncate">
                      {item.product.title}
                    </p>
                    <p className="text-sm text-neutral-500">
                      {formatCurrency(item.product.priceCents)}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <button
                        onClick={() =>
                          handleUpdateQty(item.id, item.quantity - 1)
                        }
                        className="h-6 w-6 rounded border border-neutral-200 text-xs hover:bg-neutral-50"
                      >
                        -
                      </button>
                      <span className="text-sm w-6 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          handleUpdateQty(item.id, item.quantity + 1)
                        }
                        className="h-6 w-6 rounded border border-neutral-200 text-xs hover:bg-neutral-50"
                      >
                        +
                      </button>
                      <button
                        onClick={() => handleRemove(item.id)}
                        className="ml-auto text-xs text-red-500 hover:text-red-700"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-neutral-200 p-4 space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-neutral-600">Subtotal</span>
              <span className="font-semibold">
                {formatCurrency(subtotal)}
              </span>
            </div>
            <Link href="/cart" onClick={closeDrawer}>
              <Button variant="outline" className="w-full">
                View Cart
              </Button>
            </Link>
            <Link href="/checkout" onClick={closeDrawer}>
              <Button className="w-full mt-2">Checkout</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
